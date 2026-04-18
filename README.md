# Library Book Management System (MERN Stack)

A modern, responsive digital library system built with MongoDB, Express, React, and Node.js.

## Features
- **Admin Dashboard**: Add books to the catalog, issue books to members, and process returns.
- **Member Dashboard**: View borrowing history and check outstanding fines.
- **Catalog**: Search and browse available books.
- **Automated Fines**: Fines are automatically calculated ($1/day) when overdue books are returned.
- **Premium UI**: Dark mode, glassmorphism, and smooth micro-animations.

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or update the `.env` file)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Creating an Admin User
To start managing the library, you need an Admin account. 
You can create the default admin account by making a POST request to `/api/auth/setup-admin`.
```bash
curl -X POST http://localhost:5000/api/auth/setup-admin
```
This will create an admin with:
- **Email:** admin@library.com
- **Password:** admin123

You can now log in at the `/login` route on the frontend.
