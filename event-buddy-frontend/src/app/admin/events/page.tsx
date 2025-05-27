'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../lib/axios'
import { getUserFromToken } from '../../../lib/auth'
import { jwtDecode } from 'jwt-decode'

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
  totalSeats: number
  bookedSeats: number
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState<Partial<Event>>({})
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
        try{
    const user = jwtDecode<{ role: string }>(token)
    if (user.role !== 'admin') {
        return router.push('/login')
}
} catch  {
    router.push('./login')
}
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await api.get('/events')
    setEvents(res.data)
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.patch(`/events/${editingId}`, form)
      } else {
        await api.post('/events', form)
      }
      setForm({})
      setEditingId(null)
      fetchEvents()
    } catch {
      alert('Failed to save event')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return
    await api.delete(`/events/${id}`)
    fetchEvents()
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setForm({ ...event, date: event.date.slice(0, 10) })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Events</h1>
      <div className="space-y-2 mb-6">
        <input className="border p-2 block w-full" placeholder="Title" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <textarea className="border p-2 block w-full" placeholder="Description" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <input className="border p-2 block w-full" placeholder="Location" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        <input type="date" className="border p-2 block w-full" value={form.date || ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <input type="number" className="border p-2 block w-full" placeholder="Total Seats" value={form.totalSeats || ''} onChange={e => setForm(f => ({ ...f, totalSeats: parseInt(e.target.value) }))} />
        <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>
          {editingId ? 'Update' : 'Create'} Event
        </button>
      </div>

      <div>
        {events.map(event => (
          <div key={event.id} className="border p-4 mb-3">
            <h2 className="font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
            <p>{event.location}</p>
            <p>Total: {event.totalSeats}, Booked: {event.bookedSeats}</p>
            <div className="mt-2 space-x-4">
              <button onClick={() => handleEdit(event)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
