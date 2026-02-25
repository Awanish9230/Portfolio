# Deployment Guide

## 1. Database (MongoDB Atlas)

1.  Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (Free Tier).
3.  In "Database Access", create a database user with password.
4.  In "Network Access", allow access from anywhere (`0.0.0.0/0`).
5.  Get the Connection String: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_db`.

## 2. Backend Deployment (Render)

1.  Push your code to GitHub.
2.  Create an account on [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings:**
    - **Root Directory**: `backend`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
6.  **Environment Variables:**
    - `MONGODB_URI`: Your Atlas connection string.
    - `JWT_SECRET`: A strong secret key.
    - `NODE_ENV`: `production`
7.  **Important Note on File Uploads**:
    - Render's free tier (and most ephemeral hosting) **does not persist local files**. Images uploaded via Multer to `uploads/` will disappear after deployment restarts.
    - **Solution**: For production, update `uploadMiddleware.js` and `projectController.js` to use a cloud storage service like **Cloudinary** or **AWS S3**.
    - For this demo, local uploads work only on persistent local environments.

## 3. Frontend Deployment (Vercel)

1.  Create an account on [Vercel](https://vercel.com/).
2.  Import your GitHub repository.
3.  **Project Configuration:**
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend`
4.  **Environment Variables**:
    - Wait! We hardcoded `http://localhost:5000` in `frontend/src/utils/api.js`.
    - **Update `api.js`**:
      ```javascript
      const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      });
      ```
    - In Vercel, set `VITE_API_URL` to your Render Backend URL (e.g., `https://my-api.onrender.com/api`).
5.  Deploy.

## 4. Admin Setup

1.  Since there is no "Register" page (for security), you need to create the first Admin user manually.
2.  **Option A (Local)**: Use Postman to POST `/api/users` (if route exists) or directly insert into MongoDB.
3.  **Option B (Seed Script)**: Create a `seeder.js` in backend to inject an admin user.

### Seeder Script (Quick Setup)

Create `backend/seeder.js`:
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        const adminUser = new User({
            email: 'admin@example.com',
            password: 'password123', // Will be hashed
            isAdmin: true
        });
        await adminUser.save();
        console.log('Admin User Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();
```
Run `node seeder.js` locally to create the user in your Atlas DB.
