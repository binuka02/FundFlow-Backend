# 🛠️ FundFlow Backend – Charity Donation API

This is the **backend** of the FundFlow project – a MERN-stack application designed to facilitate transparent and secure charitable donations. This Express.js server provides RESTful APIs for user management, campaign handling, Stripe payments, and real-time chat integration.

Frontend Repo: [FundFlow Frontend]([https://github.com/binuka02/FundFlow](https://github.com/binuka02/FundFlow-Frontend))

---

## 📌 Project Highlights

- 🔐 **Role-based Authentication** with JWT
- 💬 **Socket.IO** for real-time messaging
- 💳 **Stripe Checkout Integration**
- 📁 **CRUD Operations** for Campaigns and Posts
- 🧑‍⚖️ **Admin Management** for approvals and user control

---

## 🔧 Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Server    | Node.js, Express  |
| Database  | MongoDB (Mongoose)|
| Auth      | JWT               |
| Realtime  | Socket.IO         |
| Payments  | Stripe            |
| Hosting   | Railway           |

---

## 🔐 Environment Variables

To run this project, you will need to create a `.env` file in the root directory and add the following environment variables:

```env

JWT_SECRET
MONGO_URL
STRIPE_SECRET_KEY
FRONTEND_URL
