// Simple test endpoint to verify API routing works
export default async function handler(req, res) {
  console.log('Test approve API called:', req.method)
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  return res.status(200).json({
    success: true,
    message: 'Test API endpoint is working',
    method: req.method,
    timestamp: new Date().toISOString(),
    body: req.body
  })
}
