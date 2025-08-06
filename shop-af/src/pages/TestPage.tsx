import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('Testing...')
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      setTestResult('Testing Supabase connection...')

      // Test basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, user_id')
        .limit(5)

      if (error) {
        console.error('Supabase connection error:', error)
        setTestResult(`Error: ${error.message}`)
        return
      }

      console.log('Supabase connection successful!')
      console.log('Profiles found:', data)
      setTestResult('Supabase connection successful!')
      setProfiles(data || [])
    } catch (err: any) {
      console.error('Connection test failed:', err)
      setTestResult(`Exception: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg">{testResult}</p>
        </div>

        {profiles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Available Profiles</h2>
            <div className="space-y-2">
              {profiles.map((profile, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <p><strong>Username:</strong> {profile.username}</p>
                  <p><strong>Display Name:</strong> {profile.display_name}</p>
                  <p><strong>User ID:</strong> {profile.user_id}</p>
                  <a 
                    href={`/u/${profile.username}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  )
}
