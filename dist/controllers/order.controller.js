"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderItems = exports.createAdminOrder = exports.searchUserForAdmin = exports.updateStatus = exports.getAllOrdersForBarista = exports.getAllOrdersForAdmin = exports.getOrdersForUser = exports.createOrder = void 0;
const item_modal_1 = require("../models/item.modal");
const order_model_1 = require("../models/order.model");
const user_model_1 = require("../models/user.model");
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json({ message: "Authentication failed. User not recognized." });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Your tray is empty." });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const orderItem of items) {
            if (!orderItem.item)
                continue;
            const product = await item_modal_1.ItemModel.findById(orderItem.item);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${orderItem.item} not found.` });
            }
            if (product.availability === "UNAVAILABLE") {
                return res.status(400).json({ message: `${product.name} is currently out of stock.` });
            }
            const currentPrice = product.price;
            totalAmount += currentPrice * (orderItem.quantity || 1);
            orderItems.push({
                item: product._id,
                quantity: orderItem.quantity || 1,
                unitPrice: currentPrice
            });
        }
        const newOrder = new order_model_1.Order({
            userId,
            items: orderItems,
            totalAmount,
            status: order_model_1.OrderStatus.PENDING
        });
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    }
    catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
exports.createOrder = createOrder;
const getOrdersForUser = async (req, res) => {
    try {
        const userId = req.user.sub;
        const orders = await order_model_1.Order.find({ userId }).populate("items.item");
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
exports.getOrdersForUser = getOrdersForUser;
const getAllOrdersForAdmin = async (req, res) => {
    try {
        const orders = await order_model_1.Order.find()
            .populate("userId", "name email")
            .populate("items.item", "name price imageUrl")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllOrdersForAdmin = getAllOrdersForAdmin;
const getAllOrdersForBarista = async (req, res) => {
    try {
        const orders = await order_model_1.Order.find()
            .populate("userId", "name email")
            .populate("items.item", "name price imageUrl")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllOrdersForBarista = getAllOrdersForBarista;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await order_model_1.Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ message: "Status updated successfully", order: updatedOrder });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateStatus = updateStatus;
const searchUserForAdmin = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await user_model_1.User.find({
            $or: [
                { fullname: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { $expr: { $regexMatch: { input: { $toString: "$contactNumber" }, regex: query, options: "i" } } }
            ]
        }).limit(5).select("fullname email contactNumber _id");
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchUserForAdmin = searchUserForAdmin;
const createAdminOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }
        const newOrder = new order_model_1.Order({
            userId,
            items,
            totalAmount,
            status: "PENDING"
        });
        await newOrder.save();
        res.status(201).json({ message: "Manual order created successfully!", order: newOrder });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAdminOrder = createAdminOrder;
const updateOrderItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, totalAmount } = req.body;
        const updatedOrder = await order_model_1.Order.findByIdAndUpdate(id, { items, totalAmount }, { new: true }).populate("userId", "fullname email contactNumber");
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateOrderItems = updateOrderItems;
