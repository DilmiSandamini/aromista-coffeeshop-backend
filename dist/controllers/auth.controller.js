"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.toggleUserStatus = exports.updateUser = exports.saveUser = exports.getAllUsers = exports.getMyProfile = exports.refreshToken = exports.login = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokens_1 = require("../utils/tokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, contactNumber } = req.body;
        // left email form model, right side data varible
        //   User.findOne({ email: email })
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email exists" });
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        //   new User()
        const user = await user_model_1.User.create({
            fullname,
            email,
            contactNumber,
            password: hash,
            roles: [user_model_1.Role.CUSTOMER]
        });
        res.status(201).json({
            message: "User registed",
            data: { email: user.email, roles: user.roles }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error"
        });
    }
};
exports.registerUser = registerUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = (await user_model_1.User.findOne({ email }));
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const valid = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, tokens_1.signAccessToken)(existingUser);
        const refreshToken = (0, tokens_1.signRefreshToken)(existingUser);
        res.status(200).json({
            message: "success",
            data: {
                email: existingUser.email,
                roles: existingUser.roles,
                accessToken,
                refreshToken
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error"
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token required" });
        }
        const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        const user = await user_model_1.User.findById(payload.sub);
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const accessToken = (0, tokens_1.signAccessToken)(user);
        res.status(200).json({
            accessToken
        });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expire token" });
    }
};
exports.refreshToken = refreshToken;
const getMyProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await user_model_1.User.findById(req.user.sub).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const { fullname, email, roles, _id } = user;
    res.status(200).json({ message: "ok", data: { id: _id, email, roles, fullname } });
};
exports.getMyProfile = getMyProfile;
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const role = req.query.role;
        const status = req.query.status;
        // Filtering logic
        let query = {};
        if (role && role !== "ALL")
            query.roles = { $in: [role] };
        if (status && status !== "ALL")
            query.approved = status;
        // Fetch users and total count in parallel
        // dont want admin
        const [users, total] = await Promise.all([
            user_model_1.User.find(query)
                .select("-password")
                .$where('this.roles.indexOf("ADMIN") === -1')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            user_model_1.User.countDocuments(query)
        ]);
        // Count stats for the UI badges
        const [customerCount, staffCount, activeCount, inactiveCount] = await Promise.all([
            user_model_1.User.countDocuments({ roles: user_model_1.Role.CUSTOMER }),
            user_model_1.User.countDocuments({ roles: { $ne: user_model_1.Role.CUSTOMER } }),
            user_model_1.User.countDocuments({ approved: user_model_1.Status.ACTIVE }),
            user_model_1.User.countDocuments({ approved: user_model_1.Status.INACTIVE }),
        ]);
        res.status(200).json({
            message: "ok",
            data: users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
            stats: {
                all: await user_model_1.User.countDocuments(),
                customerCount,
                staffCount,
                activeCount,
                inactiveCount
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const saveUser = async (req, res) => {
    try {
        const { fullname, email, password, contactNumber, roles, approved } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.User({
            fullname,
            email,
            password: hashedPassword,
            contactNumber,
            roles, // මෙතනදී Admin තෝරන roles (ADMIN, BARISTA etc.) ඇතුළත් වේ
            approved: approved || user_model_1.Status.ACTIVE
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", data: newUser });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.saveUser = saveUser;
// Update User
const updateUser = async (req, res) => {
    try {
        const { fullname, email, contactNumber, roles, approved } = req.body;
        const updateData = { fullname, email, contactNumber, roles, approved };
        const updatedUser = await user_model_1.User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "User updated", data: updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateUser = updateUser;
// Toggle Status (Active / Inactive)
const toggleUserStatus = async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.approved = user.approved === user_model_1.Status.ACTIVE ? user_model_1.Status.INACTIVE : user_model_1.Status.ACTIVE;
        await user.save();
        res.status(200).json({ message: `User is now ${user.approved}`, status: user.approved });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.toggleUserStatus = toggleUserStatus;
// Delete User
const deleteUser = async (req, res) => {
    try {
        await user_model_1.User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteUser = deleteUser;
