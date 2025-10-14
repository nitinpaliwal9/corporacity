// pages/integrations.js - Integrations and API Management
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([])
  const [apiKeys, setApiKeys] = useState([])
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('webhooks')
  const [showAddWebhook, setShowAddWebhook] = useState(false)
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [],
    secret: ''
  })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) {
          router.push('/')
          return
        }
        setUser(currentUser)

        // Check if user is company owner
        const { data: membership } = await supabase
          .from('corp_memberships')
          .select(`
            company_id,
            role,
            corp_companies!inner(id, name, code, owner_id)
          `)
          .eq('user_id', currentUser.id)
          .single()

        if (!membership || membership.role !== 'owner') {
          setError('Access denied. Only company owners can manage integrations.')
          return
        }

        setCompany(membership.corp_companies)

        // Load integrations data
        await loadIntegrations(membership.company_id)
      } catch (err) {
        console.error('Error loading integrations data:', err)
        setError('Failed to load integrations data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const loadIntegrations = async (companyId) => {
    try {
      // Load webhooks
      const { data: webhooks } = await supabase
        .from('corp_webhooks')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      // Load API keys
      const { data: keys } = await supabase
        .from('corp_api_keys')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      setIntegrations(webhooks || [])
      setApiKeys(keys || [])
    } catch (err) {
      console.error('Error loading integrations:', err)
    }
  }

  const addWebhook = async () => {
    if (!company || !webhookForm.name || !webhookForm.url) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const { error } = await supabase
        .from('corp_webhooks')
        .insert([{
          company_id: company.id,
          name: webhookForm.name,
          url: webhookForm.url,
          events: webhookForm.events,
          secret: webhookForm.secret || null,
          is_active: true
        }])

      if (error) {
        console.error('Error adding webhook:', error)
        setError('Failed to add webhook')
        return
      }

      setShowAddWebhook(false)
      setWebhookForm({ name: '', url: '', events: [], secret: '' })
      await loadIntegrations(company.id)
    } catch (err) {
      console.error('Error adding webhook:', err)
      setError('Failed to add webhook')
    }
  }

  const toggleWebhook = async (webhookId, isActive) => {
    try {
      const { error } = await supabase
        .from('corp_webhooks')
        .update({ is_active: !isActive })
        .eq('id', webhookId)

      if (error) {
        console.error('Error toggling webhook:', error)
        setError('Failed to update webhook')
        return
      }

      await loadIntegrations(company.id)
    } catch (err) {
      console.error('Error toggling webhook:', err)
      setError('Failed to update webhook')
    }
  }

  const deleteWebhook = async (webhookId) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('corp_webhooks')
        .delete()
        .eq('id', webhookId)

      if (error) {
        console.error('Error deleting webhook:', error)
        setError('Failed to delete webhook')
        return
      }

      await loadIntegrations(company.id)
    } catch (err) {
      console.error('Error deleting webhook:', err)
      setError('Failed to delete webhook')
    }
  }

  const generateApiKey = async () => {
    try {
      const keyName = prompt('Enter a name for this API key:')
      if (!keyName) return

      const apiKey = `ck_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const { error } = await supabase
        .from('corp_api_keys')
        .insert([{
          company_id: company.id,
          name: keyName,
          key: apiKey,
          is_active: true
        }])

      if (error) {
        console.error('Error generating API key:', error)
        setError('Failed to generate API key')
        return
      }

      await loadIntegrations(company.id)
      alert(`API Key generated: ${apiKey}\n\nPlease save this key securely. You won't be able to see it again.`)
    } catch (err) {
      console.error('Error generating API key:', err)
      setError('Failed to generate API key')
    }
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'success' : 'secondary'} size="small">
        {isActive ? '✅ Active' : '⏸️ Inactive'}
      </Badge>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Alert variant="error">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Access Denied</h3>
              <p className="text-sm">{error}</p>
              <Button
                onClick={() => router.push('/ceo')}
                className="mt-4"
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🔗 Integrations & API
                </h1>
                <p className="text-gray-600">
                  {company?.name} • Connect with external services
                </p>
              </div>
              <Button
                onClick={() => router.push('/ceo')}
                variant="outline"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'webhooks', label: 'Webhooks', icon: '🔗' },
                  { id: 'api', label: 'API Keys', icon: '🔑' },
                  { id: 'docs', label: 'API Documentation', icon: '📚' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Webhooks</h2>
                <Button
                  onClick={() => setShowAddWebhook(true)}
                  variant="primary"
                >
                  ➕ Add Webhook
                </Button>
              </div>

              {integrations.length === 0 ? (
                <Card>
                  <Card.Content>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔗</div>
                      <p className="text-gray-500">No webhooks configured</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Webhooks allow you to receive real-time notifications when events occur in your company.
                      </p>
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <div className="space-y-4">
                  {integrations.map((webhook) => (
                    <Card key={webhook.id}>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {webhook.name}
                              </h3>
                              {getStatusBadge(webhook.is_active)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {webhook.url}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Events: {webhook.events?.join(', ') || 'All'}</span>
                              <span>Created: {new Date(webhook.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => toggleWebhook(webhook.id, webhook.is_active)}
                              variant="outline"
                              size="small"
                            >
                              {webhook.is_active ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              onClick={() => deleteWebhook(webhook.id)}
                              variant="error"
                              size="small"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Webhook Modal */}
              {showAddWebhook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <Card.Header>
                      <Card.Title>Add Webhook</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <Input
                            value={webhookForm.name}
                            onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                            placeholder="e.g., Slack Notifications"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Webhook URL
                          </label>
                          <Input
                            value={webhookForm.url}
                            onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                            placeholder="https://hooks.slack.com/services/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Events (optional)
                          </label>
                          <div className="space-y-2">
                            {['status_update', 'member_joined', 'member_left', 'company_created'].map((event) => (
                              <label key={event} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={webhookForm.events.includes(event)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setWebhookForm({ ...webhookForm, events: [...webhookForm.events, event] })
                                    } else {
                                      setWebhookForm({ ...webhookForm, events: webhookForm.events.filter(ev => ev !== event) })
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">{event.replace('_', ' ')}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret (optional)
                          </label>
                          <Input
                            value={webhookForm.secret}
                            onChange={(e) => setWebhookForm({ ...webhookForm, secret: e.target.value })}
                            placeholder="Webhook secret for verification"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button
                            onClick={() => setShowAddWebhook(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={addWebhook}
                            variant="primary"
                          >
                            Add Webhook
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                <Button
                  onClick={generateApiKey}
                  variant="primary"
                >
                  🔑 Generate API Key
                </Button>
              </div>

              {apiKeys.length === 0 ? (
                <Card>
                  <Card.Content>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔑</div>
                      <p className="text-gray-500">No API keys generated</p>
                      <p className="text-sm text-gray-400 mt-2">
                        API keys allow you to access Corporacity data programmatically.
                      </p>
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <Card key={key.id}>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {key.name}
                              </h3>
                              {getStatusBadge(key.is_active)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 font-mono">
                              {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 8)}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                              <span>Last used: {key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="small"
                            >
                              Regenerate
                            </Button>
                            <Button
                              variant="error"
                              size="small"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* API Documentation Tab */}
          {activeTab === 'docs' && (
            <motion.div variants={itemVariants}>
              <Card>
                <Card.Header>
                  <Card.Title>API Documentation</Card.Title>
                  <p className="text-sm text-gray-600 mt-2">
                    Learn how to integrate with Corporacity using our REST API
                  </p>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api
                      </code>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Include your API key in the Authorization header:
                      </p>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Endpoints</h3>
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="success" size="small">GET</Badge>
                            <code className="text-sm">/export?company_id=xxx&type=attendance&format=json</code>
                          </div>
                          <p className="text-sm text-gray-600">Export company data in JSON or CSV format</p>
                        </div>
                        <div className="border border-gray-200 rounded p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="primary" size="small">POST</Badge>
                            <code className="text-sm">/webhook</code>
                          </div>
                          <p className="text-sm text-gray-600">Send webhook events to external services</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Events</h3>
                      <div className="space-y-2">
                        {[
                          { event: 'status_update', description: 'When a user updates their status' },
                          { event: 'member_joined', description: 'When a new member joins the company' },
                          { event: 'member_left', description: 'When a member leaves the company' },
                          { event: 'company_created', description: 'When a new company is created' }
                        ].map((item) => (
                          <div key={item.event} className="flex items-center space-x-3">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{item.event}</code>
                            <span className="text-sm text-gray-600">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
