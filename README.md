# FitZone — Full-Stack Gym Management Web Application (MERN)

FitZone is a premium, fully responsive, full-stack Gym Management Web Application built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS. It features a customer portal for browsing equipment, scheduling timings, joining memberships, shopping for supplements, and an administrative dashboard to manage members, inventory, sales, and operations.

---

## Features

### 👤 Customer Portal
- **Landing Page:** Interactive gym hero display, dynamic operational schedules, membership plan grids, and live equipment showcases.
- **Gym Membership Flow:** Select subscription tier (Bronze, Silver, Gold), enter shipping details, and complete payments via Stripe or our high-fidelity checkout simulator.
- **Storefront Shop:** Browse supplements, gear, and apparel with keyword search and category filtering.
- **Cart & Checkout:** Add items, manage quantities up to stock levels, and complete purchases.
- **Member Profile:** Manage personal info, view days remaining on gym subscriptions, and track orders and payment ledgers.

### ⚙️ Admin Portal
- **Overview & Analytics:** Real-time metrics counting total members, active vs expired plans, sales revenues, recent signups, and new orders.
- **Manage Members:** Search user directories, activate/deactivate statuses, and manually override plan configurations.
- **Manage Plans:** Create, update, or delete membership subscription packages (duration, pricing, and benefits checklists).
- **Equipment Inventory:** CRUD gym assets, machine quantities, and condition states.
- **Store & Orders:** CRUD catalog products, monitor stock counts, and update customer order shipment statuses.
- **Hours Configurator:** Manage daily open/close operating schedules.

---

## Tech Stack

- **Frontend:** React, React Router, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), Bcrypt.js, Mongoose.
- **Database:** MongoDB.
- **Payments:** Integrated Stripe SDK with fallback Payment Simulator.

---

## Folder Structure

```
Gym_App/
├── client/                # React Vite Frontend
│   ├── src/
│   │   ├── components/    # Reusable Layout components
│   │   ├── context/       # Auth and Cart state contexts
│   │   ├── pages/         # Customer and Admin view screens
│   │   └── services/      # Axios request interceptors
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                # Express Backend REST API
│   ├── config/            # DB configuration
│   ├── controllers/       # Route logic controller handlers
│   ├── middleware/        # JWT auth protection filters
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # Route endpoints definition
│   └── scripts/           # Database seeding scripts
├── .env                   # Configuration parameters
└── README.md
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or a MongoDB Atlas URI string)

### 1. Configure Environment Variables
Create or inspect the `.env` file in the **root** folder:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/gym-app
JWT_SECRET=super_secret_key_fitzone_12345

# Optional: Add Stripe Keys to run live credit card checks
STRIPE_SECRET_KEY=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
```

*Note: If no Stripe keys are provided, the system automatically runs the secure simulated checkouts, making the payment flow 100% testable out-of-the-box.*

---

### 2. Install Dependencies & Seed Database

Open two terminal sessions or run sequentially:

#### **A. Server Setup**
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Run database seeder (Creates default admin, initial timings, gear and supplements)
npm run seed

# Start Express server in development mode
npm run dev
```

#### **B. Client Setup**
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start Vite React app
npm run dev
```

---

## Test & Seed Account

To log in as the default Administrator, go to `/login` and use:
- **Email:** `admin@fitzone.com`
- **Password:** `AdminPassword123!`

For checking out products or subscriptions, click **"Fill Demo Card"** on the checkout page to instantly autofill the validation simulator cards.
