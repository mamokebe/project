import express from 'express';
import { loginAdmin, checkAdminAuth, logoutAdmin,getAllUsers } from '../controllers/adminController.js';  
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();
// Login admin
adminRouter.post('/login', loginAdmin);
// Check admin authentication
adminRouter.get('/check-auth', authAdmin, checkAdminAuth);
// Logout admin
adminRouter.get('/logout', logoutAdmin);
// Update admin password
// adminRouter.put('/update-password', updateAdminPassword);
// Get all users
adminRouter.get('/users', getAllUsers);

export default adminRouter;
