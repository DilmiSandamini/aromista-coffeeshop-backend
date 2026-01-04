"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemsForAdmin = exports.getItemsForCustomer = exports.updateItem = exports.deleteItem = exports.itemItemAvailability = exports.getItems = exports.createItem = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const item_modal_1 = require("../models/item.modal");
const createItem = async (req, res) => {
    try {
        const { name, description, price, category, availability, status } = req.body;
        // const userId = req.user.sub;
        const userId = req.user?.sub || req.user?._id;
        let imageUrl = "";
        const files = req.files;
        if (files?.image?.[0]) {
            const file = files.image[0];
            const uploadRes = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({ folder: "aromista_items" }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                stream.end(file.buffer);
            });
            imageUrl = uploadRes.secure_url;
        }
        const newItem = new item_modal_1.ItemModel({
            userId,
            name,
            description,
            price: Number(price),
            category,
            availability: availability || "AVAILABLE",
            status: status || "ACTIVE",
            imageUrl,
        });
        const savedItem = await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: savedItem });
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.createItem = createItem;
const getItems = async (req, res) => {
    try {
        const items = await item_modal_1.ItemModel.find();
        res.status(200).json({ items });
    }
    catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.getItems = getItems;
const itemItemAvailability = async (req, res) => {
    try {
        const item = await item_modal_1.ItemModel.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Item not found" });
        item.availability = item.availability === item_modal_1.ItemAvailability.AVAILABLE ? item_modal_1.ItemAvailability.UNAVAILABLE : item_modal_1.ItemAvailability.AVAILABLE;
        await item.save();
        res.status(200).json({ message: `Item is now ${item.availability}`, item });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.itemItemAvailability = itemItemAvailability;
const deleteItem = async (req, res) => {
    try {
        const deletedItem = await item_modal_1.ItemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteItem = deleteItem;
const updateItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        let updateFields = { name, description, price: Number(price), category };
        const files = req.files;
        if (files?.image?.[0]) {
            const file = files.image[0];
            const uploadRes = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({ folder: "aromista_items" }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                stream.end(file.buffer);
            });
            updateFields.imageUrl = uploadRes.secure_url;
        }
        const updatedItem = await item_modal_1.ItemModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.status(200).json({ message: "Updated", item: updatedItem });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateItem = updateItem;
const getItemsForCustomer = async (req, res) => {
    try {
        const items = await item_modal_1.ItemModel.find();
        res.status(200).json({ items });
    }
    catch (error) {
        console.error("Error fetching items for customer:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.getItemsForCustomer = getItemsForCustomer;
const getItemsForAdmin = async (req, res) => {
    try {
        const items = await item_modal_1.ItemModel.find();
        res.status(200).json({ items });
    }
    catch (error) {
        console.error("Error fetching items for admin:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.getItemsForAdmin = getItemsForAdmin;
