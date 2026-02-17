# AiCodySnippets

A code snippets sharing application where users can add, edit, delete, sort, and filter code snippets across multiple programming languages. Snippets can be public or private.

## Tech Stack

- **Frontend:** React, Redux Toolkit, Material UI, Vite
- **Backend:** Express.js, Node.js
- **Database:** MongoDB (Mongoose)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017

## Getting Started

### 1. Install all dependencies

```bash
npm run install-all
```

### 2. Configure environment variables

Copy the example env files and adjust as needed:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Start MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017`.

### 4. Run the application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## Project Structure

```
AiCodySnippets/
├── backend/               # Express.js API server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API service layer (axios)
│   │   ├── store/         # Redux store & slices
│   │   └── utils/         # Utility functions
│   └── vite.config.js     # Vite configuration
└── package.json           # Root scripts (concurrently)
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend client |
| `npm run install-all` | Install dependencies for root, backend, and frontend |
