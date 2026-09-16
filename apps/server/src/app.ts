import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import {
  adminApplicationsRouter,
  adminCompaniesRouter,
  adminDashboardRouter,
  adminJobsRouter,
  adminUsersRouter,
  applicationsRouter,
  authRouter,
  jobsRouter,
  profileRouter,
} from "./apis/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { sendSuccess } from "./tools/api-response.js";

const API_BASE_ROUTE = "/api/v1";
const DEFAULT_WEB_ORIGIN = "http://localhost:5173";
const HEALTH_STATUS = "ok";

const API_ROUTE = {
  adminApplications: `${API_BASE_ROUTE}/admin/applications`,
  adminCompanies: `${API_BASE_ROUTE}/admin/companies`,
  adminDashboard: `${API_BASE_ROUTE}/admin/dashboard`,
  adminJobs: `${API_BASE_ROUTE}/admin/jobs`,
  adminUsers: `${API_BASE_ROUTE}/admin/users`,
  applications: `${API_BASE_ROUTE}/applications`,
  auth: `${API_BASE_ROUTE}/auth`,
  health: `${API_BASE_ROUTE}/health`,
  jobs: `${API_BASE_ROUTE}/jobs`,
  profile: `${API_BASE_ROUTE}/profile`,
} as const;

const webOrigin = process.env.WEB_ORIGIN ?? DEFAULT_WEB_ORIGIN;

const application = express();

application.use(
  cors({
    credentials: true,
    origin: webOrigin,
  }),
);

application.use(express.json());
application.use(cookieParser());

application.get(API_ROUTE.health, (_request, response) => {
  return sendSuccess(response, {
    data: {
      status: HEALTH_STATUS,
    },
    message: "JobNest API is healthy.",
  });
});

application.use(API_ROUTE.adminApplications, adminApplicationsRouter);
application.use(API_ROUTE.adminCompanies, adminCompaniesRouter);
application.use(API_ROUTE.adminDashboard, adminDashboardRouter);
application.use(API_ROUTE.adminJobs, adminJobsRouter);
application.use(API_ROUTE.adminUsers, adminUsersRouter);
application.use(API_ROUTE.applications, applicationsRouter);
application.use(API_ROUTE.auth, authRouter);
application.use(API_ROUTE.jobs, jobsRouter);
application.use(API_ROUTE.profile, profileRouter);

application.use(notFoundHandler);
application.use(errorHandler);

export { application };
