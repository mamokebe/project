import Address from "../models/address.js";

//Add Address 
export const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    //validation for no user
    if(!userId){
      return res.status(404).json({ success: false, message: "Please login first" })
    }

    const {address} = req.body;
    await Address.create({...address, userId});
    
    return res.status(200).json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Get Address 
export const getAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    // const { userId } = req.body;
    const address = await Address.find({userId});
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    return res.status(200).json({ success: true, message: "Address fetched successfully", address });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByIdAndDelete(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    return res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Update Address
