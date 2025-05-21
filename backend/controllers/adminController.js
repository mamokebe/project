import jwt from "jsonwebtoken";
import User from "../models/user.js";
// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
  // Check if email and password are correct
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    // Generate a token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set the token in cookies
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"?"none": "strict",
    });
    return res.status(200).json({ success: true, message: "Admin logged in successfully" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
    
  }
}

//Admin authentication check
export const checkAdminAuth = async (req, res) => {
  try {
      return res.status(200).json({ success: true, message: "Admin authenticated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}

//Logout admin
export const logoutAdmin = async (req, res) => {
  try {
    // Clear the admin token cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"?"none": "strict",
    });
    return res.status(200).json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}
// Update admin password
export const updateAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // Validate input
  if (!oldPassword || !newPassword) {
    return res.status(400).json({success: false, message: "All fields are required" });
  }
  try {
    // Check if the old password is correct
    if (oldPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({success: false, message: "Incorrect old password" });
    }
    // Update the password
    process.env.ADMIN_PASSWORD = newPassword;
    return res.status(200).json({success: true, message: "Admin password updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the response
    return res.status(200).json({ success: true, message: "Users retrieved successfully", users });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}

