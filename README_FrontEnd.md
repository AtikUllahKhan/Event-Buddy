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

##  Configure Tailwind

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // adjust if necessary
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2e0b79',
        fontFamily: {
      inter: ['Inter', 'sans-serif'],

      },
    },
  },
  plugins: [],
}
  }



