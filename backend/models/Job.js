import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    requirements: String,
    location: String,
    salary_range: String,

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
