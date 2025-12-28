import express from "express";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import auth from "../middleware/auth.middleware.js";
import { extractSkills } from "../utils/extractskills.js";
import { groqMatch } from "../services/grok.services.js";
// import Application from "../models/Application.js";


const router = express.Router();

/* =====================================
   APPLY & GENERATE AI MATCH
===================================== */
router.post("/", auth, async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    const resume = await Resume.findById(resumeId);
    const job = await Job.findById(jobId);

    if (!resume || !job) {
      return res.status(404).json({ message: "Resume or Job not found" });
    }

    const resumeSkills = extractSkills(resume.resumeText || "");
    const jobSkills = extractSkills(job.requirements || "");


    console.log("JOB SKILLS:", jobSkills);
    console.log("RESUME SKILLS:", resumeSkills);

    const skills_found = jobSkills.filter(skill =>
      resumeSkills.includes(skill)
    );

    const missing_skills = jobSkills.filter(skill =>
      !resumeSkills.includes(skill)
    );

    console.log(missing_skills);

    const match_score = jobSkills.length
      ? Math.round((skills_found.length / jobSkills.length) * 100)
      : 0;

    const summary = await groqMatch({
      match_score,
      skills_found,
      missing_skills,
      jobTitle: job.title,
    });

    res.json({
      match_score,
      skills_found,
      missing_skills,
      summary,
    });

  } catch (err) {
    console.error("MATCH ERROR:", err);
    res.status(500).json({ message: "Matching failed" });
  }
});

export default router;
