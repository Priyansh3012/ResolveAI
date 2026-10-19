# ResolveAI — IT Service Management Platform

ResolveAI is a full-stack IT Service Management (ITSM) application built with the MERN stack. It helps organizations manage support tickets, track ticket progress, assign work to agents, and monitor service activity through a centralized dashboard.

## Live Demo

- **Frontend:** https://resolve-ai-bice-delta.vercel.app
- **Backend API:** https://resolveai-ydqn.onrender.com
- **GitHub Repository:** https://github.com/Priyansh3012/ResolveAI

*Note: The backend URL displays an API health message at its root. Application functionality is available through the frontend.*

## Features

- **Authentication:** User registration, login, logout, and JWT-based authentication using HttpOnly cookies.
- **Role-Based Access Control:** Role-based permissions for administrators and agents.
- **Ticket Management:** Create, view, filter, and manage support tickets.
- **Ticket Assignment:** Assign tickets to support agents.
- **Ticket Tracking:** Manage ticket status, priority, category, and activity history.
- **Dashboard Analytics:** View ticket statistics, status distribution, and priority overview.
- **Comments and Activity History:** Maintain communication and track ticket updates.
- **AI Integration:** Gemini-powered AI functionality.
- **Filtering and Pagination:** Find tickets using available filters and paginated results.
- **Caching and Rate Limiting:** Redis-based caching and API rate limiting.
- **Containerization:** Docker configuration for the frontend and backend services.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Redis
- Google Gemini API

### Deployment and Tools
- Docker and Docker Compose
- Vercel — frontend deployment
- Render — backend deployment
- Git and GitHub
- Postman — API testing

## Architecture

```text
              User / Browser
                     |
                     v
              React Frontend
                 (Vercel)
                     |
             HTTPS API Requests
             + Cookies / JWT
                     |
                     v
             Express REST API
                 (Render)
                /    |     \
               v     v      v
          MongoDB   Redis   Gemini API
           Atlas    Cache   AI Features
```

The frontend communicates with the Express backend through REST APIs. MongoDB Atlas stores application data, Redis supports caching, and Gemini provides AI-related functionality.

## Project Structure

```text
ResolveAI/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Run Locally

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a compatible MongoDB instance
- Redis instance
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Priyansh3012/ResolveAI.git
cd ResolveAI
```

### 2. Configure the backend

Create `server/.env` with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://127.0.0.1:6379
```

Replace the example values with your own credentials. Ensure Redis is running and accessible at the configured URL.

### 3. Configure the frontend

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

This URL is for local development. For deployment, configure the frontend with the deployed backend API URL.

### 4. Start the backend

Open a terminal in the project root:

```bash
cd server
npm install
npm run dev
```

The backend runs at `http://localhost:5000`.

### 5. Start the frontend

Open another terminal in the project root:

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Docker

The repository includes Dockerfiles for the frontend and backend and a Docker Compose configuration.

Ensure the Redis instance required by the Compose configuration is running and accessible on host port `6379`. Configure the backend environment variables before starting the containers.

From the project root:

```bash
docker compose build
docker compose up -d
docker compose ps
```

The local Docker configuration exposes:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

To inspect backend logs:

```bash
docker compose logs --tail=100 server
```

To stop the containers:

```bash
docker compose down
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing and verification |
| `JWT_EXPIRES_IN` | JWT expiry duration |
| `GEMINI_API_KEY` | Gemini API authentication |
| `REDIS_URL` | Redis connection URL |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `VITE_API_URL` | Frontend API base URL |

**Security:** Never commit `.env` files, database credentials, JWT secrets, or API keys to GitHub. The frontend's `VITE_` variables are exposed to the browser and must not contain secrets.

## Deployment

- The frontend is deployed on Vercel.
- The backend is deployed on Render.
- MongoDB Atlas provides the database.
- Redis provides caching support.

The deployed frontend must use the correct backend API URL, and the backend CORS configuration must allow the deployed frontend origin. Cookie-based authentication must also be configured appropriately for cross-origin HTTPS requests.

## Key Engineering Challenges

### Cross-Origin Authentication After Deployment

After deploying the frontend to Vercel and the backend to Render, the login endpoint returned HTTP 200, but protected endpoints returned HTTP 401.

Chrome DevTools showed that the browser blocked the authentication cookie because it used `SameSite=Lax` in a cross-site response.

**Resolution:** Updated the login and registration cookie configuration to use `SameSite=None` and `Secure=true`, redeployed the backend, and verified that protected API requests could authenticate successfully.

This restored access to dashboard statistics and ticket data.

## Future Improvements

- Automated unit and integration tests
- Improved monitoring and error reporting
- Enhanced API documentation
- Additional dashboard analytics
- Expanded role-based permissions

## Author

**Priyansh Agrawal**

[GitHub](https://github.com/Priyansh3012)
