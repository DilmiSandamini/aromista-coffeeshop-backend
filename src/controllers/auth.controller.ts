import { Request, Response } from "express"
import { User, Role, Status, IUSER } from "../models/user.model";
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AUthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {fullname, email, password, contactNumber } = req.body

    // left email form model, right side data varible
    //   User.findOne({ email: email })
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    //   new User()
    const user = await User.create({
      fullname,
      email,
      contactNumber,
      password: hash,
      roles: [Role.CUSTOMER]
    })

    res.status(201).json({
      message: "User registed",
      data: { email: user.email, roles: user.roles }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal; server error"
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const existingUser = (await User.findOne({ email })) as IUSER | null
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const accessToken = signAccessToken(existingUser)
    const refreshToken = signRefreshToken(existingUser)

    res.status(200).json({
      message: "success",
      data: {
        email: existingUser.email,
        roles: existingUser.roles,
        accessToken,
        refreshToken
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal; server error"
    })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: "Token required" })
    }

    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }
    const accessToken = signAccessToken(user)

    res.status(200).json({
      accessToken
    })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" })
  }
}

export const getMyProfile = async (req: AUthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const user = await User.findById(req.user.sub).select("-password")

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { fullname, email, roles, _id } = user as IUSER

  res.status(200).json({ message: "ok", data: { id: _id, email, roles, fullname } })
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const roleFilter = req.query.role as string;
    const statusFilter = req.query.status as string;

    let query: any = { roles: { $nin: [Role.ADMIN] } };

    if (roleFilter && roleFilter !== "ALL") {
      query.roles = { ...query.roles, $in: [roleFilter] };
    }
    if (statusFilter && statusFilter !== "ALL") {
      query.approved = statusFilter;
    }

    const [
      users, 
      totalFiltered, 
      customerCount, 
      staffCount, 
      activeCount, 
      inactiveCount
    ] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
      User.countDocuments({ roles: Role.CUSTOMER }),
      User.countDocuments({ roles: { $nin: [Role.CUSTOMER, Role.ADMIN] } }),
      User.countDocuments({ approved: Status.ACTIVE }),
      User.countDocuments({ approved: Status.INACTIVE }),
    ]);

    res.status(200).json({
      message: "ok",
      data: users,
      pagination: {
        total: totalFiltered,
        page,
        pages: Math.ceil(totalFiltered / limit),
      },
      stats: {
        all: (customerCount + staffCount),
        customerCount,
        staffCount,
        activeCount,
        inactiveCount
      }
    });
  } catch (err: any) {
    console.error("Critical Backend Error:", err.message);
    res.status(500).json({ 
      message: "Internal server error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

export const saveUser = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contactNumber, roles, approved } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            contactNumber,
            roles, // මෙතනදී Admin තෝරන roles (ADMIN, BARISTA etc.) ඇතුළත් වේ
            approved: approved || Status.ACTIVE
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { fullname, email, contactNumber, roles, approved } = req.body;
        const updateData: any = { fullname, email, contactNumber, roles, approved };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "User updated", data: updatedUser });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle Status (Active / Inactive)
export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.approved = user.approved === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
        await user.save();
        res.status(200).json({ message: `User is now ${user.approved}`, status: user.approved });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};