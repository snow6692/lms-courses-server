import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";
dotenv.config();

const PORT = process.env.PORT || 5000;

await (async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

//Create server
