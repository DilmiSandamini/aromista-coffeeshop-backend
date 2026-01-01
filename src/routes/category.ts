import { Router } from "express"
import {
    createCategory,
    getCategories,
    deactivateOrActivateCategory,
    deleteCategory,
    updateCategory
} from "../controllers/category.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()

router.post(
    "/create", 
    authenticate, 
    requireRole([Role.ADMIN]),
    createCategory
)

router.get(
    "/getall", 
    authenticate, 
    requireRole([Role.ADMIN, Role.CUSTOMER]),
    getCategories
)

router.put(
    "/update/:id", 
    authenticate, 
    requireRole([Role.ADMIN]),
    updateCategory
)

router.delete(
    "/delete/:id", 
    authenticate, 
    requireRole([Role.ADMIN]),
    deleteCategory
)

router.patch(
    "/togglestatus/:id", 
    authenticate, 
    requireRole([Role.ADMIN]),
    deactivateOrActivateCategory
)

export default router