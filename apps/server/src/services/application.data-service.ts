import {
  Prisma,
  type Job,
  type PrismaClient,
} from "../generated/prisma/client.js";
import {
  ApplicationStatus,
  JobStatus,
  ProfileFileKind,
} from "../generated/prisma/enums.js";

import { prisma } from "../database/index.js";
import type {
  SubmitApplicationInput,
  UpdateApplicationStatusInput,
} from "../schemas/application.schema.js";
import { ApiError } from "../tools/api-error.js";
import { validateProfileFile } from "../tools/profile-file.helper.js";
import { PrivateFileStorageService } from "./private-file.storage-service.js";

const APPLICATION_SELECT = {
  id: true,
  jobId: true,
  userId: true,
  coverLetter: true,
  status: true,
  createdAt: true,
  resume: {
    select: {
      filename: true,
      contentType: true,
      size: true,
    },
  },
} satisfies Prisma.ApplicationSelect;

type ApplicationSubmissionData = Prisma.ApplicationGetPayload<{
  select: typeof APPLICATION_SELECT;
}>;

type PreparedApplicationResume = Pick<
  Prisma.ApplicationResumeCreateWithoutApplicationInput,
  "path" | "filename" | "contentType" | "size"
>;

const duplicateApplicationError = () => {
  return new ApiError({
    statusCode: 409,
    code: "APPLICATION_ALREADY_SUBMITTED",
    message: "You have already applied for this job.",
  });
};

const validateJobEligibility = (
  job: Pick<Job, "status" | "applicationDeadline"> | null,
): void => {
  if (!job) {
    throw new ApiError({
      statusCode: 404,
      code: "JOB_NOT_FOUND",
      message: "This job could not be found.",
    });
  }

  const deadlinePassed =
    job.applicationDeadline !== null &&
    job.applicationDeadline.getTime() <= Date.now();

  if (job.status !== JobStatus.PUBLISHED || deadlinePassed) {
    throw new ApiError({
      statusCode: 409,
      code: "JOB_NOT_ACCEPTING_APPLICATIONS",
      message: "This job is no longer accepting applications.",
    });
  }
};

const prepareApplicationResume = async (
  userId: string,
  input: SubmitApplicationInput,
  file: Express.Multer.File | undefined,
  database: PrismaClient,
): Promise<PreparedApplicationResume> => {
  if (input.resumeSource === "upload") {
    if (!file) {
      throw new ApiError({
        statusCode: 422,
        code: "APPLICATION_RESUME_REQUIRED",
        message: "Choose a PDF resume before submitting.",
      });
    }

    const validatedFile = await validateProfileFile("resume", file);

    return PrivateFileStorageService.uploadFile(
      userId,
      "resume",
      validatedFile,
    );
  }

  if (file) {
    throw new ApiError({
      statusCode: 422,
      code: "INVALID_RESUME_SELECTION",
      message: "Choose either your saved resume or a new file, not both.",
    });
  }

  const savedResume = await database.profileFile.findFirst({
    where: {
      id: input.resumeFileId,
      userId,
      kind: ProfileFileKind.RESUME,
    },
  });

  if (!savedResume) {
    throw new ApiError({
      statusCode: 422,
      code: "APPLICATION_RESUME_UNAVAILABLE",
      message: "Select your saved resume or upload a new PDF.",
    });
  }

  const selectedVersion = new Date(input.resumeUpdatedAt).getTime();

  if (savedResume.updatedAt.getTime() !== selectedVersion) {
    throw new ApiError({
      statusCode: 409,
      code: "APPLICATION_RESUME_CHANGED",
      message: "Your saved resume changed. Review it again before submitting.",
    });
  }

  const path = await PrivateFileStorageService.copyResumeFile(
    userId,
    savedResume.path,
  );

  return {
    path,
    filename: savedResume.filename,
    contentType: savedResume.contentType,
    size: savedResume.size,
  };
};

const removeUnusedApplicationResume = async (
  userId: string,
  path: string,
): Promise<void> => {
  try {
    await PrivateFileStorageService.deleteFile(userId, "resume", path);
  } catch {
    console.error("Application resume cleanup required", {
      userId,
      path,
    });
  }
};

export const ApplicationDataService = {
  submitApplication: async (
    userId: string,
    input: SubmitApplicationInput,
    file?: Express.Multer.File,
    database: PrismaClient = prisma,
  ): Promise<ApplicationSubmissionData> => {
    const [job, existingApplication] = await Promise.all([
      database.job.findUnique({
        where: { id: input.jobId },
        select: {
          status: true,
          applicationDeadline: true,
        },
      }),
      database.application.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId: input.jobId,
          },
        },
        select: { id: true },
      }),
    ]);

    if (existingApplication) {
      throw duplicateApplicationError();
    }

    validateJobEligibility(job);

    const resume = await prepareApplicationResume(
      userId,
      input,
      file,
      database,
    );

    try {
      return await database.$transaction(
        async (transaction) => {
          await transaction.$queryRaw<Array<{ id: string }>>`
            SELECT "id"
            FROM "jobs"
            WHERE "id" = ${input.jobId}
            FOR SHARE
          `;

          const currentJob = await transaction.job.findUnique({
            where: { id: input.jobId },
            select: {
              status: true,
              applicationDeadline: true,
            },
          });

          validateJobEligibility(currentJob);

          return transaction.application.create({
            data: {
              userId,
              jobId: input.jobId,
              coverLetter: input.coverLetter ?? null,
              status: ApplicationStatus.SUBMITTED,
              resume: {
                create: resume,
              },
            },
            select: APPLICATION_SELECT,
          });
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );
    } catch (error) {
      const databaseErrorCode =
        error instanceof Prisma.PrismaClientKnownRequestError
          ? error.code
          : undefined;

      const isKnownRejection =
        error instanceof ApiError ||
        databaseErrorCode === "P2002" ||
        databaseErrorCode === "P2003" ||
        databaseErrorCode === "P2034";

      if (isKnownRejection) {
        await removeUnusedApplicationResume(userId, resume.path);
      } else {
        console.error("Application submission requires reconciliation", {
          userId,
          jobId: input.jobId,
          path: resume.path,
        });
      }

      if (databaseErrorCode === "P2002") {
        throw duplicateApplicationError();
      }

      if (databaseErrorCode === "P2003") {
        throw new ApiError({
          statusCode: 409,
          code: "APPLICATION_TARGET_UNAVAILABLE",
          message: "The job or your account is no longer available.",
        });
      }

      if (databaseErrorCode === "P2034") {
        throw new ApiError({
          statusCode: 409,
          code: "APPLICATION_SUBMISSION_CONFLICT",
          message:
            "The submission conflicted with another update. Please retry.",
        });
      }

      throw error;
    }
  },

  updateStatus: async (
    applicationId: string,
    input: UpdateApplicationStatusInput,
    database: PrismaClient = prisma,
  ) => {
    const existing = await database.application.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });

    if (!existing) {
      throw new ApiError({
        statusCode: 404,
        code: "APPLICATION_NOT_FOUND",
        message: "The requested application could not be found.",
      });
    }

    return database.application.update({
      where: { id: applicationId },
      data: { status: input.status },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  },
};
