import {v2 as cloudinary} from 'cloudinary';
import Product from "../models/product.js";

//Add Product
export const addProduct = async (req, res) => { 
  try {
    let productData=JSON.parse(req.body.productData);
    const images=req.files
    let imagesUrl =await Promise.all(images.map(async (item) => {
      let result = await cloudinary.uploader.upload(item.path, {
        resource_type: "image"});
        return result.secure_url;
    }));
     await Product.create({
      ...productData,
      image: imagesUrl,
    });
    return res.status(200).json({ success: true, message: "Product added successfully"});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Get Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    return res.status(200).json({ success: true, message: "Products fetched successfully", products });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product fetched successfully", product });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//change Product inStock status
export const changeProductStatus = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id,{inStock});
    return res.status(200).json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
//Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

