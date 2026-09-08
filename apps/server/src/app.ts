import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

export const app = express();

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "JobNest API is running",
  });
});