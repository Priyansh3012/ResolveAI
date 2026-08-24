# ResolveAI — Product Requirements

## 1. Product Overview

1. What is it?
2. What problem does it solve?
3. How does AI help?

ResolveAI is an AI-powered support ticket management system that helps organizations manage, assign, track, and resolve support issues. Users can create tickets describing their problems, while administrators can assign tickets to support agents and monitor their progress. AI analyzes new tickets to recommend a category, priority, and sentiment, helping agents handle issues more efficiently. Agents can communicate through ticket comments, update ticket status, and resolve issues. The system also provides a dashboard for monitoring ticket activity and performance.

## 2. Problem Statement

Traditional support ticket systems mainly provide tools for creating, assigning, and tracking tickets, but they often require support teams to manually analyze each incoming ticket. This can make ticket classification, prioritization, and handling slower, especially when the number of tickets increases. ResolveAI aims to reduce this manual effort by using AI to analyze tickets and provide recommendations for category, priority, and sentiment while keeping the complete ticket management workflow in one system.




## 3. Target Users and Roles

ResolveAI will initially support two user roles: Admin and Agent.

### Admin

The Admin is responsible for managing the support system and overseeing ticket operations.

Permissions:
- View all tickets
- Create tickets
- Assign tickets to agents
- Change ticket status and priority
- Add comments
- View ticket history
- Manage agents
- View the system dashboard

### Agent

The Agent is responsible for handling and resolving assigned support tickets.

Permissions:
- View assigned tickets
- View ticket details
- Add comments
- Update ticket status
- Update ticket information
- Resolve assigned tickets

Agents cannot manage users, assign tickets to other agents, or access administrative controls.


## 4. Core Features

### 4.1 Authentication and Authorization

- User signup and login
- JWT-based authentication
- HttpOnly cookies
- Logout
- Protected routes
- Role-based access control
- Admin and Agent roles

### 4.2 Ticket Management

- Create tickets
- View tickets
- View ticket details
- Update tickets
- Delete tickets
- Assign tickets to agents
- Change ticket status
- Change ticket priority
- Add comments
- Maintain ticket history

Ticket statuses:
- Open
- In Progress
- Resolved
- Closed

Ticket priorities:
- Low
- Medium
- High
- Critical

### 4.3 Dashboard

- Display total ticket count
- Display tickets by status
- Display tickets by priority
- Display critical tickets
- Search tickets
- Filter tickets
- Sort tickets
- Paginate ticket results

### 4.4 AI Features

- Predict ticket category
- Recommend ticket priority
- Analyze ticket sentiment
- Generate ticket summaries

### 4.5 Redis

- Cache frequently requested ticket data
- Implement API rate limiting

### 4.6 Real-Time Features

- Real-time ticket assignment updates
- Real-time ticket status updates
- Real-time comment updates using Socket.IO

## 5. Main User Workflows

### 5.1 Ticket Creation and AI Analysis

When a ticket is created, the system stores the ticket and sends its content for AI analysis. The AI provides recommendations for the ticket category, priority, and sentiment. These recommendations are shown to the Admin or Agent and can be reviewed or changed.

### 5.2 Ticket Assignment

An Admin can assign an open ticket to an Agent. The assigned Agent can then view and work on the ticket. The assignment is also communicated to connected users through real-time updates.

### 5.3 Ticket Resolution

An Agent works on an assigned ticket by updating its status, changing relevant ticket information, and adding comments. The typical status flow is:

Open → In Progress → Resolved → Closed

Important ticket changes are recorded in the ticket history.

### 5.4 Real-Time Updates

When a ticket is assigned, its status changes, or a new comment is added, connected users receive the update in real time through Socket.IO without manually refreshing the page.

### 5.5 AI Ticket Summary

The system can use the ticket description and conversation history to generate a concise summary of the issue, investigation, and resolution.


## 6. MVP Scope

The MVP will focus on delivering a complete AI-powered support ticket management system within a limited development timeline.

### MVP Features

- MERN-based application
- User authentication and authorization
- Admin and Agent roles
- Ticket creation and management
- Ticket assignment
- Ticket comments
- Ticket history
- Ticket status and priority management
- Dashboard and ticket analytics
- Search, filtering, sorting, and pagination
- AI-based ticket category prediction
- AI-based priority recommendation
- AI-based sentiment analysis
- AI-generated ticket summaries
- Redis-based caching
- Redis-based API rate limiting
- Real-time updates using Socket.IO
- Docker-based local environment

### Future Enhancements

The following features are intentionally outside the MVP scope and may be added in future versions:

- Kafka and event-driven architecture
- Microservices
- Background processing workers
- Retrieval-Augmented Generation (RAG)
- Nginx load balancing
- AWS-based production infrastructure
- CI/CD pipelines
- Prometheus and Grafana monitoring
- OpenTelemetry-based distributed tracing
- MongoDB sharding


## 7. Non-Functional Requirements

### 7.1 Security

- Passwords must never be stored in plain text.
- Passwords will be hashed using bcrypt.
- Authentication will use JWT tokens stored in HttpOnly cookies.
- Protected resources will require authentication.
- Role-based authorization will restrict Admin and Agent operations.
- Sensitive configuration such as database credentials and JWT secrets will be stored in environment variables.
- API rate limiting will be implemented using Redis.

### 7.2 Performance

- MongoDB indexes will be created for frequently queried fields.
- Ticket lists will support pagination.
- Frequently accessed ticket data will be cached using Redis.
- APIs should avoid unnecessary database queries.

### 7.3 Reliability

- The backend will use centralized error handling.
- API requests will be validated before processing.
- The API will return consistent error responses.
- Failures in external AI operations should not crash the main application.

### 7.4 Maintainability

- The backend will follow a modular monolith architecture.
- Backend modules will follow MVC with a service layer.
- Configuration will be managed through environment variables.
- The codebase will use meaningful Git commits.
- Important architectural and API decisions will be documented.

### 7.5 Real-Time Requirements

The system should provide real-time updates for important ticket events such as:

- Ticket assignment
- Ticket status changes
- New comments