# TaskFlow

A full-stack task and project management application built with React, Node.js, Express, and MongoDB.

---

## Live Demo

- **Frontend:** https://task-manager-neon-eta.vercel.app
- **Backend API:** https://taskmanager-production-61ca.up.railway.app

---

## Tech Stack

### Frontend

- React (Vite)
- Axios
- React Context API (Auth, Toast)
- Tailwind CSS

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Helmet, CORS, Morgan

---

## Project Structure

```
jira_app/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI components
│   │   │   └── layout/            # Sidebar, Navbar, MainLayout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state management
│   │   │   └── ToastContext.jsx   # Toast notifications
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                        # Express backend
    ├── server.js                  # Entry point
    └── src/
        ├── config/
        │   └── db.js              # MongoDB connection
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── task.controller.js
        │   ├── project.controller.js
        │   └── dashboard.controller.js
        ├── middleware/
        │   ├── auth.middleware.js
        │   ├── role.middleware.js
        │   └── errorHandler.js
        ├── models/
        │   ├── user.model.js
        │   ├── task.model.js
        │   └── project.model.js
        ├── routes/
        │   ├── auth.routes.js
        │   ├── task.routes.js
        │   ├── project.routes.js
        │   └── dashboard.routes.js
        └── utils/
            ├── ApiError.js
            └── generateToken.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/sakshamgoyal9/jira_app.git
cd jira_app
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

---

## API Endpoints

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Projects

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/api/projects`     | Get all projects |
| POST   | `/api/projects`     | Create project   |
| PUT    | `/api/projects/:id` | Update project   |
| DELETE | `/api/projects/:id` | Delete project   |

### Tasks

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/api/tasks`     | Get all tasks |
| POST   | `/api/tasks`     | Create task   |
| PUT    | `/api/tasks/:id` | Update task   |
| DELETE | `/api/tasks/:id` | Delete task   |

### Dashboard

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/dashboard` | Get dashboard stats |

---

## Deployment

### Frontend → Vercel

1. Connect your GitHub repo to Vercel
2. Set root directory to `client`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-railway-url/api`

### Backend → Railway

1. Connect your GitHub repo to Railway
2. Set root directory to `server`
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`

---

## Environment Variables

### Server (`/server/.env`)

| Variable     | Description                   |
| ------------ | ----------------------------- |
| `PORT`       | Server port (default: 5001)   |
| `NODE_ENV`   | `development` or `production` |
| `MONGO_URI`  | MongoDB connection string     |
| `JWT_SECRET` | Secret key for JWT tokens     |
| `CLIENT_URL` | Frontend URL for CORS         |

### Client (`/client/.env`)

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

---

## License

MIT
