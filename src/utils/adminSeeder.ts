import bcrypt from "bcryptjs"; // Password hashing 
import { User, Role, Status } from "../models/user.model"; 

export const seedAdmin = async () => {
    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        const adminName = process.env.DDEFAULT_ADMIN_FULLNAME;
        const adminContact = process.env.DEFAULT_ADMIN_CONTACT;

        if (!adminEmail || !adminPassword || !adminName || !adminContact) {
            console.error("Admin seeding failed: Missing environment variables.");
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists. Skipping seeding.");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            fullname: adminName,
            email: adminEmail,
            password: hashedPassword,
            contactNumber: adminContact,
            roles: Role.ADMIN,
        });

        console.log("Admin user seeded successfully.");
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};