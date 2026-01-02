import mongoose, { Document, Schema } from "mongoose";

export enum OrderStatus {
    PENDING = "PENDING",       
    PROCESSING = "PROCESSING", 
    COMPLETED = "COMPLETED",   
    CANCELLED = "CANCELLED"   
}

export interface IOrderItem {
    item: mongoose.Types.ObjectId; 
    quantity: number;              
    unitPrice: number;            
}

export interface IORDER extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId; 
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