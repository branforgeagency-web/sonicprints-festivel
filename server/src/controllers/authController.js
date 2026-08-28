import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

function signToken(admin) {
  return jwt.sign({ sub: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.checkPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(admin);
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ admin: req.admin });
}
