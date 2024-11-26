import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    bloodType: { type: String, required: true },
    birthday: { type: Date, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    role: { type: String, default: "teacher" },
  },
  { timestamps: true }
);

export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema);
