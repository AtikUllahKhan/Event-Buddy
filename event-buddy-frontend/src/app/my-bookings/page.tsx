'use client'

import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import { useRouter } from 'next/navigation'
import { getUserFromToken } from '../../lib/auth'

type Booking = {
  id: number
  seats: number
  event: {
    id: number
    title: string
    date: string
    location: string
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [userName, setUserName] = useState('')
  

  useEffect(() => {
    const user = getUserFromToken()
    if (!user) return router.push('/login')
    setUserName(user.name || 'User')
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings')
      setBookings(res.data)
    } catch {
      alert('Failed to load bookings')
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(bookings.filter((b) => b.id !== id))
    } catch {
      alert('Failed to cancel registration')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="bg-[#f9f7fc] min-h-screen">
      {/* Top Navbar — Consistent with app/page.tsx */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo + Brand */}
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.push('/')}
    >
      <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
      <span className="text-2xl font-bold text-purple-800">Event buddy.</span>
    </div>

    {/* Greeting + Logout */}
    <div className="flex items-center gap-4">
      <p className="text-sm text-blue-900 font-medium">
        Hello, <strong>{userName}</strong>
      </p>
     <button
       onClick={handleLogout}
       className="flex items-center gap-2 bg-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition">
      <svg
       xmlns="http://www.w3.org/2000/svg"
       className="h-5 w-5"
       fill="none"
       viewBox="0 0 24 24"
       stroke="currentColor"
       strokeWidth={2} >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"/>
      </svg>
       Logout
     </button>

    </div>
  </div>
</header>


      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#2e2e7e]">Dashboard</h1>
        <p className="text-[#7c6fb2] mb-6">
          Welcome back, <strong>{userName}</strong>! Here you can manage your event registrations.
        </p>

        <h2 className="text-xl font-semibold mb-4">My Registered Events</h2>
        {bookings.length === 0 && <p>No bookings yet.</p>}

        <div className="space-y-4">
          {bookings.map((booking) => {
            if (!booking.event) return null
            const eventDate = new Date(booking.event.date)
            const day = eventDate.getDate()
            const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
            const weekday = eventDate.toLocaleString('en-US', { weekday: 'long' })
            const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            return (
              <div
                key={booking.id}
                className="flex justify-between items-center bg-white p-4 rounded-md shadow border"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center bg-[#f2f0fb] text-[#2e2e7e] font-bold p-2 w-16 rounded">
                    <div className="text-xs">{month}</div>
                    <div className="text-2xl">{day}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{booking.event.title}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {weekday} &nbsp;&nbsp; 🕒 {time} &nbsp;&nbsp; 📍 {booking.event.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel registration
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            className="bg-[#5c5eff] hover:bg-[#4b4ced] text-white font-medium px-6 py-2 rounded shadow"
            onClick={() => router.push('/')}
          >
            Browse more events
          </button>
        </div>
      </div>
     {/* Footer */}
      <footer className="bg-[#eef2ff] py-6 text-sm text-gray-600">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
    {/* Logo (Left side) */}
    <div
      className="flex items-center gap-2 cursor-pointer mb-4 md:mb-0"
      onClick={() => router.push('/')}
    >
      <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
      <span className="text-xl font-bold text-purple-800">Event buddy.</span>
    </div>

    {/* Links (Right side) */}
    <div className="flex gap-6">
      <button onClick={() => router.push('/')} className="hover:underline">Home</button>
      <button onClick={() => router.push('/login')} className="hover:underline">Sign in</button>
      <button onClick={() => router.push('/register')} className="hover:underline">Sign up</button>
      <button onClick={() => router.push('/privacy-policy')} className="hover:underline">Privacy Policy</button>
    </div>
  </div>

  {/* Copyright */}
  <div className="text-center mt-4">
    <p>© 2025 Event buddy. All rights reserved.</p>
  </div>
</footer>
    </div>
  )
}
