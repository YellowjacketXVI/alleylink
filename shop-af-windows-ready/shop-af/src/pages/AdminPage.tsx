import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase, WhitelistEntry, Profile } from '../lib/supabase'
import Navbar from '../components/Navbar'
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Calendar,
  Shield,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react'

export default function AdminPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'whitelist'>('users')
  const [users, setUsers] = useState<Profile[]>([])
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [newWhitelistEmail, setNewWhitelistEmail] = useState('')
  const [addingToWhitelist, setAddingToWhitelist] = useState(false)

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    console.log('🔍 AdminPage loadData - Profile:', profile)
    console.log('🔍 AdminPage loadData - Is Admin:', profile?.is_admin)
    console.log('🔍 AdminPage loadData - User:', user?.email)

    setLoading(true)
    try {
      if (profile?.is_admin) {
        console.log('✅ User is admin, loading admin data...')
        await Promise.all([loadUsers(), loadWhitelist()])
      } else {
        console.log('❌ User is not admin, skipping admin data load')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const loadWhitelist = async () => {
    try {
      const { data, error } = await supabase
        .from('whitelist')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWhitelist(data || [])
    } catch (err) {
      console.error('Error loading whitelist:', err)
    }
  }

  const addToWhitelist = async () => {
    if (!newWhitelistEmail.trim()) return

    setAddingToWhitelist(true)
    try {
      const { error } = await supabase
        .from('whitelist')
        .insert([{
          email: newWhitelistEmail.toLowerCase().trim(),
          granted_by_admin: user?.email || 'admin',
          is_active: true
        }])

      if (error) throw error

      setNewWhitelistEmail('')
      await loadWhitelist()
    } catch (err: any) {
      console.error('Error adding to whitelist:', err)
      alert(err.message || 'Failed to add email to whitelist')
    } finally {
      setAddingToWhitelist(false)
    }
  }

  const removeFromWhitelist = async (id: number) => {
    if (!confirm('Are you sure you want to remove this email from the whitelist?')) return

    try {
      const { error } = await supabase
        .from('whitelist')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadWhitelist()
    } catch (err: any) {
      console.error('Error removing from whitelist:', err)
      alert(err.message || 'Failed to remove from whitelist')
    }
  }

  const toggleUserAdmin = async (userId: string, currentAdminStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentAdminStatus ? 'remove' : 'grant'} admin privileges for this user?`)) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('user_id', userId)

      if (error) throw error
      await loadUsers()
    } catch (err: any) {
      console.error('Error updating admin status:', err)
      alert(err.message || 'Failed to update admin status')
    }
  }

  const grantProAccess = async (userId: string) => {
    console.log('🚀 grantProAccess function called with userId:', userId)

    if (!confirm('Are you sure you want to grant Pro access to this user?')) {
      console.log('❌ User cancelled the confirmation dialog')
      return
    }

    console.log('✅ User confirmed, proceeding with Pro access grant')

    try {
      console.log('📝 Starting Pro access grant for user:', userId)
      console.log('🔍 Current user (admin):', user?.email, user?.id)
      console.log('🔍 Current profile (admin):', profile?.username, profile?.is_admin)

      // First, let's check if the user exists
      const { data: targetUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        console.error('❌ Error fetching target user:', fetchError)
        throw new Error(`Failed to find user: ${fetchError.message}`)
      }

      console.log('👤 Target user found:', targetUser)
      console.log('📊 Current plan:', targetUser.plan_type, 'Status:', targetUser.subscription_status)

      // Perform the update
      console.log('🔄 Updating user plan to Pro...')
      const { data, error } = await supabase
        .from('profiles')
        .update({
          plan_type: 'pro',
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (error) {
        console.error('❌ Supabase update error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (!data || data.length === 0) {
        console.error('❌ No data returned from update operation')
        throw new Error('Update operation returned no data. User may not exist or you may not have permission.')
      }

      console.log('✅ Pro access granted successfully!')
      console.log('📊 Updated user data:', data[0])
      console.log('📊 New plan:', data[0].plan_type, 'New status:', data[0].subscription_status)

      alert(`✅ Pro access granted successfully to ${targetUser.display_name || targetUser.username}!`)

      console.log('🔄 Reloading users list...')
      await loadUsers()
      console.log('✅ Users list reloaded')

    } catch (err: any) {
      console.error('❌ Error granting Pro access:', err)
      console.error('❌ Error stack:', err.stack)

      let errorMessage = 'Unknown error occurred'

      if (err.message) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }

      console.error('❌ Final error message:', errorMessage)
      alert(`❌ Failed to grant Pro access: ${errorMessage}`)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredWhitelist = whitelist.filter(entry =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'users' as const, name: 'Users', icon: Users, count: users.length },
    { id: 'whitelist' as const, name: 'Whitelist', icon: UserPlus, count: whitelist.length }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and whitelist settings</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">All Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Products
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.user_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">
                                      {user.display_name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                                    <span>{user.display_name}</span>
                                    {user.is_admin && <Shield className="w-4 h-4 text-red-500" />}
                                  </div>
                                  <div className="text-sm text-gray-500">@{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.plan_type === 'pro' || user.plan_type === 'unlimited'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.plan_type === 'unlimited' ? 'Unlimited' :
                                 user.plan_type === 'pro' ? 'Pro' : 'Free'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.product_count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => toggleUserAdmin(user.user_id, user.is_admin)}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                  user.is_admin
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              {user.plan_type === 'free' && (
                                <button
                                  onClick={() => {
                                    console.log('🖱️ Grant Pro button clicked for user:', user.user_id, user.username)
                                    grantProAccess(user.user_id)
                                  }}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700 hover:bg-green-200"
                                >
                                  <Crown className="w-3 h-3 mr-1" />
                                  Grant Pro
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Whitelist Tab */}
            {activeTab === 'whitelist' && (
              <div>
                {/* Add to Whitelist */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Email to Whitelist</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="email"
                        placeholder="Enter email address..."
                        value={newWhitelistEmail}
                        onChange={(e) => setNewWhitelistEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && addToWhitelist()}
                      />
                    </div>
                    <button
                      onClick={addToWhitelist}
                      disabled={addingToWhitelist || !newWhitelistEmail.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{addingToWhitelist ? 'Adding...' : 'Add'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Users with whitelisted emails will automatically get Pro access when they sign up.
                  </p>
                </div>

                {/* Whitelist Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Whitelisted Emails</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Granted By
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWhitelist.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{entry.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entry.granted_by_admin || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {entry.is_active ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => removeFromWhitelist(entry.id)}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredWhitelist.length === 0 && (
                      <div className="text-center py-12">
                        <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No whitelisted emails</h3>
                        <p className="text-gray-600">Add emails to the whitelist to grant automatic Pro access.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
