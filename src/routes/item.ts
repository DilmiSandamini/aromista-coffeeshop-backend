import { Router } from "express"
import {
    createItem,
    getItems,
    itemItemAvailability,
    updateItem,
    deleteItem,
    getItemsForCustomer,
    getItemsForAdmin
} from "../controllers/item.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { upload } from "../middleware/upload"

const router = Router()

router.post(
    "/create", 
    authenticate, 
    requireRole([Role.ADMIN]),
    upload.fields([
        { name: "image", maxCount: 1 }
    ]),
    createItem
)

router.get(
    "/getall", 
    authenticate, 
    requireRole([Role.ADMIN]),
    getItems
)

router.patch(
    "/status/:id",
    authenticate,
    requireRole([Role.ADMIN]),
    itemItemAvailability
)

router.put(
    "/update/:id",
    authenticate,
    requireRole([Role.ADMIN]),
    upload.fields([
        { name: "image", maxCount: 1 }
    ]),
    updateItem
)

router.delete(
    "/delete/:id",
    authenticate,
    requireRole([Role.ADMIN]),
    deleteItem
)

router.get(
    "/customer/getall",
    authenticate,
    requireRole([Role.CUSTOMER]),
    getItemsForCustomer
)

router.get(
    "/admin/getall",
    authenticate,
    requireRole([Role.ADMIN]),
    getItemsForAdmin
)

export default router