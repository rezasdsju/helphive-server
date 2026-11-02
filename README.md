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