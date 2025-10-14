// Health check API endpoint
import { createClient } from '@supabase/supabase-js'
import { apiResponse } from '../../lib/apiSecurity'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 405, 'Method not allowed'))
  }

  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      realtime: 'unknown',
      auth: 'unknown'
    }
  }

  try {
    // Check database connection
    const { data, error } = await supabaseAdmin
      .from('corp_profiles')
      .select('count')
      .limit(1)

    if (error) {
      healthCheck.checks.database = 'unhealthy'
      healthCheck.status = 'degraded'
    } else {
      healthCheck.checks.database = 'healthy'
    }

    // Check auth service
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.getUser()
      if (authError && authError.message !== 'Invalid JWT') {
        healthCheck.checks.auth = 'unhealthy'
        healthCheck.status = 'degraded'
      } else {
        healthCheck.checks.auth = 'healthy'
      }
    } catch (authErr) {
      healthCheck.checks.auth = 'unhealthy'
      healthCheck.status = 'degraded'
    }

    // Check realtime (basic check)
    try {
      const channel = supabaseAdmin.channel('health-check')
      channel.subscribe()
      healthCheck.checks.realtime = 'healthy'
      channel.unsubscribe()
    } catch (realtimeErr) {
      healthCheck.checks.realtime = 'unhealthy'
      healthCheck.status = 'degraded'
    }

    // Determine overall status
    const allHealthy = Object.values(healthCheck.checks).every(check => check === 'healthy')
    if (!allHealthy) {
      healthCheck.status = 'degraded'
    }

    const statusCode = healthCheck.status === 'healthy' ? 200 : 503
    return res.status(statusCode).json(apiResponse(healthCheck, statusCode, 'Health check completed'))

  } catch (error) {
    healthCheck.status = 'unhealthy'
    healthCheck.error = error.message
    return res.status(503).json(apiResponse(healthCheck, 503, 'Health check failed'))
  }
}
