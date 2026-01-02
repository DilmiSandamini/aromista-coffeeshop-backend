import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/user.model";
import { 
    createBooking, 
    getBookedTables, 
    getAllBookings, 
    updateBookingStatus, 
    deleteBooking 
} from "../controllers/booking.controller";

const router = Router();

// --- Customer Routes ---
router.post(
    "/create", 
    authenticate, 
    requireRole([Role.CUSTOMER]), 
    createBooking
);

router.get(
    "/booked-tables", 
    authenticate, 
    requireRole([Role.CUSTOMER]), 
    getBookedTables
);

// --- Admin Routes ---
router.get(
    "/getall", 
    authenticate, 
    requireRole([Role.ADMIN]), 
    getAllBookings
);

router.patch(
    "/status/:id", 
    authenticate, 
    requireRole([Role.ADMIN]), 
    updateBookingStatus
);

router.delete(
    "/delete/:id", 
    authenticate, 
    requireRole([Role.ADMIN]), 
    deleteBooking
);

export default router;