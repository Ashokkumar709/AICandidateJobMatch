import express from "express";
import Job from "../models/Job.js";
import auth from "../middleware/auth.middleware.js";


const router = express.Router();

/* =====================================
   CREATE JOB (RECRUITER ONLY)
===================================== */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      title,
      description,
      requirements,
      location,
      salary_range,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      salary_range,
      recruiterId: req.user.id,
      status: "active",
      // skills: extractSkills(requirements || description),
    });

//     console.log(
//   "EXTRACTED JOB SKILLS:",
//   extractSkills(requirements || description)
// );


    res.status(201).json(job);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

/* ============================
   GET ALL ACTIVE JOBS
============================ */
router.get("/all", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* =====================================
   GET JOBS BY LOGGED-IN RECRUITER
===================================== */
router.get("/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({
      recruiterId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("GET MY JOBS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* =====================================
   GET SINGLE JOB
===================================== */
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("GET JOB ERROR:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

/* =====================================
   DELETE JOB
===================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "recruiter" ||
      job.recruiterId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
});

export default router;
