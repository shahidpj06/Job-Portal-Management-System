import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { sendSuccess } from "./tools/api-response.js";
import {
  adminApplicationsRouter,
  adminCompaniesRouter,
  adminDashboardRouter,
  adminJobsRouter,
  applicationsRouter,
  authRouter,
  jobsRouter,
  profileRouter,
} from "./apis/index.js";

const app = express();
const baseRoute = "/api/v1";

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get(`${baseRoute}/health`, (_request, response) => {
  return sendSuccess(response, {
    data: {
      status: "ok",
    },
    message: "JobNest API is healthy.",
  });
});

app.use(`${baseRoute}/auth`, authRouter);
app.use(`${baseRoute}/jobs`, jobsRouter);
app.use(`${baseRoute}/profile`, profileRouter);
app.use(`${baseRoute}/admin/companies`, adminCompaniesRouter);
app.use(`${baseRoute}/admin/jobs`, adminJobsRouter);
app.use(`${baseRoute}/applications`, applicationsRouter);
app.use(`${baseRoute}/admin/applications`, adminApplicationsRouter);
app.use(`${baseRoute}/admin/dashboard`, adminDashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
