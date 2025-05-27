'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import api from '../lib/axios'
import { getUserFromToken } from '../lib/auth'


type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
  totalSeats: number
  bookedSeats: number
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
    const [showConfirm, setShowConfirm] = useState(false)

 useEffect(() => {
  const decoded = getUserFromToken()
  if (decoded) {
    setUser(decoded)
  }
}, [])
  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
  fetchEvents()
  fetchPastEvents()
}, [])



  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/upcoming')
      setEvents(res.data)
    } catch {
      alert('Failed to load events')
    }
  }
 
  const fetchPastEvents = async () => {
  try {
    const res = await api.get('/events/past')
    setPastEvents(res.data)
  } catch {
    alert('Failed to load past events')
  }
}

  const handleBook = (eventId: number) => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    try {
      jwtDecode(token)
      router.push(`/events/${eventId}/book`)
    } catch {
      router.push('/login')
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setShowConfirm(false)
  }


  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-[#f8f9ff] text-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-purple-800">
              Event buddy.
            </span>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#eef2ff] to-[#dce1ff] px-6 pt-20 pb-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>

        <img src="/ticket-right.png" alt="ticket" className="absolute top-20 left-10 w-32 md:w-60 rotate-[-10deg]" />
        <img src="/ticket-left.png" alt="ticket" className="absolute top-20 right-10 w-32 md:w-60 rotate-[15deg]" />
        <img src="/star_1.png" alt="star" className="absolute top-80 left-10 w-24 md:w-32" />
        <img src="/star_2.png" alt="star" className="absolute top-80 right-10 w-24 md:w-32" />

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-purple-900">
            Discover <span className="text-blue-600">Amazing</span> Events
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Find and book events that match your interests. From tech conferences to music festivals,<br/>
             we’ve got you covered.
          </p>
          
          <p className="text-2xl font-bold text-purple-900">
           Find Your Next Event
          </p>

          <div className="mt-10 flex max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-3 outline-none bg-white"
            />
            <button className="bg-blue-600 text-white px-6 hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-6 py-14 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-200">
                  <img
                    src="/Event_1.jpg"
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-sm text-gray-400 font-semibold">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    📅 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    📍 {event.location}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Tech</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Conference</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">All</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex justify-between">
                    <span>{event.totalSeats - event.bookedSeats} Spots Left</span>
                    <span>Total {event.totalSeats} Seats</span>
                  </div>
                  <button
                    onClick={() => handleBook(event.id)}
                    className="w-full bg-blue-600 text-white mt-3 py-2 rounded hover:bg-blue-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No events found for your search.</p>
          )}
        </div>
      </section>

      {/* Previous Events */}
<section className="px-6 py-12 max-w-7xl mx-auto">
  <h2 className="text-2xl font-bold mb-6">Previous Events</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {pastEvents.length > 0 ? (
      pastEvents.map((event) => (
        <div
          key={event.id + '-prev'}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div className="h-40 bg-gray-200">
            <img
              src="/Event_1.jpg"
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="text-sm text-gray-400 font-semibold">
              {new Date(event.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              📍 {event.location}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Tech</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Conference</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Past</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">No past events available.</p>
    )}
  </div>
</section>


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
