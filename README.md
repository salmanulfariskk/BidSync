# ProBid - Project Bidding & Management System

ProBid is a comprehensive platform that connects buyers and sellers through a project bidding system. Buyers can post projects, sellers can place bids, and both parties can collaborate through project completion.

## Features

- **User Authentication**: Secure login and registration with JWT and role-based access control
- **Project Management**: Create, update, and manage projects with rich details
- **Bidding System**: Sellers can place bids on projects with custom quotes
- **Project Status Tracking**: Track project progress from pending to completion
- **File Uploads**: Share project files between buyers and sellers
- **Email Notifications**: Stay updated on project and bid status changes

## Technology Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Ant Design
- Redux Toolkit
- TypeScript

### Backend
- Express.js
- PostgreSQL
- Prisma ORM
- Node.js
- JWT Authentication

## Project Structure

```
project-bidding/
├── frontend/             # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and Redux store
│   └── public/           # Static assets
│
└── backend/              # Express.js backend application
    ├── prisma/           # Prisma schema and migrations
    ├── src/              # Source code
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Express middleware
    │   ├── routes/       # API routes
    │   ├── utils/        # Utility functions
    │   └── index.js      # Entry point
    └── uploads/          # Uploaded files storage
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided example:
   ```
   # Environment variables
   NODE_ENV=development
   PORT=5000

   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/project_bidding?schema=public"

   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Email (configure for production)
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@example.com

   # File Upload
   UPLOAD_DIR=uploads
   ```

4. Generate Prisma client:
   ```
   npx prisma generate
   ```

5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Projects

- `GET /api/projects` - Get all projects (filtered by role)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/:id/bids` - Get all bids for a project
- `POST /api/projects/:id/select-bid` - Select a bid for a project
- `POST /api/projects/:id/complete` - Mark a project as completed
- `POST /api/projects/:id/files` - Upload files to a project

### Bids

- `GET /api/bids/seller` - Get all bids for the current seller
- `POST /api/bids` - Create a new bid
- `GET /api/bids/:id` - Get bid by ID
- `PUT /api/bids/:id` - Update a bid
- `DELETE /api/bids/:id` - Delete a bid
