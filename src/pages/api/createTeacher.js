import bcrypt from "bcryptjs";
import connectToDatabase from "../../middlewares/connectDB";
import Teacher from "../../models/Teacher";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      bloodType,
      birthday,
      sex,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !bloodType ||
      !birthday ||
      !sex
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      await connectToDatabase();

      const existingUser = await Teacher.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Teacher with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newTeacher = new Teacher({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
        bloodType,
        birthday,
        sex,
      });

      await newTeacher.save();

      return res.status(201).json({ message: "Teacher created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
