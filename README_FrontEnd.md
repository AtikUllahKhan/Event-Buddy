#  Event Buddy FrontEnd


- User authentication (register/login)
- Booking seats for events
- Admin event creation, editing, and management

## Initialize Project
- npx create-next-app@latest
- cd event-buddy-frontend
## Install tools
- npm install axios react-hook-form yup @hookform/resolvers jwt-decode
- npm install tailwindcss postcss autoprefixer
-  npm install jwt-decode@3.1.2
## Running the project
- npm run dev

## Project Structure
├──  app/                  
│
├── page.tsx               # Homepage (public landing page with event search)
│
├── login/
│   └── page.tsx           # Login form page for users and admins
│
├── register/
│   └── page.tsx           # User registration form page
│
├── events/                # Event-related routes (protected/admin/user-specific)
│
│   ├── page.tsx           # Admin Dashboard:
│   │                         - Displays list of all upcoming events
│   │                         - Allows admin to edit, delete, and view registrations
│
│   ├── create/
│   │   └── page.tsx       # Admin Event Creation Form:
│   │                         - Input title, description, seats, date, location
│   │                         - POST to `/events`
│
│   ├── [id]/
│   │   ├── page.tsx       # Basic Booking Page (Used by users):
│   │                         - Confirms seat selection
│   │                         - Makes booking request
│   │
│   │   ├── book/
│   │   │   └── page.tsx   # Full Booking UI:
│   │   │                     - Shows event image, details, and interactive seat selection
│   │   │                     - POST to `/bookings`
│   │   │                     - Includes logout dropdown and auth context
│   │
│   │   └── edit/
│   │       └── page.tsx   # Admin Event Edit Form:
│   │                         - PATCH existing event
│   │                         - Shows pre-filled values
|
|
├── lib
│
├── axios.ts               # Axios instance:
│                            - Sets base URL (e.g., localhost:3000)
│                            - Attaches JWT token to every request (if available)
│
└── auth.ts                # Token decoding utility:
                             - `getUserFromToken()`: reads `localStorage` and decodes JWT
                             - Used to protect routes and get user info (e.g., name, role)



