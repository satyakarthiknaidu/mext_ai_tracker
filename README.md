# MEXT AI Tracker

A full-stack scholarship application portal built with Next.js and NestJS. This repository contains a modern student-facing dashboard for managing documents, proposals, AI recommendations, and application deadlines for the Japanese MEXT scholarship.

## 🚀 Project Overview

The MEXT AI Tracker is designed to help applicants collect and manage required scholarship materials, monitor progress, and review AI-powered guidance for research proposals and document completion.

## 🧩 Key Features

- User authentication with JWT-based login and registration
- Document upload manager with file status tracking
- Dashboard summary for application progress and deadlines
- Proposal scoring and recommendation workflow hooks
- Modular NestJS API backend with Prisma ORM
- Clean Next.js UI and reusable app layout

## 📁 Repository Structure

- `client/` – Next.js front-end application
- `server/` – NestJS API backend with Prisma schema
- `.gitignore` – repository ignore rules

## ⚙️ Technologies Used

- Frontend: Next.js, React, TypeScript, Tailwind-like styling classes
- Backend: NestJS, Prisma, SQLite (development database)
- Auth: JWT-based authentication
- File upload: Multer-powered document uploads

## 🧪 Prerequisites

- Node.js 18+ installed
- npm available on your system

## 🛠️ Setup Instructions

### 1. Install dependencies

```bash
cd c:\Users\New Dell\Desktop\mext tracker\client
npm install

cd ..\server
npm install
```

### 2. Start the backend API

```bash
cd c:\Users\New Dell\Desktop\mext tracker\server
npm run start:dev
```

The backend listens on `http://localhost:3001` by default.

### 3. Start the frontend app

```bash
cd c:\Users\New Dell\Desktop\mext tracker\client
npm run dev
```

The frontend runs on `http://localhost:3000`.

## 📦 What to Expect

- `http://localhost:3000/login` – sign in page
- `http://localhost:3000/register` – create account page
- `http://localhost:3000/dashboard` – user dashboard overview
- `http://localhost:3000/dashboard/documents` – document upload manager

## 🧠 API Endpoints

### Authentication
- `POST /api/auth/signup` – register new user
- `POST /api/auth/login` – authenticate and receive JWT
- `GET /api/auth/me` – fetch authenticated user profile

### Dashboard
- `GET /api/dashboard/summary` – application progress summary

### Documents
- `GET /api/documents` – list uploaded documents
- `POST /api/documents/upload` – upload a document file
- `DELETE /api/documents/:id` – delete a document
- `GET /api/documents/download/:filename` – download an uploaded file

## 🧾 Notes

- Uploaded files are stored locally in the `uploads/` directory on the backend.
- The current app uses a development SQLite database and Prisma schema located in `server/prisma`.
- If you want to use a custom API base URL, set `NEXT_PUBLIC_API_URL` in the frontend environment.

## 🤝 Contribution

Improvements, bug fixes, and documentation updates are welcome. Fork the repository, make changes, and submit a pull request.

## 📜 License

This repository does not include a license file by default. Add a suitable open source license if you intend to publish it publicly.

