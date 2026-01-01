import mongoose, { Document, Schema } from "mongoose";

export enum OrderStatus {
    PENDING = "PENDING",       // ඇණවුම ලැබී ඇත
    PROCESSING = "PROCESSING", // සකස් කරමින් පවතී
    COMPLETED = "COMPLETED",   // අවසන් කරන ලදි
    CANCELLED = "CANCELLED"   // අවලංගු කරන ලදි
}

export interface IOrderItem {
    item: mongoose.Types.ObjectId; // Item ID එක
    quantity: number;              // ප්‍රමාණය
    unitPrice: number;            // ඇණවුම කරන මොහොතේ මිල
}

export interface IORDER extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId; // ඇණවුම කළ User
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    orderDate: Date;
    updatedAt: Date;
    createdAt: Date;
}

const OrderSchema = new Schema<IORDER>(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        items: [
            {
                item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
                quantity: { type: Number, required: true, min: 1 },
                unitPrice: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { 
            type: String, 
            enum: Object.values(OrderStatus), 
            default: OrderStatus.PENDING 
        }
    },
    { timestamps: true }
);

export const Order = mongoose.model<IORDER>("Order", OrderSchema);