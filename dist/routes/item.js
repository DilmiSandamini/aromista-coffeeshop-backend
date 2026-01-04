"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post("/create", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), upload_1.upload.fields([
    { name: "image", maxCount: 1 }
]), item_controller_1.createItem);
router.get("/getall", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), item_controller_1.getItems);
router.patch("/status/:id", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), item_controller_1.itemItemAvailability);
router.put("/update/:id", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), upload_1.upload.fields([
    { name: "image", maxCount: 1 }
]), item_controller_1.updateItem);
router.delete("/delete/:id", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), item_controller_1.deleteItem);
router.get("/customer/getall", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.CUSTOMER]), item_controller_1.getItemsForCustomer);
router.get("/admin/getall", auth_1.authenticate, (0, role_1.requireRole)([user_model_1.Role.ADMIN]), item_controller_1.getItemsForAdmin);
exports.default = router;
