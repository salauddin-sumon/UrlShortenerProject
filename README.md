# ShortURL - URL Shortener

A full-stack URL shortener built with MERN stack featuring JWT authentication, role-based access control, and analytics.

## Features

- User registration and login with JWT authentication
- Role-based access control (User, Admin, Super Admin)
- Create short URLs with custom aliases
- Click tracking and analytics dashboard
- URL expiration and tags
- Admin panel for user management
- Rate limiting and security headers
- Dark theme with responsive design

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
**Frontend:** React, Tailwind CSS, React Router, Axios

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
cd server
npm install
cd ../client
npm install
cd ../server
npm run seed:admin
npm run dev
cd ../client
npm start
