# HelpHive
### Empowering Communities, One Good Deed at a Time.

HelpHive is a community-driven volunteering platform that connects people through social service events and volunteering opportunities. This repository contains the backend API responsible for handling event data and database operations.

## Live Demo

**Frontend:** [https://helphive-community-indol.vercel.app/](https://helphive-community-indol.vercel.app/)

**Backend API:** [https://helphive-community-server.vercel.app/](https://helphive-community-server.vercel.app/)

## Related Repository

**Frontend:** [HelpHive Client](https://github.com/rezasdsju/helphive-client)

## Features

- Event creation API with MongoDB integration
- JWT-based API authentication using Better Auth JWKS and `jose` for token verification
- Event creator details (`id`, `name`, `email`) set on the server from the verified token
- Retrieve all upcoming events
- Retrieve the six nearest upcoming events
- Retrieve individual event details by event ID
- JWT-protected participant registration API with duplicate participation handling
- Prevent users from joining past events
- Enforce maximum participant limits during event registration
- JWT-protected API to retrieve events joined by the authenticated user
- JWT-protected API to retrieve events created by the authenticated user
- JWT-Protected Event Update API

## Technologies

- Node.js
- Express.js
- MongoDB
- CORS
- dotenv
- JOSE (JWT verification using JWKS)

## API Endpoints

**Base URL:** [https://helphive-community-server.vercel.app](https://helphive-community-server.vercel.app)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/create-event` | Create a new event | JWT-protected |
| GET | `/upcoming-events` | Retrieve all upcoming events | Public |
| GET | `/upcoming-events/:id` | Retrieve event details by ID | Public |
| GET | `/upcoming-events/limit-6` | Retrieve six nearest upcoming events | Public |
| POST | `/add-participant/:id` | Join an event | JWT-protected |
| GET | `/joined-events` | Retrieve events joined by the authenticated user | JWT-protected |
| GET | `/manage-events` | Retrieve events created by the authenticated user | JWT-protected |
| PATCH | `/manage-events/:id` | Update an event created by the authenticated user | JWT-protected |
| DELETE | `/manage-events/:id` | Delete an event created by the authenticated user | JWT-protected |


## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=
FRONTEND_BASE_URL=
```

- `MONGODB_URI`: MongoDB connection string.
- `FRONTEND_BASE_URL`: Frontend URL used for Better Auth JWKS verification.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rezasdsju/helphive-server.git
cd helphive-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and add the required environment variables.

### 4. Start the Server

```bash
nodemon index.js
```

The server will start locally on port `5000`.

## Database

- **Database:** MongoDB
- **Database Name:** `helphive`
- **Collection:** `events`

## Authentication & Authorization

- Better Auth handles user authentication.
- JWT tokens are verified using `jose`.
- Better Auth JWKS is used for JWT verification.
- Protected endpoints require a valid Bearer token.
- Users can only update or delete their own events.

### Authorization Header

```http
Authorization: Bearer <your_jwt_token>
```

## Deployment

**Platform:** Vercel

**Live Backend:** https://helphive-community-server.vercel.app/

## Contributing

Contributions, suggestions, and feedback are welcome. Feel free to open an issue or submit a pull request.

## Author

**Rezaul Karim Rifat**

- GitHub: https://github.com/rezasdsju
- Frontend Repository: https://github.com/rezasdsju/helphive-client
- Backend Repository: https://github.com/rezasdsju/helphive-server