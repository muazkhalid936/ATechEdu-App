import dbConnect from "../../middlewares/connectDB";
import Student from "../../models/Student";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      birthday,
      sex,
    } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: "Student with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const student = new Student({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
        birthday,
        sex,
        role: "student",
      });

      await student.save();

      res
        .status(201)
        .json({ message: "Student created successfully!", student });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating student: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
