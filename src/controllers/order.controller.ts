import { Request, Response } from "express";
import { ItemModel } from "../models/item.modal";
import { Order, OrderStatus } from "../models/order.model";
import { User } from "../models/user.model";

export const createOrder = async (req: any, res: Response) => {
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
            // Item ID එක පවතින බව තහවුරු කරගන්න
            if (!orderItem.item) continue;

            const product = await ItemModel.findById(orderItem.item);
            
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

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalAmount,
            status: OrderStatus.PENDING
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const getOrdersForUser = async (req: any, res: Response) => {
    try {
        const userId = req.user.sub;
        const orders = await Order.find({ userId }).populate("items.item");
        res.status(200).json({ orders });
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email") 
            .populate("items.item", "name price imageUrl")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrdersForBarista = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email") 
            .populate("items.item", "name price imageUrl")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Order Status එක වෙනස් කිරීම
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json({ message: "Status updated successfully", order: updatedOrder });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Backend logic for user search
export const searchUserForAdmin = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const users = await User.find({
            $or: [
                { fullname: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                // contactNumber එක Number එකක් නිසා regexMatch භාවිතා කරයි
                { $expr: { $regexMatch: { input: { $toString: "$contactNumber" }, regex: query, options: "i" } } }
            ]
        }).limit(5).select("fullname email contactNumber _id");
        res.status(200).json({ users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdminOrder = async (req: any, res: Response) => {
    try {
        const { userId, items, totalAmount } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const newOrder = new Order({
            userId, // Admin විසින් තෝරාගත් User ID එක
            items,
            totalAmount,
            status: "PENDING"
        });

        await newOrder.save();
        res.status(201).json({ message: "Manual order created successfully!", order: newOrder });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderItems = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { items, totalAmount } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { items, totalAmount },
            { new: true }
        ).populate("userId", "fullname email contactNumber");

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};