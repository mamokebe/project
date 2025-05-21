import express from 'express';
import authUser from '../middlewares/authUser.js';
import {  getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authAdmin from '../middlewares/authAdmin.js';

const orderRouter = express.Router();

// Create Order
orderRouter.post('/cod',  placeOrderCOD); // Create a new order
// Get Order by user
orderRouter.get('/user',  getUserOrders); // Get order by ID
// Get All Orders
orderRouter.get('/admin',  getAllOrders); // Get all orders for admin

orderRouter.post("/stripe",  placeOrderStripe) // Create order with stripe


export default orderRouter;
