import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is missing");
}

  const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log(`Database connected with ${conn.connection.host}`);
  } catch (error) {
    console.error("Database error:", error);
    process.exit(1);
  }
};

export default connectDB;
