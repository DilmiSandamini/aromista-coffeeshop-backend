"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = exports.getBookedTables = exports.deleteBooking = exports.updateBookingStatus = exports.getAllBookings = void 0;
const booking_modal_1 = __importStar(require("../models/booking.modal"));
// GET ALL BOOKINGS (Admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await booking_modal_1.default.find()
            .populate("userId", "fullname email contactNumber")
            .sort({ bookingDate: -1, bookingTime: -1 });
        res.status(200).json({ bookings });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBookings = getAllBookings;
// UPDATE STATUS (Admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(booking_modal_1.BookingStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedBooking = await booking_modal_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: `Booking ${status} successfully`, booking: updatedBooking });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// DELETE BOOKING (Admin)
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await booking_modal_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteBooking = deleteBooking;
// CUSTOMER: Get booked tables (Existing)
const getBookedTables = async (req, res) => {
    try {
        const { date, time } = req.query;
        if (!date || !time) {
            return res.status(400).json({ message: "Date and Time are required." });
        }
        const bookedEntries = await booking_modal_1.default.find({
            bookingDate: new Date(date),
            bookingTime: time,
            status: { $ne: booking_modal_1.BookingStatus.CANCELLED } // Only count non-cancelled ones
        }).select("tableNumber");
        const bookedTableIds = bookedEntries.map(b => b.tableNumber);
        res.status(200).json({ bookedTableIds });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBookedTables = getBookedTables;
// CUSTOMER: Create (Existing)
const createBooking = async (req, res) => {
    try {
        const { tableNumber, bookingDate, bookingTime } = req.body;
        const userId = req.user.sub;
        const isAlreadyBooked = await booking_modal_1.default.findOne({
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: booking_modal_1.BookingStatus.CONFIRMED // Check against confirmed ones
        });
        if (isAlreadyBooked) {
            return res.status(400).json({ message: "Table already reserved for this time." });
        }
        const newBooking = new booking_modal_1.default({
            userId,
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: booking_modal_1.BookingStatus.PENDING
        });
        await newBooking.save();
        res.status(201).json({ message: "Request sent successfully!", booking: newBooking });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBooking = createBooking;
