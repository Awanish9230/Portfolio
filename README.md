# Portfolio Website (MERN Stack)

A fully functional, responsive, and modern portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS.

## Features

- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop.
- **Modern UI**: Light mode design with soft blue/indigo accent colors.
- **Admin Panel**: Secure dashboard to manage Projects, Experience, and Messages.
- **Dynamic Content**: All data fetched from MongoDB.
- **Contact Form**: Functional contact form with database storage.
- **File Uploads**: Support for multiple image uploads for projects.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Axios, React Router DOM.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd portfolio-website
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory:
      ```env
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/portfolio_db
      JWT_SECRET=your_jwt_secret
      NODE_ENV=development
      ```
    - Start the server:
      ```bash
      npm start
      # or for dev
      npm run dev
      ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    # Start the development server
    npm run dev
    ```

4.  **Admin Access:**
    - Register a user via backend API (or seed the database).
    - Or manually insert a user with `isAdmin: true` in your MongoDB `users` collection.
    - Navigate to `/admin/login` to access the dashboard.

## Folder Structure

- `frontend/`: React application
- `backend/`: Node.js/Express API
- `backend/uploads/`: Stored images

## License

MIT
