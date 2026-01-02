import { Request, Response } from "express";
import BookingModel, { BookingStatus } from "../models/booking.modal";

// GET ALL BOOKINGS (Admin)
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await BookingModel.find()
            .populate("userId", "fullname email contactNumber")
            .sort({ bookingDate: -1, bookingTime: -1 });
            
        res.status(200).json({ bookings });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE STATUS (Admin)
export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(BookingStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedBooking = await BookingModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: `Booking ${status} successfully`, booking: updatedBooking });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE BOOKING (Admin)
export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await BookingModel.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// CUSTOMER: Get booked tables (Existing)
export const getBookedTables = async (req: Request, res: Response) => {
    try {
        const { date, time } = req.query;
        if (!date || !time) {
            return res.status(400).json({ message: "Date and Time are required." });
        }

        const bookedEntries = await BookingModel.find({
            bookingDate: new Date(date as string),
            bookingTime: time as string,
            status: { $ne: BookingStatus.CANCELLED } // Only count non-cancelled ones
        }).select("tableNumber");

        const bookedTableIds = bookedEntries.map(b => b.tableNumber);
        res.status(200).json({ bookedTableIds });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// CUSTOMER: Create (Existing)
export const createBooking = async (req: any, res: Response) => {
    try {
        const { tableNumber, bookingDate, bookingTime } = req.body;
        const userId = req.user.sub;

        const isAlreadyBooked = await BookingModel.findOne({
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: BookingStatus.CONFIRMED // Check against confirmed ones
        });

        if (isAlreadyBooked) {
            return res.status(400).json({ message: "Table already reserved for this time." });
        }

        const newBooking = new BookingModel({
            userId,
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: BookingStatus.PENDING
        });

        await newBooking.save();
        res.status(201).json({ message: "Request sent successfully!", booking: newBooking });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};