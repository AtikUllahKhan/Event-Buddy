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
## API Endpoints

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


src/
│
├── auth/             # Authentication logic
│   ├── dto/  
│        ├── login.dto.ts         # Login Dto (email, password)
│        ├── signup.dto.ts        # Signup Dto (email, name, password, role)
│   ├── auth.controller.ts        # Signup & login routes
│   ├── auth.service.ts           # Auth service with JWT logic
│   ├── auth.guard.ts             # Local & JWT auth guards
│   ├── jwt.strategy.ts           # JWT token validation
│   └── local.strategy.ts         # Email/password login validation
│
├── users/            # User module
│   ├── entity/ 
│       ├── user.entity.ts       # User entity (email, password, role)
|   ├── user.controller.ts       # same as
│   ├── users.service.ts         # CRUD user logic
│   └── users.module.ts          # User module definition
│
├── events/           # Events module
│   ├── dto/  
│        ├── create-event.dto.ts         # Create event Dto
│        ├── update-event.dto.ts         # Update event Dto
│   ├── entity/  
│        ├── event.entity.ts             # Event database schema
│   ├── events.controller.ts             # Admin + public endpoints
│   ├── events.service.ts                # Business logic (create, update, delete)
│   └── events.module.ts                 # Module definition
│
├── bookings/         # Bookings module
│   ├── dto/  
│        ├── create-booking.dto.ts       # create booking event Dto
│   ├── entity/  
│       ├── booking.entity.ts            # Booking schema (eventId, userId, seats)
│   ├── bookings.controller.ts           # Booking endpoints
│   ├── bookings.service.ts              # Logic for seat booking & cancellation
│   └── bookings.module.ts               # Module definition
│
├── app.module.ts     # Database setup & all module
└── main.ts           # Entry point of the app, bootstrap logic




