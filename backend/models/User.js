import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  role: {
    type: String,
    enum: ["candidate", "recruiter"],
    default: "candidate",
  },
  company: String,
});
export default mongoose.model("User", userSchema);
