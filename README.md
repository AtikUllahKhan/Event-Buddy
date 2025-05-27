# Event-Buddy Backend
## Features

- User registration & login (JWT Auth)
- Admin dashboard to create/edit/delete events
- Event booking by users
- Role-based access control
- Bookings history for users
- RESTful API

## Tech

- **NestJS** – Framework
- **TypeORM** – ORM for database
- **PostgreSQL** – Relational database
- **JWT** – Secure auth tokens
- **bcrypt** – Password hashing
- **class-validator** – DTO validation
  
## Initialize Project:
- npm i -g @nestjs/cli
- nest new event-buddy-backend
## Install Dependencies
- cd event-buddy-backend
## Database
- npm install @nestjs/typeorm typeorm pg
## Auth
- npm install @nestjs/passport passport passport-local
- npm install @nestjs/jwt passport-jwt
- npm install bcrypt
- npm install @types/bcrypt --save-dev
## Validation
- npm install class-validator class-transformer
## Runing the project
- npm run start-dev
  
## Configure environment variables
-  type: 'postgres'
-  host: 'localhost'
-  port: 5432
-  username: 'postgres'
-  password: 'trust'
-  database: 'Event_buddy'

| Method | Endpoint                 | Description           | Auth     |
|--------|--------------------------|------------------------|----------|
| POST   | /auth/signup             | Register new user      | ❌       |
| POST   | /auth/login              | Login (returns JWT)    | ❌       |
| GET    | /events/upcoming         | Fetch future events    | ❌       |
| GET    | /events/past             | Fetch past events      | ❌       |
| POST   | /events                  | Create event (admin)   | ✅ admin |
| PUT    | /events/:id              | Update event           | ✅ admin |
| DELETE | /events/:id              | Delete event           | ✅ admin |
| POST   | /bookings/:eventId       | Book seats             | ✅ user  |
| GET    | /bookings/my-bookings    | View user's bookings   | ✅ user  |
| DELETE | /bookings/:id            | Cancel a booking       | ✅ user  |



