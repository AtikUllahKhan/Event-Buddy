'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '../../../../lib/axios'

export default function EditEventPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    totalSeats: 0,
  })

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`)
        const data = res.data
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          date: data.date.slice(0, 16), // to fit datetime-local
          totalSeats: data.totalSeats,
        })
      } catch (error) {
        alert('Failed to load event.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch(`/events/${id}`, form)
      alert('Event updated successfully!')
      router.push('/events')
    } catch (error) {
      alert('Failed to update event.')
    }
  }

  if (loading) return <p className="p-6 text-center">Loading...</p>

  return (
    <div className="min-h-screen bg-[#f9f7fc] p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#2e2e7e] mb-4">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              value={form.totalSeats}
              onChange={handleChange}
              required
              min={1}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#5c5eff] hover:bg-[#4b4ced] text-white px-6 py-2 rounded font-medium shadow"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
