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



## 8. Role and Permission Model

ResolveAI will initially support two roles: Admin and Agent.

### Admin

The Admin manages the support system and has access to administrative and ticket management operations.

Permissions:
- Manage agents
- View all tickets
- Create tickets
- View ticket details
- Assign tickets
- Change ticket priority
- Change ticket status
- Add comments
- Resolve tickets
- View ticket history
- Access the dashboard

### Agent

The Agent is responsible for handling tickets assigned to them.

Permissions:
- View assigned tickets
- Create tickets
- View ticket details
- Change ticket priority
- Change ticket status
- Add comments
- Resolve assigned tickets
- View ticket history

Agents cannot manage users, assign tickets, view all tickets, or access administrative controls.

### Resource-Level Authorization

Role-based authorization alone is not sufficient for ticket access. Agents must also be authorized based on the specific ticket they are attempting to access.

An Agent can access and modify a ticket only when the ticket is assigned to that Agent.


## 9. Multi-Tenant Data Model

ResolveAI will support multiple organizations using the same application.

Each organization will have its own users and tickets. Data belonging to one organization must not be accessible to users belonging to another organization.

The initial implementation will use a shared MongoDB database with logical tenant isolation.

### Organization Structure

Organization
- Users
- Tickets

Users and tickets will contain an `organizationId` that identifies the organization they belong to.

The backend will enforce organization-level authorization by ensuring that users can only access resources belonging to their organization.

### Tenant Isolation Rule

For organization-scoped resources:

`User.organizationId` must match `Resource.organizationId`.

This prevents users from accessing tickets or other resources belonging to another organization.


## 10. User Lifecycle

### Organization and Admin Creation

The first user will create an organization during signup. The system will create the organization and associate the user with it using the Admin role.

Flow:

Signup → Create Organization → Create Admin User → Admin Dashboard

### Agent Creation

An Admin can create Agent accounts within their organization. Newly created Agents will automatically belong to the same organization as the Admin who created them.

Agents cannot create other Admin accounts or manage users outside their organization.

### Authentication Lifecycle

Users will authenticate using their email and password.

After successful authentication:
1. The server verifies the user's credentials.
2. The server generates a JWT.
3. The JWT is stored in an HttpOnly cookie.
4. Protected API requests use the authenticated identity to determine the user's organization and role.

### Logout

When a user logs out, the authentication cookie will be cleared and the user will no longer be authenticated.


## 11. Database Design

### 11.1 Organization

The Organization entity represents a company or workspace using ResolveAI.

Fields:

- `_id` — MongoDB generated identifier
- `name` — Organization name
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

Each organization can have multiple users and tickets.


### 11.2 User

The User entity represents an Admin or Agent belonging to an organization.

Fields:

- `_id` — MongoDB generated identifier
- `name` — User's name
- `email` — Login email
- `password` — Bcrypt-hashed password
- `role` — User role (`admin` or `agent`)
- `organizationId` — Organization the user belongs to
- `createdAt` — Account creation timestamp
- `updatedAt` — Last update timestamp

Constraints:

- Email must be unique.
- Role must be either `admin` or `agent`.
- Organization ID is required.
- Password must never be stored in plain text.
- Every user must belong to an organization.

Each user belongs to exactly one organization.



### 11.3 Ticket

The Ticket entity represents a support issue reported within an organization.

Fields:

- `_id` — MongoDB generated identifier
- `title` — Short description of the issue
- `description` — Detailed description of the issue
- `organizationId` — Organization that owns the ticket
- `createdBy` — Reference to the user who created the ticket
- `assignedTo` — Reference to the Agent assigned to the ticket; can be null when unassigned
- `status` — Current ticket status
- `priority` — Current ticket priority
- `category` — Current ticket category
- `aiAnalysis` — AI-generated recommendations and sentiment analysis
- `aiSummary` — AI-generated summary of the ticket and its conversation
- `createdAt` — Ticket creation timestamp
- `updatedAt` — Last update timestamp

Status values:

- `open`
- `in_progress`
- `resolved`
- `closed`

Priority values:

- `low`
- `medium`
- `high`
- `critical`

The `aiAnalysis` object will contain:

- `recommendedPriority`
- `predictedCategory`
- `sentiment`

AI recommendations will be stored separately from the current ticket values so that users can review and override AI recommendations.


### 11.4 Comment

The Comment entity represents a message added to a ticket by a user.

Fields:

- `_id` — MongoDB generated identifier
- `ticketId` — Reference to the ticket
- `organizationId` — Organization that owns the comment
- `author` — Reference to the user who created the comment
- `content` — Comment text
- `createdAt` — Comment creation timestamp
- `updatedAt` — Last update timestamp

Comments will be stored in a separate collection rather than embedded directly inside the Ticket document.

Each comment belongs to exactly one ticket and is created by a user belonging to the same organization as the ticket.



### 11.5 Ticket History

The TicketHistory entity records important changes and actions performed on a ticket.

Fields:

- `_id` — MongoDB generated identifier
- `ticketId` — Reference to the ticket
- `organizationId` — Organization that owns the ticket
- `userId` — Reference to the user who performed the action
- `action` — Type of action performed
- `oldValue` — Previous value when applicable
- `newValue` — New value when applicable
- `createdAt` — Time when the action occurred

Examples of actions include:

- `created`
- `assigned`
- `status_changed`
- `priority_changed`
- `comment_added`
- `updated`
- `resolved`
- `closed`

Ticket history records are immutable and should not be modified after creation.



### 11.6 Entity Relationships

The relationships between the main entities are:

- One Organization has many Users.
- One Organization has many Tickets.
- Each User belongs to exactly one Organization.
- Each Ticket belongs to exactly one Organization.
- One User can create many Tickets through `createdBy`.
- One User can be assigned many Tickets through `assignedTo`.
- A Ticket can have zero or one current assignee.
- One Ticket has many Comments.
- One User can create many Comments through `author`.
- One Ticket has many TicketHistory records.
- One User can create many TicketHistory records through `userId`.

Relationship summary:

Organization 1 → N User

Organization 1 → N Ticket

User 1 → N Ticket (createdBy)

User 1 → N Ticket (assignedTo)

Ticket 1 → N Comment

User 1 → N Comment (author)

Ticket 1 → N TicketHistory

User 1 → N TicketHistory (userId)



### 11.7 Database Indexes

Indexes will be added based on the application's expected query patterns.

#### User

- Unique index on `email` for efficient login lookups and email uniqueness.

#### Ticket

Important ticket queries will commonly filter by organization, assignee, and status and sort by creation time.

Initial indexes will include:

- `organizationId`
- `organizationId + status`
- `organizationId + assignedTo`
- `organizationId + createdAt`

#### Comment

Comments will commonly be retrieved by ticket, so an index will be created on:

- `ticketId`

#### TicketHistory

Ticket history will commonly be retrieved by ticket in chronological order, so an index will be created on:

- `ticketId + createdAt`

Indexes will be reviewed and adjusted after observing actual query patterns and performance.


## 12. API Design

### 12.1 API Conventions

The backend API will use REST-style conventions.

The base API path will be:

`/api`

HTTP methods:

- `GET` — Retrieve resources
- `POST` — Create resources
- `PATCH` — Partially update resources
- `DELETE` — Delete resources

Example ticket endpoints:

- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id`
- `DELETE /api/tickets/:id`

### 12.2 Response Format

Successful responses will use a consistent structure.

#### Single Resource Response

Example:

```json
{
  "success": true,
  "data": {}
}


## 13. API Endpoints

### 13.1 Authentication APIs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Create organization and initial Admin user | Public |
| POST | `/api/auth/login` | Authenticate user | Public |
| POST | `/api/auth/logout` | Clear authentication session | Authenticated |
| GET | `/api/auth/me` | Get currently authenticated user | Authenticated |

#### Signup

Request:

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "password123",
  "organizationName": "ABC Support"
}


### 13.2 User APIs

User APIs are primarily used by Admins to manage Agents within their organization.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/users` | List users in the Admin's organization | Admin |
| POST | `/api/users` | Create an Agent | Admin |
| GET | `/api/users/:id` | Get user details | Admin |
| PATCH | `/api/users/:id` | Update user information | Admin |
| DELETE | `/api/users/:id` | Delete an Agent | Admin |

The `POST /api/users` endpoint will create users with the `agent` role. Admin users cannot be created through this endpoint.

All user-management operations must be restricted to the authenticated Admin's organization.

The backend must verify that the target user's `organizationId` matches the authenticated Admin's `organizationId` before allowing organization-scoped operations.


### 13.3 Ticket APIs

Ticket APIs provide the main support ticket management functionality.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/tickets` | List tickets | Admin / Agent |
| POST | `/api/tickets` | Create a ticket | Admin / Agent |
| GET | `/api/tickets/:id` | Get ticket details | Admin / assigned Agent |
| PATCH | `/api/tickets/:id` | Update ticket information | Admin / assigned Agent |
| DELETE | `/api/tickets/:id` | Delete a ticket | Admin |
| PATCH | `/api/tickets/:id/assign` | Assign ticket to an Agent | Admin |
| PATCH | `/api/tickets/:id/status` | Change ticket status | Admin / assigned Agent |
| PATCH | `/api/tickets/:id/priority` | Change ticket priority | Admin / assigned Agent |

#### List Tickets

`GET /api/tickets` will support pagination and filtering.

Example:

`GET /api/tickets?page=1&limit=10`

Filtering will support fields such as:

- `status`
- `priority`
- `assignedTo`
- `category`

Search and sorting will also be supported.

Admins can view all tickets belonging to their organization.

Agents can view only tickets assigned to them.

#### Create Ticket

`POST /api/tickets`

Example request:

```json
{
  "title": "Payment failed",
  "description": "My payment was deducted but my order was not placed."
}


### 13.4 Comment APIs

Comments provide communication between users working on a ticket.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/tickets/:id/comments` | Get comments for a ticket | Admin / assigned Agent |
| POST | `/api/tickets/:id/comments` | Add a comment to a ticket | Admin / assigned Agent |
| PATCH | `/api/comments/:id` | Edit a comment | Comment author |
| DELETE | `/api/comments/:id` | Delete a comment | Comment author / Admin |

#### Get Comments

`GET /api/tickets/:id/comments` returns comments belonging to the specified ticket.

The same ticket-level authorization rules apply:

- Admins can access tickets within their organization.
- Agents can access only tickets assigned to them.

#### Add Comment

`POST /api/tickets/:id/comments`

Example request:

```json
{
  "content": "I have checked the payment transaction."
}


## 13.5 Dashboard APIs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Get overall ticket statistics | Admin |
| GET | `/api/dashboard/tickets-by-status` | Get ticket counts by status | Admin |
| GET | `/api/dashboard/tickets-by-priority` | Get ticket counts by priority | Admin |
| GET | `/api/dashboard/trends` | Get ticket activity trends | Admin |

### Dashboard API Rules

Dashboard data must be scoped to the authenticated user's organization.

The Admin can view aggregated statistics for all tickets belonging to their organization.

Agents do not have access to administrative dashboard APIs.

### Summary Response

The summary endpoint may return statistics such as:

- Total tickets
- Open tickets
- In-progress tickets
- Resolved tickets
- Closed tickets
- Critical tickets

### Status and Priority Statistics

The status and priority endpoints return aggregated ticket counts grouped by their respective fields.

### Trends

The trends endpoint provides ticket activity over time for dashboard visualizations.

The backend should perform aggregation using MongoDB rather than fetching all tickets into the application.

Dashboard APIs are read-only and do not modify tickets or other resources.


## 13.6 AI APIs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/ai/analyze` | Analyze or re-analyze a ticket and generate AI recommendations | Admin / assigned Agent |
| POST | `/api/ai/summarize` | Generate a concise summary of a ticket | Admin / assigned Agent |

### AI API Rules

AI APIs must follow the same organization and resource-level authorization rules as ticket APIs.

Admins can use AI features for tickets within their organization.

Agents can use AI features only for tickets assigned to them.

Users cannot analyze or summarize tickets belonging to another organization.

### Ticket Analysis

The `/api/ai/analyze` endpoint analyzes or re-analyzes the ticket title and description and provides:

- Predicted ticket category
- Recommended ticket priority
- Ticket sentiment

AI recommendations are suggestions and do not automatically override the ticket's current category or priority.

### Ticket Summarization

The `/api/ai/summarize` endpoint generates a concise summary using the ticket description and available ticket comments.

The generated summary will be stored in the ticket's `aiSummary` field.

### AI Data Storage

AI-generated analysis will be stored separately from the ticket's current values.

The `aiAnalysis` object will contain:

- `recommendedPriority`
- `predictedCategory`
- `sentiment`

This allows users to review AI recommendations and manually override them when necessary.

### AI Failure Handling

AI processing must not prevent successful ticket creation or normal ticket operations.

When AI analysis fails during ticket creation, the ticket will still be created successfully and the AI fields may remain unavailable until analysis is retried.

If AI processing fails:

1. The ticket operation should still succeed.
2. The AI failure should be handled by the backend.
3. Internal AI errors should not be exposed to the client.
4. AI analysis can be retried later.

### AI Service Separation

AI processing will be implemented as a separate service layer within the modular monolith.

The Ticket Service will handle ticket operations, while the AI Service will handle AI-specific processing.

The intended flow is:

Ticket Creation → Ticket Service → AI Service → Store AI Results

AI failures must not cause the main ticket operation to fail.