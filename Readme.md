# 🚀 Team Task Manager (Full-Stack)

A full-stack web application to manage projects and tasks with role-based access control (Admin / Member). Users can create projects, assign tasks, and track progress through a simple dashboard.

---

## 🌐 Live Demo

- **Frontend (Vercel):** https://team-task-manager-rho-virid.vercel.app
- **Backend (Railway):** team-task-manager-production-d9a5.up.railway.app

---

## 📌 Features

- 🔐 User Authentication (Signup / Login with JWT)
- 👥 Role-Based Access Control (Admin / Member)
- 📁 Project Management
- 📋 Task Creation & Assignment
- 🔄 Task Status Tracking (Todo / In Progress / Done)
- 📊 Dashboard Overview
- 🌍 Fully Deployed (Railway + Vercel)

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

- Railway (Backend)
- Vercel (Frontend)

---

## ⚙️ Project Structure

```
team-task-manager/
│
├── app/        # Backend (Node.js + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── client/        # Frontend (React)
│   ├── src/
│   └── index.html
│
└── README.md
```

---

## ⚙️ Setup Instructions (Local Development)

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### 🔹 2. Setup Backend

```bash
cd server
npm install
npm run dev
```

Create `.env` inside `/server`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 🔹 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`/server/.env`)

```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

---

## 📡 API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects

- `POST /api/projects` (Admin)
- `GET /api/projects`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `PATCH /api/tasks/:id`

---

## 🎥 Demo Video

👉 Add your demo video link here (2–5 minutes)

---

## ⚠️ Notes

- Ensure backend is running before frontend in local setup
- Use correct API base URL in frontend (`/api`)
- CORS enabled for cross-origin requests

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
