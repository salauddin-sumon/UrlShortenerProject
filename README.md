# ShortURL — URL Shortener

A full-stack URL shortener built with the MERN stack. Users can create and manage short links with custom aliases, track click analytics, and control access through JWT authentication with role-based permissions. Admins get a dedicated panel for platform-wide oversight.

## Features

### URL Management
- Shorten long URLs with auto-generated 7-character codes or custom aliases (3–20 characters)
- Optional titles, tags, and expiration dates
- Enable or disable links without deleting them
- Public redirect endpoint with 301 redirects and click tracking

### Analytics
- Per-link click counts with detailed event logging (IP, user agent, referrer, device, browser)
- Dashboard with recent links and aggregate stats
- Admin analytics: unique visitors, clicks over time, and top-performing URLs

### Authentication & Authorization
- User registration and login with JWT access tokens (15 min) and HTTP-only refresh tokens (7 days)
- Automatic token refresh on the client via Axios interceptors
- Three roles: **user**, **admin**, and **super_admin**
- Profile updates and password changes with session invalidation on password change

### Admin Panel
- Platform dashboard (users, URLs, clicks, top links)
- User management: search, filter, activate/deactivate accounts
- Role assignment and user deletion (super admin only)
- View all URLs and per-URL analytics across the platform

### Security
- Helmet security headers, CORS, HPP protection, and XSS input sanitization
- Rate limiting on auth (20/15 min), URL creation (50/hour), and general API (100/15 min)
- bcrypt password hashing (12 salt rounds)
- Request logging and structured error handling

### Frontend
- React SPA with dark theme and responsive Tailwind CSS layout
- Toast notifications, protected routes, and role-gated admin access

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs, express-validator, Helmet |
| **Frontend** | React 19, React Router 7, Tailwind CSS, Axios, React Hot Toast, Headless UI |
| **Dev tools** | Nodemon, Create React App |

---

## Project Structure

```
url-shortener/
├── client/                 # React frontend (port 3000)
│   ├── public/
│   └── src/
│       ├── components/     # Layout, ProtectedRoute
│       ├── config/         # Axios API client with token refresh
│       ├── context/        # AuthContext
│       └── pages/          # Home, Login, Register, Dashboard, UrlList, UrlForm, Profile, Admin
│
└── server/                 # Express API (port 5000)
    ├── config/             # Environment-based configuration
    ├── controllers/        # auth, url, admin business logic
    ├── middlewares/        # auth, security, rate limiting, validation
    ├── models/             # User, Url, Click schemas
    ├── routes/             # auth, urls, admin, redirect
    ├── utils/              # JWT, logger, short code generation, seed script
    └── server.js           # Application entry point
```

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier works)
- **npm**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000

# MongoDB — use Atlas connection string or local default
MONGODB_URI=mongodb://localhost:27017/url-shortener

# JWT secrets — use long, random strings in production
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS — must match the frontend origin
CORS_ORIGIN=http://localhost:3000

# Optional
BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=debug
```

Optionally create `client/.env` if the API runs on a different host:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Seed the super admin account

From the `server` directory (requires `MONGODB_URI` in `.env`):

```bash
npm run seed:admin
```

This creates a default super admin if one does not already exist:

| Field | Value |
|-------|-------|
| Email | `admin@urlshortener.com` |
| Password | `Admin@123456` |
| Role | `super_admin` |

Change this password after first login in production.

### 5. Run the application

**Terminal 1 — API server:**

```bash
cd server
npm run dev
```

**Terminal 2 — React client:**

```bash
cd client
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:5000](http://localhost:5000)

---

## API Reference

Base URL: `http://localhost:5000`

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | API health and version |

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Log in; sets refresh token cookie |
| POST | `/logout` | Yes | Log out and clear refresh token |
| POST | `/refresh-token` | Cookie | Issue a new access token |
| GET | `/me` | Yes | Get current user profile |
| PATCH | `/profile` | Yes | Update name or email |
| PATCH | `/change-password` | Yes | Change password |

### URLs — `/api/urls`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Create a short URL |
| GET | `/` | Yes | List user's URLs (paginated, filterable) |
| GET | `/:id` | Yes | Get URL details with analytics |
| PATCH | `/:id` | Yes | Update a URL |
| DELETE | `/:id` | Yes | Delete a URL and its click records |

**Create URL body example:**

```json
{
  "longUrl": "https://example.com/very/long/path",
  "customAlias": "my-link",
  "title": "Example Link",
  "tags": ["marketing", "blog"],
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

**Query params for listing:** `page`, `limit`, `sort`, `search`, `tag`, `isActive`

### Admin — `/api/admin` (admin or super_admin)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Admin | Platform stats and top URLs |
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Admin | User details with stats |
| PATCH | `/users/:id/role` | Super Admin | Change user role |
| PATCH | `/users/:id/toggle-status` | Admin | Activate/deactivate user |
| DELETE | `/users/:id` | Super Admin | Delete user and all their data |
| GET | `/urls` | Admin | List all URLs |
| GET | `/urls/:id/analytics` | Admin | Detailed URL analytics |

### Redirect

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:shortCode` | No | Redirect to the original URL (301) |

Short codes and custom aliases both resolve through this route. Expired links return `410 Gone`.

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **user** | Create and manage own URLs, view own analytics, update profile |
| **admin** | All user capabilities plus admin panel, user status toggling, platform URL/user views |
| **super_admin** | All admin capabilities plus role assignment and user deletion |

---

## Frontend Routes

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/dashboard` | Authenticated | Overview and recent URLs |
| `/urls` | Authenticated | Full URL list |
| `/urls/create` | Authenticated | Create or edit a URL |
| `/profile` | Authenticated | Profile and password settings |
| `/admin` | Admin only | Admin panel |

---

## Scripts

### Server (`server/`)

| Command | Description |
|---------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run with Nodemon (hot reload) |
| `npm run seed:admin` | Create default super admin user |

### Client (`client/`)

| Command | Description |
|---------|-------------|
| `npm start` | Development server on port 3000 |
| `npm run build` | Production build to `build/` |
| `npm test` | Run test suite |

---

## Production Notes

- Set `NODE_ENV=production` and use strong, unique values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Point `MONGODB_URI` to a managed MongoDB cluster with network access restricted to your server.
- Build the React app (`npm run build`) and serve it via a static host or reverse proxy; set `CORS_ORIGIN` to your frontend URL.
- Refresh token cookies are marked `secure` in production — serve the API over HTTPS.
- Change or remove the default seeded admin credentials before deploying.

---

## License

ISC
