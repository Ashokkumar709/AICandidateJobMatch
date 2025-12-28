// app.use("/api/feedback", feedbackRoutes);
// import feedbackRoutes from "./routes/feedback.routes.js";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./.env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import matchRoutes from "./routes/match.routes.js";
// import applicationRoutes from "./routes/application.routes.js";
// import path from "path";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/matches", matchRoutes);
// app.use("/api/applications", applicationRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
