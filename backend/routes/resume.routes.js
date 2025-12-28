import express from "express";
import fs from "fs";
import Resume from "../models/Resume.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* ===============================
   UPLOAD RESUME (TXT ONLY)
================================ */
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeText = fs.readFileSync(req.file.path, "utf-8");

    if (!resumeText.trim()) {
      return res.status(400).json({ message: "Resume is empty" });
    }

    const resume = await Resume.create({
      candidateId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      resumeText,
      skills: extractSkills(resumeText),
    });

    res.json(resume);
  } catch (err) {
    console.error("RESUME UPLOAD ERROR:", err);
    res.status(500).json({ message: "Resume upload failed" });
  }
});

/* ===============================
   GET MY RESUMES
================================ */
router.get("/me", auth, async (req, res) => {
  const resumes = await Resume.find({ candidateId: req.user.id });
  res.json(resumes);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await resume.deleteOne();
    res.json({ message: "Resume deleted" });
  } catch (err) {
    console.error("DELETE RESUME ERROR:", err);
    res.status(500).json({ message: "Failed to delete resume" });
  }
});


/* ===============================
   SKILL EXTRACTION
================================ */
function extractSkills(text = "") {
  const skillMap = {
    javascript: ["javascript", "js"],
    react: ["react", "reactjs"],
    node: ["node", "node.js"],
    express: ["express"],
    mongodb: ["mongodb", "mongo"],
    sql: ["sql", "mysql", "postgres"],
    python: ["python"],
    java: ["java"],
    aws: ["aws"],
    docker: ["docker"],
    html: ["html"],
    css: ["css"],
    git: ["git"],
  };

  const lower = text.toLowerCase();
  const found = [];

  for (const [skill, variants] of Object.entries(skillMap)) {
    if (variants.some(v => lower.includes(v))) {
      found.push(skill);
    }
  }

  return found;
}

export default router;
