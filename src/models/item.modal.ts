import mongoose, { Document, Schema} from "mongoose";

export enum ItemAvailability {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
}

export enum ItemStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface ItemDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    availability: ItemAvailability;
    status: ItemStatus;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const ItemSchema: Schema<ItemDocument> = new Schema<ItemDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        availability: { type: String, enum: Object.values(ItemAvailability), default: ItemAvailability.AVAILABLE },
        status: { type: String, enum: Object.values(ItemStatus), default: ItemStatus.ACTIVE },
        imageUrl: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

export const ItemModel = mongoose.model<ItemDocument>("Item", ItemSchema);