import { Router } from "express"
import { createOrder,
    getOrdersForUser,
    getAllOrdersForAdmin,
    searchUserForAdmin,
    updateStatus,
    createAdminOrder,
    updateOrderItems,
    getAllOrdersForBarista
 } from "../controllers/order.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()

router.post(
    "/create",
    authenticate,
    requireRole([Role.CUSTOMER]),
    createOrder
)

router.get(
    "/getall/orders/foruser",
    authenticate,
    requireRole([Role.CUSTOMER]),
    getOrdersForUser
)

router.post(
    "/create-admin",
    authenticate,
    requireRole([Role.ADMIN]),
    createAdminOrder
)

router.patch(
    "/update-status/:id",
    authenticate,
    requireRole([Role.ADMIN, Role.BARISTOR]),
    updateStatus
)

router.get(
    "/getall",
    authenticate,
    requireRole([Role.ADMIN]),
    getAllOrdersForAdmin
)

router.get(
    "/barista/getall",
    authenticate,
    requireRole([Role.BARISTOR]),
    getAllOrdersForBarista
)

router.get(
    "/search-user",
    authenticate,
    requireRole([Role.ADMIN]),
    searchUserForAdmin
)

router.put(
    "/update-order/:id",
    authenticate,
    requireRole([Role.ADMIN]),
    updateOrderItems
)

export default router