import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecoded.id) {
      req.user = {id:tokenDecoded.id};   
    }else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export default authUser;