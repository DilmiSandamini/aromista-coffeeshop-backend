import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { ItemAvailability, ItemModel, ItemStatus } from "../models/item.modal";

export const createItem = async (req: any, res: Response) => {
    try {
        const { name, description, price, category, availability, status } = req.body;
        const userId = req.user.sub;
        
        let imageUrl = "";
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // රූපය පවතී නම් Cloudinary වෙත යැවීම
        if (files?.image?.[0]) {
            const file = files.image[0];
            const uploadRes: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "aromista_items" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            imageUrl = uploadRes.secure_url;
        }

        const newItem = new ItemModel({
            userId,
            name,
            description,
            price: Number(price), // String ලෙස එන මිල Number කිරීම
            category,
            availability: availability || "AVAILABLE", 
            status: status || "ACTIVE",
            imageUrl,
        });

        const savedItem = await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: savedItem });
        
    } catch (error: any) {
        console.error("Error creating item:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getItems = async (req: any, res: Response) => {
    try {
        const items = await ItemModel.find();
        res.status(200).json({ items });
    } catch (error: any) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const itemItemAvailability = async (req: any, res: Response) => {
    try {
        const item = await ItemModel.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.availability = item.availability === ItemAvailability.AVAILABLE ? ItemAvailability.UNAVAILABLE : ItemAvailability.AVAILABLE;
        await item.save();

        res.status(200).json({ message: `Item is now ${item.availability}`, item });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req: any, res: Response) => {
    try {
        const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateItem = async (req: any, res: Response) => {
    try {
        const { name, description, price, category } = req.body;
        let updateFields: any = { name, description, price: Number(price), category };

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files?.image?.[0]) {
            const file = files.image[0];
            const uploadRes: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "aromista_items" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            updateFields.imageUrl = uploadRes.secure_url;
        }

        const updatedItem = await ItemModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.status(200).json({ message: "Updated", item: updatedItem });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getItemsForCustomer = async (req: any, res: Response) => {
    try {
        const items = await ItemModel.find();
        res.status(200).json({ items });
    } catch (error: any) {
        console.error("Error fetching items for customer:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getItemsForAdmin = async (req: any, res: Response) => {
    try {
        const items = await ItemModel.find();
        res.status(200).json({ items });
    } catch (error: any) {
        console.error("Error fetching items for admin:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};