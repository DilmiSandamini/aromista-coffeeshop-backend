import { Router } from "express"
import {
  getMyProfile,
  login,
  refreshToken,
  getAllUsers,
  registerUser,
  saveUser,
  updateUser,
  toggleUserStatus,
  deleteUser
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()

router.post("/register", registerUser)

router.post("/login", login)

router.post("/refresh" , refreshToken )

router.get("/me", authenticate, getMyProfile)

router.get(
  "/getall",
  authenticate,
  requireRole([Role.ADMIN]),
  getAllUsers
)


router.post(
  "/create", 
  authenticate,
  requireRole([Role.ADMIN]),
  saveUser
);

router.put("/update/:id",
  authenticate,
  requireRole([Role.ADMIN]),
  updateUser
);

router.patch("/status/:id", 
  authenticate,
  requireRole([Role.ADMIN]),
  toggleUserStatus
);

router.delete("/delete/:id", 
  authenticate,
  requireRole([Role.ADMIN]),
  deleteUser
);
export default router
