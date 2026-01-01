import mongoose, { Document, Schema} from "mongoose";

export enum BookingStatus {
    BOOKING = "BOOKING",
    CANCELLED = "CANCELLED"
}

export enum BookingAvailability {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
}

export interface BookingDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    tableNumber: String;
    bookingDate: Date;
    bookingTime: string;
    status: BookingStatus;
    availability: BookingAvailability;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<BookingDocument> = new Schema<BookingDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tableNumber: { type: String, required: true },
        bookingDate: { type: Date, required: true },
        bookingTime: { type: String, required: true },
        status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.BOOKING },
        availability: { type: String, enum: Object.values(BookingAvailability), default: BookingAvailability.AVAILABLE },
    },
    {
        timestamps: true,
    }
);

const BookingModel = mongoose.model<BookingDocument>("Booking", BookingSchema);

export default BookingModel;