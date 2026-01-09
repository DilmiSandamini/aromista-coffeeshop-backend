"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const item_1 = __importDefault(require("./routes/item"));
const category_1 = __importDefault(require("./routes/category"));
const order_1 = __importDefault(require("./routes/order"));
const booking_1 = __importDefault(require("./routes/booking"));
const adminSeeder_1 = require("./utils/adminSeeder");
dotenv_1.default.config();
const app = (0, express_1.default)();
const MONGO_URI = process.env.MONGO_URI;
// 1. CORS Middleware - මුලින්ම තිබිය යුතුයි
app.use((0, cors_1.default)({
    origin: ['https://aromista-coffeeshop-frontend.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express_1.default.json());
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected)
        return;
    try {
        await mongoose_1.default.connect(MONGO_URI);
        isConnected = true;
        console.log("DB connected");
        await (0, adminSeeder_1.seedAdmin)();
    }
    catch (err) {
        console.error("DB error:", err);
    }
};
// Database connection & Preflight Handling
app.use(async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    await connectToDatabase();
    next();
});
// Routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/items", item_1.default);
app.use("/api/v1/categories", category_1.default);
app.use("/api/v1/orders", order_1.default);
app.use("/api/v1/bookings", booking_1.default);
app.get("/", (req, res) => {
    res.send("Aromista Backend is running...");
});
exports.default = app;
