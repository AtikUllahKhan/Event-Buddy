'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../lib/axios'

export default function CreateEventPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [totalSeats, setTotalSeats] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setConfirming(true)
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`
      }

      await api.post(
        '/events',
        { title, description, location, date, totalSeats },
        { headers }
      )

      router.push('/events')
    } catch (error) {
      alert('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f7fc] py-10 px-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold text-[#2e2e7e] mb-6">Create New Event</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Event description"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Total Seats</label>
            <input
              type="number"
              value={totalSeats}
              onChange={e => setTotalSeats(Number(e.target.value))}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Number of seats"
              min={1}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  )
}
