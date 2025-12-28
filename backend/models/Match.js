import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },

    match_score: Number,
    matching_skills: [String],
    missing_skills: [String],

    analysis: {
      summary: String,
      strengths: [String],
      gaps: [String],
    },

    status: { type: String, default: "reviewed" },
  },
  { timestamps: true }
);

export default mongoose.model("Match", MatchSchema);
