import express from 'express';
import { addProduct, getProducts, getProductById, changeProductStatus, deleteProduct } from '../controllers/productController.js';
import authAdmin from '../middlewares/authAdmin.js';
import { upload } from '../configs/multer.js'; // Assuming you have a multer configuration file


const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), addProduct); // Create a new product
productRouter.get('/list', getProducts); // Get all products
productRouter.get('/id', getProductById); // Get a product by ID
productRouter.post('/stock',  changeProductStatus); // Update a product by ID
productRouter.delete('/id', authAdmin, deleteProduct); // Delete a product by ID

export default productRouter;
