import { IntegerType } from "mongodb"
import mongoose, { Document, Schema } from "mongoose"

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  BARISTOR = "BARISTOR",
  CASHIER = "CASHIER",
  MANAGER = "MANAGER",
  DELIVERY = "DELIVERY"
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId
  fullname: string
  email: string
  contactNumber: number
  password: string
  roles: Role[]
  approved: Status
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUSER>(
  {
    email: { type: String, unique: true, lowercase: true, required: true },
    contactNumber: { type: Number, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Role), default: [Role.CUSTOMER] },
    approved: { type: String, enum: Object.values(Status), default: Status.ACTIVE }
  },
  { 
    timestamps: true 
  }
);

export const User = mongoose.model<IUSER>("User", userSchema)
