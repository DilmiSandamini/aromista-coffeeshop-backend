import { Response } from "express";
import { Category, CategoryStatus } from "../models/category.modal";

export const createCategory = async (req: any, res: Response) => {
    try {
        const { categoryName } = req.body;
        const newCategory = new Category({
            categoryName,
            status: CategoryStatus.AVAILABLE
        });
        const savedCategory = await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: savedCategory });
    } catch (error: any) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getCategories = async (req: any, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const deactivateOrActivateCategory = async (req: any, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        category.status = category.status === CategoryStatus.AVAILABLE 
            ? CategoryStatus.UNAVAILABLE 
            : CategoryStatus.AVAILABLE;

        await category.save();
        res.status(200).json({ 
            message: `Category is now ${category.status}`, 
            category 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req: any, res: Response) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req: any, res: Response) => {
    try {
        const { categoryName } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryName },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};