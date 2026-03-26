# ☕ Aromista - Modern Coffee Ordering & Reservation System

Aromista is a **full-stack MERN application** designed for modern artisan coffee shops. It delivers a seamless digital experience for customers while providing powerful management tools for admins and baristas.

---

## 🌟 Key Features

### 👤 Customer Experience
- 🔍 **Live Menu Exploration**  
  Browse coffee items with dynamic category filtering.

- 🪑 **Interactive Table Booking**  
  Real-time visual table reservation system.

- 📜 **Order History & Tracking**  
  Track current and past orders easily.

- 🔐 **Secure Authentication**  
  JWT-based login & registration system.

---

### 👨‍💼 Admin Dashboard
- 📊 **System Analytics**  
  View revenue, users, orders, and reservations in real-time.

- 🧾 **POS System (Manual Orders)**  
  Add orders manually by selecting users and items.

- 🛠️ **Menu Management (CRUD)**  
  Manage items & categories with image upload (Cloudinary).

- 👥 **User & Staff Management**  
  Role-based access:  
  `ADMIN`, `BARISTOR`, `CUSTOMER`, `CASHIER`, `MANAGER`

- 📅 **Reservation Management**  
  Approve / cancel table bookings.

---

### ☕ Barista Brew Queue
- ⚡ **Real-Time Orders Dashboard**  
  Auto-refreshing live order feed.

- 🔔 **Audio Notifications**  
  Alerts when new orders arrive.

- ✅ **Order Status Updates**  
  Change status:
  - Pending → Processing → Completed

---

## 🛠️ Technology Stack

### 🎨 Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Router DOM
- React Icons

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication & Authorization)
- Bcrypt.js (Password hashing)
- Multer + Cloudinary (Image uploads)

---

### 📥 Clone Repositories

```bash
git clone https://github.com/DilmiSandamini/aromista-coffeeshop-frontend.git
git clone https://github.com/DilmiSandamini/aromista-coffeeshop-backend.git

cd aromista-frontend
npm install

cd aromista-backend
npm install

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

npm run dev

```
---

## 🔐 Authentication & Roles

| Role     | Access              |
| -------- | ------------------- |
| ADMIN    | Full system control |
| MANAGER  | Manage operations   |
| BARISTOR | Handle orders       |
| CASHIER  | Process payments    |
| CUSTOMER | Order & reserve     |

---
