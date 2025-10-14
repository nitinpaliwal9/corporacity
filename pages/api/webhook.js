// pages/api/webhook.js - Webhook endpoint for external integrations
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Webhook-Signature')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { company_id, event_type, data: eventData } = req.body

    if (!company_id || !event_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: company_id and event_type are required' 
      })
    }

    // Verify webhook signature (optional security)
    const signature = req.headers['x-webhook-signature']
    if (signature && !verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid webhook signature' })
    }

    // Process webhook based on event type
    let result
    switch (event_type) {
      case 'status_update':
        result = await handleStatusUpdateWebhook(company_id, eventData)
        break
      case 'member_joined':
        result = await handleMemberJoinedWebhook(company_id, eventData)
        break
      case 'member_left':
        result = await handleMemberLeftWebhook(company_id, eventData)
        break
      case 'company_created':
        result = await handleCompanyCreatedWebhook(company_id, eventData)
        break
      default:
        return res.status(400).json({ error: `Unsupported event type: ${event_type}` })
    }

    // Log webhook event
    await logWebhookEvent(company_id, event_type, eventData, 'success')

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      result
    })

  } catch (err) {
    console.error('Webhook API error:', err)
    
    // Log failed webhook event
    if (req.body.company_id && req.body.event_type) {
      await logWebhookEvent(req.body.company_id, req.body.event_type, req.body.data, 'error', err.message)
    }

    return res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message 
    })
  }
}

function verifyWebhookSignature(payload, signature) {
  const webhookSecret = process.env.WEBHOOK_SECRET
  if (!webhookSecret) {
    return true // Skip verification if no secret is configured
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

async function handleStatusUpdateWebhook(companyId, data) {
  // Example: Send to Slack
  if (data.slack_webhook_url) {
    const slackMessage = {
      text: `Status Update: ${data.user_name} is now ${data.status_type}`,
      attachments: [{
        color: getStatusColor(data.status_type),
        fields: [
          { title: 'User', value: data.user_name, short: true },
          { title: 'Status', value: data.status_type, short: true },
          { title: 'Time', value: new Date(data.timestamp).toLocaleString(), short: true }
        ]
      }]
    }

    try {
      const response = await fetch(data.slack_webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      })

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Slack webhook error:', error)
      throw error
    }
  }

  // Example: Send to Microsoft Teams
  if (data.teams_webhook_url) {
    const teamsMessage = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: getStatusColor(data.status_type),
      summary: 'Status Update',
      sections: [{
        activityTitle: 'Status Update',
        activitySubtitle: `${data.user_name} is now ${data.status_type}`,
        facts: [
          { name: 'User', value: data.user_name },
          { name: 'Status', value: data.status_type },
          { name: 'Time', value: new Date(data.timestamp).toLocaleString() }
        ]
      }]
    }

    try {
      const response = await fetch(data.teams_webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamsMessage)
      })

      if (!response.ok) {
        throw new Error(`Teams webhook failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Teams webhook error:', error)
      throw error
    }
  }

  return { message: 'Status update webhook processed' }
}

async function handleMemberJoinedWebhook(companyId, data) {
  // Example: Send welcome email or notification
  if (data.email_notification) {
    // Here you would integrate with an email service like SendGrid, Mailgun, etc.
    console.log(`Sending welcome email to ${data.user_email}`)
  }

  return { message: 'Member joined webhook processed' }
}

async function handleMemberLeftWebhook(companyId, data) {
  // Example: Send notification to admin
  console.log(`Member ${data.user_name} left the company`)
  
  return { message: 'Member left webhook processed' }
}

async function handleCompanyCreatedWebhook(companyId, data) {
  // Example: Send setup instructions or welcome message
  console.log(`New company created: ${data.company_name}`)
  
  return { message: 'Company created webhook processed' }
}

function getStatusColor(statusType) {
  const colors = {
    present: '#28a745',
    late: '#ffc107',
    leave: '#dc3545',
    visit: '#17a2b8'
  }
  return colors[statusType] || '#6c757d'
}

async function logWebhookEvent(companyId, eventType, eventData, status, errorMessage = null) {
  try {
    await supabaseAdmin
      .from('corp_webhook_logs')
      .insert([{
        company_id: companyId,
        event_type: eventType,
        event_data: eventData,
        status,
        error_message: errorMessage,
        created_at: new Date().toISOString()
      }])
  } catch (err) {
    console.error('Failed to log webhook event:', err)
  }
}
