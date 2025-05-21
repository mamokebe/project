import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;
  // Check if token exists in cookies
  if (!adminToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const tokenDecoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (tokenDecoded.email===process.env.ADMIN_EMAIL) {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export default authAdmin;