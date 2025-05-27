'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '../../../lib/axios'
import { jwtDecode } from 'jwt-decode'

type Event = {
  id: number
  title: string
  date: string
  location: string
  totalSeats: number
  bookedSeats: number
}

export default function BookEventPage() {
  const router = useRouter()
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [seats, setSeats] = useState<number>(1)

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Book: {event.title}</h1>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Available Seats:</strong> {event.totalSeats - event.bookedSeats}</p>

      <div className="mt-4 space-y-2">
        <label className="block font-semibold">Number of Seats (1–4):</label>
        <input
          type="number"
          min={1}
          max={4}
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
          className="border px-2 py-1"
        />
        <button
          onClick={handleBooking}
          className="block bg-blue-600 text-white px-4 py-2 mt-2 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  )
}
