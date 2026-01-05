# Aromista - Backend (RESTful API)

The backend engine for the Aromista Coffee House, handling authentication, order processing, and product management.

## 🚀 Public API URL
- **URL:** [මෙහි ඔබේ Backend Live Link එක දාන්න]

## ✨ Core Functionalities
- **Secure Authentication:** JWT (JSON Web Tokens) based login and refresh tokens.
- **User Roles:** Admin, Barista, and Customer permission levels.
- **Product Management:** CRUD operations for coffee items and categories.
- **Order Handling:** API endpoints to manage customer orders.
- **Data Integrity:** Schema validation using Mongoose.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Security:** Bcrypt.js (Password hashing), JWT (Authorization)
- **Environment Management:** Dotenv

## ⚙️ Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key