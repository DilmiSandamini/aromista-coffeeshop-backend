import { Router } from "express"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { upload } from "../middleware/upload"
import { createBooking, getBookedTables } from "../controllers/booking.controller"

const router = Router()

router.post(
    "/create", 
    authenticate, 
    requireRole([Role.CUSTOMER]),
    createBooking
)
    
router.get(
    "/booked-tables", 
    authenticate, 
    getBookedTables,
    requireRole([Role.CUSTOMER]),
    getBookedTables
);

export default router