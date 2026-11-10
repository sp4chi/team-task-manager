# 🚀 Team Task Manager (Full-Stack)

A full-stack web application to manage projects and tasks with role-based access control (Admin / Member). Users can create projects, assign tasks, and track progress through a simple dashboard.

- **Frontend:** https://team-task-manager-rho-virid.vercel.app
- **API:** https://taskmanager-api.duckdns.org/api

---

## 📌 Features

- 🔐 User Authentication (Signup / Login with JWT)
- 👥 Role-Based Access Control (Admin / Member)
- 📁 Project Management
- 📋 Task Creation & Assignment
- 🔄 Task Status Tracking (Todo / In Progress / Done)
- 📊 Dashboard Overview
- 🌍 Fully Deployed (AWS EC2 + Vercel)

---

## 🛠 Tech Stack

**Frontend**

- React (Vite)
- Axios
- React Router

**Backend**

- Node.js
- Express.js
- MongoDB (Mongoose)

**Deployment**

- AWS EC2 — backend in Docker, behind Caddy (automatic HTTPS)
- Vercel (Frontend)

---

## ⚙️ Project Structure

```
team-task-manager/
│
├── app/              # Backend (Node.js + Express)
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── client/           # Frontend (React + Vite)
│   ├── src/
│   └── index.html
│
├── Dockerfile        # Backend image
├── package.json      # Backend dependencies & scripts
└── Readme.md
```

---

## ⚙️ Setup Instructions (Local Development)

### 🔹 1. Clone Repository

```bash
git clone https://github.com/sp4chi/team-task-manager.git
cd team-task-manager
```

---

### 🔹 2. Setup Backend

The backend lives in `app/`, but its `package.json` is at the repository root, so run these from the root:

```bash
npm install
npm run dev
```

Create `app/.env` (see [Environment Variables](#-environment-variables)). The API runs on `http://localhost:5000` unless `PORT` is set.

---

### 🔹 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

To point the frontend at your local backend, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables

### Backend (`app/.env`)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173   # allowed CORS origin
PORT=5000                            # optional, defaults to 5000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=https://taskmanager-api.duckdns.org/api   # optional, this is the default
```

---

## 🐳 Deployment (Backend on EC2)

The backend runs as a Docker container on the same Docker network as Caddy, which proxies `taskmanager-api.duckdns.org` to it.

```bash
git pull
docker build -t team-task-manager-api:latest .
docker rm -f taskmanager-api
docker run -d --name taskmanager-api \
  --network landing-iq_default \
  --env-file .env \
  --restart unless-stopped \
  team-task-manager-api:latest
```

The `.env` file is passed at runtime and is never copied into the image.

---

## 📡 API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Users

- `GET /api/users/me`
- `GET /api/users` (Admin)

### Projects

- `POST /api/projects` (Admin)
- `GET /api/projects`
- `POST /api/projects/:id/members` (Admin)

### Tasks

- `POST /api/tasks` (Admin)
- `GET /api/tasks`
- `GET /api/tasks/summary`
- `PATCH /api/tasks/:id`

---

## ⚠️ Notes

- Ensure backend is running before frontend in local setup
- `FRONTEND_URL` must match the frontend's origin, or the browser will block requests with a CORS error

---

## 📈 Future Improvements

- Add team invitations via email
- Improve UI/UX (Tailwind / Material UI)
- Add due date filtering & notifications
- Add real-time updates (WebSockets)

---

## 👨‍💻 Author

- **Kaushik G Bora**
- GitHub: https://github.com/sp4chi/team-task-manager

---

## 🏁 Conclusion

This project demonstrates full-stack development with authentication, role-based access, REST APIs, and deployment. Built within a short timeline focusing on functionality and scalability.
