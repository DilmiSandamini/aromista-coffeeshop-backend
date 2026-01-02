import mongoose, { Document, Schema } from "mongoose";

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export interface BookingDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    tableNumber: string;
    bookingDate: Date;
    bookingTime: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<BookingDocument> = new Schema<BookingDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tableNumber: { type: String, required: true },
        bookingDate: { type: Date, required: true },
        bookingTime: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(BookingStatus), 
            default: BookingStatus.PENDING 
        },
    },
    { timestamps: true }
);

const BookingModel = mongoose.model<BookingDocument>("Booking", BookingSchema);
export default BookingModel;