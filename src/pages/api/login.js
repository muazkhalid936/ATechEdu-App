import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectToDatabase from "../../middlewares/connectDB";
import Student from "../../models/Student";
import Parent from "../../models/Parent";
import Teacher from "../../models/Teacher";
// import Admin from "../../models/Admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      await connectToDatabase();

      const userTypes = [
        { model: Student, role: "student" },
        { model: Parent, role: "parent" },
        { model: Teacher, role: "teacher" },
        // { model: Admin, role: "admin" }
      ];

      let user = null;
      let role = null;

      for (const userType of userTypes) {
        user = await userType.model.findOne({ email });
        if (user) {
          role = userType.role;
          break;
        }
      }

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Password is incorrect" });
      }

      const token = jwt.sign(
        { userId: user._id, role }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        username: user.username,
        role, 
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Server error. Please try again later." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
