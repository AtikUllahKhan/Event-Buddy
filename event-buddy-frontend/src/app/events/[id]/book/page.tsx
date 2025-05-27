'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/axios'
import { jwtDecode } from 'jwt-decode'
import { getUserFromToken } from '../../../../lib/auth'
type Event = {
  id: number
  title: string
  date: string
  location: string
  totalSeats: number
  bookedSeats: number
  description: string
}

export default function BookEventPage() {
  const router = useRouter()
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [seats, setSeats] = useState<number>(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const decoded = getUserFromToken()
    if (decoded) setUser(decoded)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    try {
      jwtDecode(token)
      fetchEvent()
    } catch {
      router.push('/login')
    }
  }, [])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    } catch {
      alert('Event not found')
      router.push('/')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setShowConfirm(false)
    router.push('/login')
  }

  const handleBooking = async () => {
    try {
      await api.post('/bookings', { eventId: Number(id), seats })
      alert('Booking successful!')
      router.push('/my-bookings')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed')
    }
  }

  if (!event) return <div className="p-6">Loading...</div>

  const eventDate = new Date(event.date)
  const availableSeats = event.totalSeats - event.bookedSeats

  return (
    <div className="bg-[#f8f9ff] text-gray-800 min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-purple-800">Event buddy.</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-4 items-center relative">
            {user ? (
              <>
                <p className="text-sm text-blue-900 font-medium">
                  Hello, <strong>{user.name}</strong>
                </p>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Logout
                </button>

                {/* Confirmation Popup */}
                {showConfirm && (
                  <div className="absolute top-12 right-0 bg-white border shadow-md p-4 rounded z-50">
                    <p className="text-sm mb-3 text-gray-800 font-medium">
                      Are you sure you want to logout?
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                      >
                        No
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:brightness-110 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="text-sm text-purple-800 mb-4 hover:underline">
          ← Back to event
        </button>

        {/* Image */}
        <div className="w-full h-64 bg-gray-200 rounded overflow-hidden mb-6">
          <img
            src="/Event_1.jpg"
            alt="Event banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Tech</span>
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Conference</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">AI</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        {/* Info box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow text-sm mb-8">
          <div>
            <p className="font-semibold text-gray-600">📅 Date</p>
            <p>{eventDate.toLocaleDateString('en-GB', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">⏰ Time</p>
            <p>
              {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
              {new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">📍 Location</p>
            <p>{event.location}</p>
          </div>
        </div>

        {/* Seat selection */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">Select Number of Seats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setSeats(num)}
                className={`border rounded-md py-3 text-center font-medium transition ${
                  seats === num
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-800 hover:border-purple-400'
                }`}
              >
                🎟️ {num} {num === 1 ? 'Seat' : 'Seats'}
              </button>
            ))}
          </div>
          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Book {seats} {seats === 1 ? 'Seat' : 'Seats'}
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">About this event</h2>
          <p className="text-sm text-gray-700 mb-3">
            Join us for Tech Future Expo 2025, an immersive one-day technology event bringing together developers, startups, and industry leaders to explore the future of software, AI, blockchain, and cloud computing.
          </p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            <li>Keynote talks from industry pioneers</li>
            <li>Live demos of upcoming tech products</li>
            <li>Startup pitching sessions • Hands-on coding workshops</li>
            <li>Networking lounge for professionals and students</li>
          </ul>
        </div>

        {/* Availability */}
        <div className="text-sm text-purple-800 font-medium flex items-center gap-2 mb-8">
          🪑 {availableSeats} Spots Left <span className="text-gray-500">({event.bookedSeats} registered)</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#eef2ff] py-6 text-sm text-gray-600 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer mb-4 md:mb-0"
            onClick={() => router.push('/')}
          >
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-purple-800">Event buddy.</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => router.push('/')} className="hover:underline">Home</button>
            <button onClick={() => router.push('/login')} className="hover:underline">Sign in</button>
            <button onClick={() => router.push('/register')} className="hover:underline">Sign up</button>
            <button onClick={() => router.push('/privacy-policy')} className="hover:underline">Privacy Policy</button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>© 2025 Event buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
