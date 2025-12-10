import bcrypt from "bcryptjs"; // Password hashing සඳහා
import { User, Role, Status } from "../models/user.model"; // User model සහ Role enum
import dotenv from "dotenv";

dotenv.config();

// .env ගොනුවෙන් Admin විස්තර ලබා ගැනීම
const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const ADMIN_FULLNAME = process.env.DEFAULT_ADMIN_FULLNAME || "Default Admin";

/**
 * Default Admin User කෙනෙකු Database එකට එක් කිරීමේ කාර්යය
 */
export const seedAdmin = async (): Promise<void> => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn("⚠️ Admin Seeding Skipped: DEFAULT_ADMIN_EMAIL or PASSWORD not set in .env");
        return;
    }

    try {
        // 1. Admin User සිටිනවාදැයි පරීක්ෂා කිරීම
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("✅ Default Admin already exists. No action taken.");
            return;
        }

        // 2. Password Hash කිරීම
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        // 3. නව Admin User නිර්මාණය කිරීම
        await User.create({
            fullname: ADMIN_FULLNAME,
            email: ADMIN_EMAIL,
            // contactNumber Required නිසා 00000 ලෙස placeholder එකක් තැබුවා
            contactNumber: 0, 
            password: hash,
            roles: [Role.ADMIN],
            approved: Status.APPROVED,
        });

        console.log(`✨ Default Admin user created: ${ADMIN_EMAIL} with role ADMIN`);

    } catch (error) {
        console.error("❌ Error during Admin Seeding:", error);
    }
};