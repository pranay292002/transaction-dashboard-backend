import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
