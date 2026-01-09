import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./routes/auth"
import itemRouter from "./routes/item"
import categoryRouter from "./routes/category"
import orderRouter from "./routes/order"
import bookingRouter from "./routes/booking"
import { seedAdmin } from "./utils/adminSeeder";

dotenv.config()

const app = express();
const MONGO_URI = process.env.MONGO_URI as string

// 1. CORS Middleware (මුලින්ම තබන්න)
app.use(cors({
  origin: ['https://aromista-coffeeshop-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("DB connected");
    await seedAdmin(); 
  } catch (err) {
    console.error("DB error:", err);
  }
};

// Database connection middleware
app.use(async (req, res, next) => {
  // OPTIONS request එකක් නම් DB connect වන තුරු නොසිට ඉක්මනින් response කරන්න
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  await connectToDatabase();
  next();
});

// Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/items", itemRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/bookings", bookingRouter)

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

export default app;