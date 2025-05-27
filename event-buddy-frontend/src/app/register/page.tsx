'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/axios'
import Link from 'next/link'


export default function RegisterPage() {

  const[name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/auth/signup', { name, email, password })
      router.push('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#eef0ff] flex flex-col items-center justify-center px-4">
      {/* Logo like homepage */}
      <div className="absolute top-6 left-6 flex items-center cursor-pointer" onClick={() => router.push('/')}>
        <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain mr-2" />
        <span className="text-2xl font-bold text-purple-800">Event buddy.</span>
      </div>

      {/* Register Card */}
      <div className="bg-white p-10 rounded-md shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Sign Up</h2>
        <p className="text-sm text-gray-600 mb-6">
          Already have an account? ?{' '}
          <Link href="/login" className="text-purple-700 hover:underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

