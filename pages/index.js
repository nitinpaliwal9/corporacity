'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // placeholder - you can use this to route users after login
    })
    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // ensure Supabase returns the user to your live domain
      redirectTo: 'https://corporacity.hustlehackai.in'
    }
  })
  if (error) {
    console.error('OAuth error', error)
    setMessage(error.message)
  }
}

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
    <div className="w-full max-w-2xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">C</div>
          <div>
            <h1 className="text-2xl font-semibold">Corporacity</h1>
            <div className="text-xs text-gray-500">The simplest way to keep your team in sync</div>
          </div>
        </div>
      </header>

      <main className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-2">Corporacity — Simple status updates for teams</h2>
        <p className="text-sm text-gray-600 mb-6">Create a company and invite employees, or join using a company code.</p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
  
  <button
    onClick={signInWithGoogle}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm sm:shrink-0"
  >
    Sign in with Google
  </button>
</div>


        {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/create-company" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Create Company</Link>
          <Link href="/join" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Join Company</Link>
          <Link href="/employee" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Employee Status (demo)</Link>
          <Link href="/ceo" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">CEO Dashboard (demo)</Link>
        </div>
      </main>

      <footer className="mt-6 text-xs text-gray-400 text-center">
        Built for testing • Readme: check <span className="text-gray-600">/supabase/schema.sql</span>
      </footer>
    </div>
  </div>
)

}
