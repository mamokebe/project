
import User from "../models/user.js";

//update user cartData
export const updateUserCart = async (req, res) => {
  try {
    const userId= req.user?.id;
    const { cartItems} = req.body;
    // const { userId, cartItems } = req.body;
    // Update the user's cart data in the database
    await User.findByIdAndUpdate(userId, { cartItems });
    return res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}