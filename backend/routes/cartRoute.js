import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateUserCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/update", updateUserCart)

export default cartRouter;
