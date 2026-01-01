import mongoose, { Document, Schema } from "mongoose"

export enum CategoryStatus {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
}

export interface ICATEGORY extends Document {
    _id: mongoose.Types.ObjectId;
    categoryName: string;
    status: CategoryStatus;
    updatedAt: Date;
    createdAt: Date;
}

const categorySchema = new Schema<ICATEGORY>(
    {
        categoryName: { type: String, required: true, unique: true, trim: true },
        status: { 
            type: String, 
            enum: Object.values(CategoryStatus), 
            default: CategoryStatus.AVAILABLE 
        }
    },
    { timestamps: true }
);

export const Category = mongoose.model<ICATEGORY>("Category", categorySchema);