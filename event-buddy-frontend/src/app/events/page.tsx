'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/axios'
import { getUserFromToken } from '../../lib/auth'
import Link from 'next/link'

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
  totalSeats: number
  bookedSeats: number
}


  


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [userName, setUserName] = useState('Admin')
  const [showSuccess, setShowSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const user = getUserFromToken()
    if (!user) return router.push('/login')
    setUserName(user.name || 'Admin')
    fetchEvents()
    // Show success message if redirected from event creation
  const created = localStorage.getItem('eventCreated')
  if (created) {
    setShowSuccess(true)
    localStorage.removeItem('eventCreated')
  }
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/upcoming')
      setEvents(res.data)
    } catch {
      alert('Failed to load events')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f7fc]">
        {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded shadow z-50 animate-slide-in">
          🎉 Event created successfully!
          <button
            className="ml-4 font-bold"
            onClick={() => setShowSuccess(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-purple-800">Event buddy.</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-blue-900 font-medium">
              Hello, <strong>{userName}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#2e2e7e]">Admin Dashboard</h1>
        <p className="text-[#7c6fb2] mb-6">
          Manage events, view registrations, and monitor your platform.
        </p>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Events Management</h2>
          <button
            onClick={() => router.push('/events/create')}
            className="bg-[#5c5eff] hover:bg-[#4b4ced] text-white px-5 py-2 rounded shadow"
          >
            Create Event
          </button>
        </div>

        <div className="bg-white rounded-md shadow border overflow-y-auto max-h-[500px]">
  <table className="w-full text-left text-sm table-auto">
    <thead className="bg-[#f2f0fb] text-[#2e2e7e] font-medium">
      <tr>
        <th className="px-4 py-3">Title</th>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Location</th>
        <th className="px-4 py-3">Registrations</th>
        <th className="px-4 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {events.map((event) => (
        <tr key={event.id} className="border-t hover:bg-gray-50">
          <td className="px-4 py-3">{event.title}</td>
          <td className="px-4 py-3">
            {new Date(event.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </td>
          <td className="px-4 py-3">{event.location}</td>
          <td className="px-4 py-3">
            {event.bookedSeats}/{event.totalSeats}
          </td>
          <td className="px-4 py-3 flex gap-3 items-center">
            <button
              onClick={() => router.push(`/events/${event.id}`)}
              className="text-blue-600 hover:text-blue-800"
              title="View"
            >
              👁️
            </button>
            <button
              onClick={() => router.push(`/events/${event.id}/edit`)}
              className="text-gray-600 hover:text-gray-800"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => alert('Delete action')}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              🗑️
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </main>

      {/* Footer */}
      <footer className="bg-[#eef2ff] py-6 text-sm text-gray-600">
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
