// pages/onboarding.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleCreateCompany = () => {
    router.push('/create-company')
  }

  const handleJoinCompany = () => {
    router.push('/join')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Corporacity</h2>
        <p className="text-sm text-gray-600 mb-6">Choose how you'd like to get started — create a company or send a join request using a company ID.</p>

        <div className="flex flex-col gap-3">
          <button onClick={handleCreateCompany} className="w-full bg-blue-600 text-white py-3 rounded">Create a company (I’m the owner)</button>
          <button onClick={handleJoinCompany} className="w-full border py-3 rounded">Join an existing company (I have a company ID)</button>
        </div>

        {msg && <div className="mt-4 text-sm text-red-600">{msg}</div>}
      </div>
    </div>
  )
}
