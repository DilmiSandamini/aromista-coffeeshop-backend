"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
// --- Customer Routes ---
router.post("/create", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.CUSTOMER]), booking_controller_1.createBooking);
router.get("/booked-tables", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.CUSTOMER]), booking_controller_1.getBookedTables);
// --- Admin Routes ---
router.get("/getall", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), booking_controller_1.getAllBookings);
router.patch("/status/:id", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), booking_controller_1.updateBookingStatus);
router.delete("/delete/:id", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), booking_controller_1.deleteBooking);
exports.default = router;
