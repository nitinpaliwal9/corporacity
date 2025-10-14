// Debug page to test company lookup
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

export default function DebugCompany() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testCompanyLookup = async () => {
    if (!code.trim()) return
    
    setLoading(true)
    setResult(null)
    setError(null)
    
    try {
      console.log('Testing company lookup with code:', code.trim().toUpperCase())
      
      const { data: company, error: companyError } = await supabase
        .from('corp_companies')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .maybeSingle()

      console.log('Company lookup result:', { company, error: companyError })
      
      if (companyError) {
        setError(`Database error: ${companyError.message}`)
      } else if (company) {
        setResult({ type: 'success', data: company })
      } else {
        setResult({ type: 'not_found', data: null })
      }
    } catch (err) {
      console.error('Test error:', err)
      setError(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAllCompanies = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    
    try {
      console.log('Fetching all companies...')
      
      const { data: companies, error: companiesError } = await supabase
        .from('corp_companies')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('All companies result:', { companies, error: companiesError })
      
      if (companiesError) {
        setError(`Database error: ${companiesError.message}`)
      } else {
        setResult({ type: 'all_companies', data: companies })
      }
    } catch (err) {
      console.error('Test error:', err)
      setError(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Company Lookup Debug
            </h1>
            <p className="text-lg text-gray-600">
              Test company lookup functionality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Single Company */}
            <Card>
              <Card.Header>
                <Card.Title>Test Single Company</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter company code"
                    className="w-full"
                  />
                  <Button
                    onClick={testCompanyLookup}
                    loading={loading}
                    disabled={!code.trim()}
                    className="w-full"
                  >
                    Test Lookup
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Test All Companies */}
            <Card>
              <Card.Header>
                <Card.Title>Test All Companies</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Fetch all companies to see what's in the database
                  </p>
                  <Button
                    onClick={testAllCompanies}
                    loading={loading}
                    variant="outline"
                    className="w-full"
                  >
                    Fetch All Companies
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Results */}
          {(result || error) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <Card.Header>
                  <Card.Title>Results</Card.Title>
                </Card.Header>
                <Card.Content>
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {result && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        {result.type === 'success' && 'Company Found!'}
                        {result.type === 'not_found' && 'Company Not Found'}
                        {result.type === 'all_companies' && 'All Companies'}
                      </h4>
                      <pre className="text-sm text-green-700 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
