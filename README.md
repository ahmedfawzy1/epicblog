# Blog Application

A full-stack blog application built with React, TypeScript, Express, and Prisma. This application allows users to create accounts, write blog posts, and interact with content.

## Features

- User Authentication (Register/Login)
- Create, Read, Update, and Delete blog posts
- Responsive design with Tailwind CSS
- Secure authentication using JWT with HTTP-only cookies
- Pagination for blog posts
- Form validation using Zod
- Type-safe development with TypeScript

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Axios

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cookie Parser

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/ahmedfawzy1/epicblog
cd epicblog
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
```

4. Set up environment variables:

Create a `.env` file in the server directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
JWT_SECRET="your-secret-key"
PORT=3002
FRONTEND_URL="http://localhost:5173"
```

Create a `.env` file in the root directory:

```env
VITE_API_URL="http://localhost:3002"
```

5. Set up the database:

```bash
cd server
npx prisma migrate dev
```

6. Start the development servers:

Frontend (from root directory):

```bash
npm run dev
```

Backend (from server directory):

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3002

## API Endpoints

### Authentication

- POST `/api/user/register` - Register a new user
- POST `/api/user/login` - Login user
- POST `/api/user/logout` - Logout user
- GET `/api/user` - Get current user profile

### Blog Posts

- GET `/api/posts` - Get all posts (paginated)
- GET `/api/posts/:id` - Get single post
- POST `/api/posts` - Create new post
- PUT `/api/posts/:id` - Update post
- DELETE `/api/posts/:id` - Delete post

## Security Features

- HTTP-only cookies for JWT storage
- Secure cookie options (httpOnly, secure, sameSite)
- Password hashing with bcrypt
- Protected routes with authentication middleware
- Input validation and sanitization
