# HelpHive
### Empowering Communities, One Good Deed at a Time.

HelpHive is a community-driven volunteering platform that connects people through social service events and volunteering opportunities. This repository contains the backend API responsible for handling event data and database operations.

## Live Demo

**Frontend:** [https://helphive-community-indol.vercel.app/](https://helphive-community-indol.vercel.app/)

**Backend API:** [https://helphive-community-server.vercel.app/](https://helphive-community-server.vercel.app/)

## Related Repository

**Frontend:** [HelpHive Client](https://github.com/rezasdsju/helphive-client)


## Features

### Security
- **JWT authentication:** tokens issued by Better Auth are verified on every protected route using the public JWKS endpoint and `jose`
- **Server-side ownership:** the event creator is taken from the verified token, never from client input, so events cannot be created or modified under another user's name

### Events
- Create events with category, date, location, image and a participant limit
- Browse all upcoming events or the six nearest ones
- View full details of any event by ID

### Participation
- Join events as a volunteer, with duplicate joins prevented
- Joining is blocked once an event reaches its participant limit or the date has passed
- Track every event you have joined

### Management
- View the events you created
- Update your own events (owner-only)


## Tech Stack

- **Runtime & framework:** Node.js, Express.js
- **Database:** MongoDB (official Node.js driver)
- **Authentication:** JWT verification with `jose` and Better Auth JWKS
- **Utilities:** CORS, dotenv
- **Deployment:** Vercel

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