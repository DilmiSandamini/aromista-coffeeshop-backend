"use strict";
// src/index.ts
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
const auth_2 = require("./middleware/auth");
const role_1 = require("./middleware/role");
const user_model_1 = require("./models/user.model");
const adminSeeder_1 = require("./utils/adminSeeder");
dotenv_1.default.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://rad-72-sample-fe.vercel.app/login"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/items", item_1.default);
app.use("/api/v1/categories", category_1.default);
app.use("/api/v1/orders", order_1.default);
app.use("/api/v1/bookings", booking_1.default);
app.get("/", (req, res) => {
    res.send("Backend is running...");
});
app.get("/test-1", (req, res) => { });
app.get("/test-2", auth_2.authenticate, (req, res) => { });
app.get("/test-3", auth_2.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), (req, res) => { });
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("DB connected");
    (0, adminSeeder_1.seedAdmin)();
    console.log("Admin seeding process initiated");
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
app.listen(PORT, () => {
    console.log("Server is running");
});
