import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => 
      console.log("MongoDB connected successfully"));
     await mongoose.connect(`${process.env.MONGO_URI}/greencart?retryWrites=true&w=majority`)
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB;

