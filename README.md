# EventraX — Full-Stack Event Booking Platform

EventraX is a full-stack event booking platform built with the **MERN stack**. Users can register, verify their account with OTP, browse events, make bookings, manage their bookings, and admins can manage events and confirm customer bookings.

This project was created as a **portfolio/resume project** to demonstrate full-stack development with React, Node.js, Express, MongoDB, authentication, authorization, REST APIs, and responsive UI.

---

## 🔑 Admin Demo Login

The latest seeded project includes these admin accounts for local/demo use:

| Admin | Email | Password |
|---|---|---|
| Rahul Chatterjee | `rahul.chatterjee@example.com` | `password123` |
| Meera Iyer | `meera.iyer@example.com` | `password123` |

**Admin login page:** `/login`

> These are development/demo credentials created by `backend/seed.js`. Do not use them for a real production deployment.

---

## ✨ Features

### 👤 User Features

- User registration
- Email OTP verification
- JWT-based authentication
- Login and logout
- Protected routes
- Browse events
- Event search and filtering
- Event details
- OTP-based event booking
- View personal bookings
- Cancel bookings
- View booking status
- View profile
- Responsive mobile navigation with hamburger menu

### 🛠️ Admin Features

- Role-based admin authorization
- Admin dashboard
- Create events
- Edit events
- Delete events
- View all customer bookings
- Search and filter bookings
- View customer and event information
- Confirm pending bookings
- Automatically update available seats after confirmation
- Send booking confirmation email

### 🎨 UI/UX

- Responsive design
- EventraX light/cream visual theme
- Ticket-stub inspired UI elements
- Tailwind CSS
- Reusable React components
- Loading states
- Empty states
- Error states
- Mobile-friendly navigation

---

## 🧰 Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt / bcryptjs
- Nodemailer
- CORS
- dotenv

### Database

- MongoDB / MongoDB Atlas

---

## 🏗️ Project Structure

```text
EventraX/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── seed.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication & Authorization

EventraX uses **JWT authentication** and **role-based authorization**.

### Registration

```text
User
  ↓
Signup
  ↓
OTP sent to email
  ↓
Verify OTP
  ↓
Account verified
```

### Login

```text
Login
  ↓
Backend validates credentials
  ↓
JWT generated
  ↓
Token stored on frontend
  ↓
Authenticated requests
```

### Roles

The application supports:

- `user`
- `admin`

Admin-only APIs are protected by authentication and admin authorization middleware.

---

## 🎟️ Booking Flow

Bookings are created as `pending` and can then be confirmed by an administrator.

```text
User selects event
      ↓
Request booking OTP
      ↓
OTP verification
      ↓
Booking created
(status: pending)
      ↓
Admin opens All Bookings
      ↓
Admin confirms booking
      ↓
Booking becomes confirmed
      ↓
Available seats decrease
```

This project intentionally **does not include a payment gateway**.

---

## 🗺️ Frontend Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page |
| `/login` | Guest | Login |
| `/signup` | Guest | Registration |
| `/verify-otp` | Public | OTP verification |
| `/events` | Authenticated | Browse events |
| `/events/:id` | Authenticated | Event details |
| `/my-bookings` | Authenticated | Personal bookings |
| `/profile` | Authenticated | User profile |
| `/admin` | Admin | Admin dashboard |
| `/admin/bookings` | Admin | All bookings |
| `/admin/events/new` | Admin | Create event |
| `/admin/events/:id/edit` | Admin | Edit event |

---

## 🔌 Backend API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
```

### Events

```text
POST   /api/events/create
GET    /api/events/all
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
```

### Bookings

```text
POST /api/booking/send-otp
POST /api/booking
POST /api/booking/bookings
GET  /api/booking/all
POST /api/booking/:id/confirm
POST /api/booking/:id
```

### Health Check

```text
GET /api/health
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd eventrax
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file using `backend/.env.example`.

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
EMAIL=your_email_address
PASSWORD=your_email_app_password
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file using `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on the Vite development server, normally:

```text
http://localhost:5173
```

---

## 🌱 Seed Data

The backend includes a seed script with development users, events, and bookings.

From the `backend` directory:

```bash
node seed.js
```

The seed script creates the admin demo accounts shown at the top of this README.

> Seed data is intended for local/demo use.

---

## 🔗 Frontend ↔ Backend Communication

The frontend communicates with the backend using **Axios**.

```text
React + Vite
    │
    │ Axios HTTP request
    ▼
Express API
    │
    ▼
Route
    │
    ▼
Controller
    │
    ▼
Mongoose
    │
    ▼
MongoDB
    │
    ▼
JSON response
    │
    ▼
React UI
```

Example:

```text
GET /api/events/all
        ↓
Express event route
        ↓
Event controller
        ↓
MongoDB
        ↓
Event data returned as JSON
        ↓
React displays events
```

The backend uses CORS to allow the frontend and backend to communicate when they run on different origins.

---

## 🗃️ Main Database Models

### User

Stores:

- Username
- Email
- Password
- Role
- Verification status

### Event

Stores:

- Title
- Description
- Date
- Location
- Image URL
- Price
- Total seats
- Available seats
- Event creator/admin

### Booking

Stores:

- User
- Event
- Booking status
- Payment status
- Amount
- Timestamps

### OTP

Stores OTP information used for account verification and booking confirmation.

---

## 📜 Available Scripts

### Backend

```bash
npm start
```

Starts the backend server.

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm test
```

Runs the backend test suite.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production frontend build.

```bash
npm run preview
```

Previews the production build.

```bash
npm run lint
```

Runs ESLint.

---

## 🔒 Environment & Security

Do not commit real credentials to GitHub.

Keep these files private:

```text
backend/.env
frontend/.env
```

Commit only the example files:

```text
backend/.env.example
frontend/.env.example
```

Never expose:

- MongoDB credentials
- JWT secrets
- Email/app passwords
- Other private environment variables

---

## 🚀 Deployment

EventraX can be deployed with:

```text
React/Vite Frontend
        │
        ▼
Node/Express Backend
        │
        ▼
MongoDB Atlas
```

For deployment, the frontend API URL and backend CORS origin must be updated to the deployed service URLs.

Deployment configuration can be added separately when hosting the project.

---

## 📸 Screenshots

Recommended screenshots to add to the repository:

```text
screenshots/
├── home.png
├── events.png
├── event-details.png
├── login.png
├── my-bookings.png
├── admin-dashboard.png
├── create-event.png
└── all-bookings.png
```

Then reference them in this README:

```md
![EventraX Home](screenshots/home.png)
```

---

## 🎯 What This Project Demonstrates

- MERN stack development
- React component-based architecture
- React Router
- REST API development
- Axios integration
- JWT authentication
- OTP verification
- Role-based authorization
- MongoDB and Mongoose
- CRUD operations
- Event booking workflows
- Seat availability management
- Express middleware
- CORS
- Email integration
- Responsive UI/UX
- Environment variable management
- Full-stack project structure

---

## 👨‍💻 EventraX

**EventraX — Full-Stack Event Booking Platform**

A MERN portfolio project focused on building a complete event-booking experience from authentication and event discovery to booking management and admin operations.
