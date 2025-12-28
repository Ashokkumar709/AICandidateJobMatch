import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    // 🔴 THIS WAS MISSING
    fileUrl: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
