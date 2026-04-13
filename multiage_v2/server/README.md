# Multiage Technologies — Backend API

Express + MongoDB backend for the Multiage Technologies platform.

## Quick Start

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string

### 3. Run the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:5000**

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login (user or admin) |
| GET | `/api/auth/me` | Private | Get logged-in user profile |
| GET | `/api/auth/users` | Admin | Get all users |
| DELETE | `/api/auth/users/:id` | Admin | Delete a user |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get all products (supports `?category=&search=&featured=true`) |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Private | Place new order |
| GET | `/api/orders/my` | Private | Get my orders |
| GET | `/api/orders/:id` | Private | Get single order |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| DELETE | `/api/orders/:id` | Admin | Delete order |

### Messages — `/api/messages`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/messages` | Public | Send contact form message |
| GET | `/api/messages` | Admin | Get all messages |
| GET | `/api/messages/:id` | Admin | Get single message (marks as read) |
| DELETE | `/api/messages/:id` | Admin | Delete message |

---

## Authentication

All protected routes require a Bearer token in the header:
```
Authorization: Bearer <your_jwt_token>
```

You get the token from `/api/auth/register` or `/api/auth/login`.

---

## Create First Admin

After registering, update a user's role to admin directly in MongoDB Atlas:
```
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Project Structure
```
server/
├── config/
│   └── db.js                 ← MongoDB connection
├── controllers/
│   ├── authController.js     ← Register, login, user management
│   ├── productController.js  ← CRUD products
│   ├── orderController.js    ← Place & manage orders
│   └── messageController.js  ← Contact form messages
├── middleware/
│   ├── auth.js               ← JWT protect + adminOnly
│   └── errorHandler.js       ← Global error handler
├── models/
│   ├── User.js               ← name, email, password, role
│   ├── Product.js            ← name, price, category, stock, image
│   ├── Order.js              ← user, items, totalPrice, status
│   └── Message.js            ← name, email, service, message
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── messageRoutes.js
├── .env.example              ← Copy to .env and fill in values
├── .gitignore
├── index.js                  ← Server entry point
├── package.json
└── README.md
```
