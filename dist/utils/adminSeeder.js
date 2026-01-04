"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Password hashing සඳහා
const user_model_1 = require("../models/user.model"); // User model සහ Role enum
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// .env ගොනුවෙන් Admin විස්තර ලබා ගැනීම
const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const ADMIN_FULLNAME = process.env.DEFAULT_ADMIN_FULLNAME || "Default Admin";
/**
 * Default Admin User කෙනෙකු Database එකට එක් කිරීමේ කාර්යය
 */
const seedAdmin = async () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn("⚠️ Admin Seeding Skipped: DEFAULT_ADMIN_EMAIL or PASSWORD not set in .env");
        return;
    }
    try {
        // 1. Admin User සිටිනවාදැයි පරීක්ෂා කිරීම
        const existingAdmin = await user_model_1.User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log("✅ Default Admin already exists. No action taken.");
            return;
        }
        // 2. Password Hash කිරීම
        const hash = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 10);
        // 3. නව Admin User නිර්මාණය කිරීම
        await user_model_1.User.create({
            fullname: ADMIN_FULLNAME,
            email: ADMIN_EMAIL,
            // contactNumber Required නිසා 00000 ලෙස placeholder එකක් තැබුවා
            contactNumber: 0,
            password: hash,
            roles: [user_model_1.Role.ADMIN],
            approved: user_model_1.Status.ACTIVE,
        });
        console.log(`✨ Default Admin user created: ${ADMIN_EMAIL} with role ADMIN`);
    }
    catch (error) {
        console.error("❌ Error during Admin Seeding:", error);
    }
};
exports.seedAdmin = seedAdmin;
