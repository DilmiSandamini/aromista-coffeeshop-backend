"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Password hashing 
const user_model_1 = require("../models/user.model");
const seedAdmin = async () => {
    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        const adminName = process.env.DDEFAULT_ADMIN_FULLNAME;
        const adminContact = process.env.DEFAULT_ADMIN_CONTACT;
        if (!adminEmail || !adminPassword || !adminName || !adminContact) {
            console.error("Admin seeding failed: Missing environment variables.");
            return;
        }
        const existingAdmin = await user_model_1.User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists. Skipping seeding.");
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
        await user_model_1.User.create({
            fullname: adminName,
            email: adminEmail,
            password: hashedPassword,
            contactNumber: adminContact,
            roles: user_model_1.Role.ADMIN,
        });
        console.log("Admin user seeded successfully.");
    }
    catch (error) {
        console.error("Error seeding admin user:", error);
    }
};
exports.seedAdmin = seedAdmin;
