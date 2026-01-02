import { Request, Response } from "express";
import BookingModel, { BookingStatus } from "../models/booking.modal";

export const getBookedTables = async (req: Request, res: Response) => {
    try {
        const { date, time } = req.query;
        if (!date || !time) {
            return res.status(400).json({ message: "Date and Time are required." });
        }

        const bookedEntries = await BookingModel.find({
            bookingDate: new Date(date as string),
            bookingTime: time as string,
            status: BookingStatus.BOOKING
        }).select("tableNumber");

        const bookedTableIds = bookedEntries.map(b => b.tableNumber);
        res.status(200).json({ bookedTableIds });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createBooking = async (req: any, res: Response) => {
    try {
        const { tableNumber, bookingDate, bookingTime } = req.body;
        const userId = req.user.sub;

        const isAlreadyBooked = await BookingModel.findOne({
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: BookingStatus.BOOKING
        });

        if (isAlreadyBooked) {
            return res.status(400).json({ message: "This table is already reserved for the selected time." });
        }

        const newBooking = new BookingModel({
            userId,
            tableNumber,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: BookingStatus.BOOKING
        });

        await newBooking.save();
        res.status(201).json({ message: "Table reserved successfully!", booking: newBooking });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};