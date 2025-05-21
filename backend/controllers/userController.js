import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

//Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({success: false, message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success: true, message: "User already exists" });
    }
    // Create new user
    // Hash password before saving (you should use bcrypt or similar library for hashing)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const user = await User.create({ name, email, password: hashedPassword });
    //token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set the token in the response cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production"? "none" : "Strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({success: true, message: "User registered successfully", user: {email:user.email, name: user.name}})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({success: false, message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(400).json({success: false, message: "Invalid email or password" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success: false, message: "Invalid email or password " });
    }
    //token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set the token in the response cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production"? "none" : "Strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({success: true, message: "User logged in successfully", user:{email:user.email, name:user.name}})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}

//check user Authentication
export const checkAuth = async (req, res) => {  
  try {
     const userId= req.user?.id;
    // const {userId} = req.body;
    //  console.log(userId)
     const user = await User.findById(userId).select("-password");
      // if (!user) {
      //   return res.status(401).json({success: false, message: "Unauthorized" });
      // }
      // console.log(user)
      return res.status(200).json({success: true, message: "User authenticated", user});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
    
  }
}

//logout user
export const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict" });
    // Optionally, you can also delete the token from the database if you are storing it there
    // await User.findByIdAndUpdate(userId, { $unset: { token: "" } });
    // Send a success response
    return res.status(200).json({success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success:false, message: "Server error" });
  }
}

