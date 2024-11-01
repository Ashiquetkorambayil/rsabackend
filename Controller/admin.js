const Admin = require('../Model/admin'); // Adjust the path as needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Create a new admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    admin.tokens = token;
    await admin.save();

    res.status(200).json({ token, message: "Admin logged in successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


