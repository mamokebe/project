import express from 'express';

import { registerUser,loginUser,logoutUser,checkAuth } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';



const userRouter = express.Router();

// Register a new user
userRouter.post('/register', registerUser);
// Login a user
userRouter.post('/login', loginUser);
// Logout a user
userRouter.get('/logout', logoutUser);
//checkAuthentication
userRouter.get('/check-auth', authUser, checkAuth);


export default userRouter;
