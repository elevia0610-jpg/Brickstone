import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Admin } from "../models/Admin.js";

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username }).exec();
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    if (!secret) {
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { sub: String(admin._id), username: admin.username },
      secret,
      { expiresIn }
    );

    res.json({
      token,
      admin: { id: String(admin._id), username: admin.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}
