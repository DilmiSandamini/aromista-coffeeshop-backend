import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./routes/auth"
import itemRouter from "./routes/item"
import categoryRouter from "./routes/category"
import orderRouter from "./routes/order"
import bookingRouter from "./routes/booking"
import { authenticate } from "./middleware/auth"
import { requireRole } from "./middleware/role"
import { Role } from "./models/user.model"
import { seedAdmin } from "./utils/adminSeeder";

dotenv.config()

const app = express();
const MONGO_URI = process.env.MONGO_URI as string

app.use(express.json())
app.use(cors({
  origin: 'https://aromista-coffeeshop-frontend.vercel.app', // ඔබේ frontend URL එක පමණක් මෙතනට දෙන්න
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("DB connected");

    // === ME TIKA ADD KARANNA ===
    console.log("Seeding admin...");
    await seedAdmin(); 
    // ===========================
    
  } catch (err) {
    console.error("DB error:", err);
  }
};

// ... anith middleware saha routes thala thiyenawa ...

app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/items", itemRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/bookings", bookingRouter)

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;