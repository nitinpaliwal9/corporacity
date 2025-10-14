// pages/api/export.js - Data export API endpoint
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { company_id, format = 'json', type = 'attendance' } = req.query

    if (!company_id) {
      return res.status(400).json({ error: 'company_id is required' })
    }

    let data = []
    let filename = 'export'
    let contentType = 'application/json'

    switch (type) {
      case 'attendance':
        data = await exportAttendanceData(company_id)
        filename = 'attendance_data'
        break
      case 'members':
        data = await exportMembersData(company_id)
        filename = 'members_data'
        break
      case 'analytics':
        data = await exportAnalyticsData(company_id)
        filename = 'analytics_data'
        break
      case 'audit':
        data = await exportAuditLogs(company_id)
        filename = 'audit_logs'
        break
      default:
        return res.status(400).json({ error: 'Invalid export type' })
    }

    if (format === 'csv') {
      const csv = convertToCSV(data)
      contentType = 'text/csv'
      filename += '.csv'
      
      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      return res.status(200).send(csv)
    } else {
      filename += '.json'
      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      return res.status(200).json(data)
    }

  } catch (err) {
    console.error('Export API error:', err)
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
}

async function exportAttendanceData(companyId) {
  const { data, error } = await supabaseAdmin
    .from('corp_statuses')
    .select(`
      *,
      corp_profiles!inner(full_name, email),
      corp_companies!inner(name)
    `)
    .eq('company_id', companyId)
    .order('timestamp', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch attendance data: ${error.message}`)
  }

  return (data || []).map(record => ({
    company_name: record.corp_companies?.name,
    user_name: record.corp_profiles?.full_name,
    user_email: record.corp_profiles?.email,
    status_type: record.type,
    timestamp: record.timestamp,
    message: record.message
  }))
}

async function exportMembersData(companyId) {
  const { data, error } = await supabaseAdmin
    .from('corp_memberships')
    .select(`
      *,
      corp_profiles!inner(full_name, email, phone),
      corp_companies!inner(name)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch members data: ${error.message}`)
  }

  return (data || []).map(record => ({
    company_name: record.corp_companies?.name,
    user_name: record.corp_profiles?.full_name,
    user_email: record.corp_profiles?.email,
    user_phone: record.corp_profiles?.phone,
    role: record.role,
    joined_at: record.created_at
  }))
}

async function exportAnalyticsData(companyId) {
  // Get attendance summary
  const { data: attendanceData } = await supabaseAdmin
    .from('corp_statuses')
    .select('type, timestamp')
    .eq('company_id', companyId)
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

  // Process analytics
  const analytics = {
    total_records: attendanceData?.length || 0,
    status_breakdown: {},
    daily_summary: {},
    export_date: new Date().toISOString()
  }

  // Calculate status breakdown
  ;(attendanceData || []).forEach(record => {
    analytics.status_breakdown[record.type] = (analytics.status_breakdown[record.type] || 0) + 1
  })

  // Calculate daily summary
  ;(attendanceData || []).forEach(record => {
    const date = new Date(record.timestamp).toISOString().split('T')[0]
    if (!analytics.daily_summary[date]) {
      analytics.daily_summary[date] = { present: 0, late: 0, leave: 0, visit: 0 }
    }
    if (analytics.daily_summary[date][record.type] !== undefined) {
      analytics.daily_summary[date][record.type]++
    }
  })

  return analytics
}

async function exportAuditLogs(companyId) {
  const { data, error } = await supabaseAdmin
    .from('corp_audit_logs')
    .select(`
      *,
      corp_profiles!inner(full_name, email)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`)
  }

  return (data || []).map(record => ({
    user_name: record.corp_profiles?.full_name,
    user_email: record.corp_profiles?.email,
    action: record.action,
    description: record.description,
    severity: record.severity,
    ip_address: record.ip_address,
    timestamp: record.created_at,
    metadata: record.metadata
  }))
}

function convertToCSV(data) {
  if (!data || data.length === 0) {
    return ''
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(',')
    )
  ].join('\n')

  return csvContent
}
