# ResolveAI — AI-Powered IT Service Management

ResolveAI is a full-stack IT Service Management (ITSM) application built with the MERN stack. It helps teams manage support tickets, track ticket activity, collaborate through comments, and monitor support operations through a centralized dashboard. Gemini AI integration provides AI-powered assistance for supported workflows.

## Features

- **Authentication & Authorization:** JWT-based authentication using HttpOnly cookies and role-based access control.
- **Ticket Management:** Create, view, update, assign, and manage support tickets.
- **Dashboard Analytics:** View ticket statistics and operational summaries.
- **Search & Filtering:** Filter tickets by status and priority, with pagination.
- **Comments & Activity History:** Collaborate on tickets and track ticket-related activity.
- **AI Integration:** Gemini API integration for supported AI-powered functionality.
- **Caching & Rate Limiting:** Redis-based caching and API rate limiting.
- **Containerization:** Dockerized frontend and backend with Docker Compose.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), HttpOnly cookies |
| Caching | Redis |
| AI | Google Gemini API |
| Deployment & Containers | Docker, Docker Compose, Nginx |

## Architecture

```text
React + Vite Frontend
        |
        | HTTP requests / JSON
        v
Express.js REST API
        |
        +------ MongoDB Atlas
        |
        +------ Redis
        |
        +------ Google Gemini API
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Redis server
- Google Gemini API key for AI functionality
- Docker Desktop (for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Priyansh3012/ResolveAI.git
cd ResolveAI
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory using `.env.example` as a reference.

Configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_jwt_secret
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://127.0.0.1:6379
CLIENT_URL=http://localhost:5173
```

Replace the placeholder values with your own configuration. Never commit real credentials to GitHub.

### 3. Configure the Frontend

Install the frontend dependencies:

```bash
cd ../client
npm install
```

Create `client/.env` if required and configure the frontend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Only put public configuration in variables prefixed with `VITE_`. Never put secrets in frontend environment variables.

### 4. Run the Application Locally

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the frontend at `http://localhost:5173`.

Ensure MongoDB and Redis are accessible and the environment variables are configured correctly.

## Run with Docker

Make sure Docker Desktop is running and your `server/.env` contains the required backend credentials.

From the project root, run:

```bash
docker compose build
docker compose up -d
```

Check the running containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs --tail=100 server
```

View frontend logs:

```bash
docker compose logs --tail=100 client
```

Open the Docker-hosted frontend at `http://localhost:8080`. The backend API is available at `http://localhost:5000`.

Stop the containers with:

```bash
docker compose down
```

The Docker Compose configuration uses MongoDB Atlas and connects to Redis using the configured Redis URL.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `GEMINI_API_KEY` | Gemini API authentication |
| `REDIS_URL` | Redis connection URL |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS |
| `VITE_API_URL` | Frontend API base URL |

## Future Improvements

- Automated testing for API endpoints and frontend workflows
- CI/CD pipeline using GitHub Actions
- Production deployment with HTTPS
- Enhanced observability and error monitoring

## Author

**Priyansh Agrawal**

GitHub: [Priyansh3012](https://github.com/Priyansh3012)

---

*Built as a full-stack project to explore ITSM workflows, REST API development, authentication, caching, AI integration, and containerization.*
