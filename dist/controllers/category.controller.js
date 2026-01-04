"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.deleteCategory = exports.deactivateOrActivateCategory = exports.getCategories = exports.createCategory = void 0;
const category_modal_1 = require("../models/category.modal");
const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const newCategory = new category_modal_1.Category({
            categoryName,
            status: category_modal_1.CategoryStatus.AVAILABLE
        });
        const savedCategory = await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: savedCategory });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_modal_1.Category.find();
        res.status(200).json({ categories });
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.getCategories = getCategories;
const deactivateOrActivateCategory = async (req, res) => {
    try {
        const category = await category_modal_1.Category.findById(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        category.status = category.status === category_modal_1.CategoryStatus.AVAILABLE
            ? category_modal_1.CategoryStatus.UNAVAILABLE
            : category_modal_1.CategoryStatus.AVAILABLE;
        await category.save();
        res.status(200).json({
            message: `Category is now ${category.status}`,
            category
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deactivateOrActivateCategory = deactivateOrActivateCategory;
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await category_modal_1.Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCategory = deleteCategory;
const updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const updatedCategory = await category_modal_1.Category.findByIdAndUpdate(req.params.id, { categoryName }, { new: true });
        if (!updatedCategory)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCategory = updateCategory;
