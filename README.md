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

## Technologies

- Node.js
- Express.js
- MongoDB
- CORS
- dotenv

## API Endpoints

**Base URL:** [https://helphive-community-server.vercel.app](https://helphive-community-server.vercel.app)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-event` | Create a new event |
| GET | `/upcoming-events` | Retrieve all upcoming events |
| GET | `/upcoming-events/:id` | Retrieve event details by ID |