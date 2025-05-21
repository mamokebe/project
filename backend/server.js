import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import 'dotenv/config';
// Import routes
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRoute.js';
import productRouter from './routes/productRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 5000;

// Database connection
 await connectDB();
 await connectCloudinary(); // Assuming you have a function to connect to Cloudinary

// Allowed origins for CORS

// Update this array with your frontend URLs deployed
const allowedOrigins = ['http://localhost:5173','http://3.83.201.11:3000'];

app.post("/stripe", express.raw({type:"application/json"}), stripeWebhook)

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:allowedOrigins, credentials: true}));

//  routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter); 
app.use('/api/address',addressRouter); 
app.use("/api/order",orderRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
