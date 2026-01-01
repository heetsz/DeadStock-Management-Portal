"use client"

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Lock, Mail } from 'lucide-react'

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated, don't allow visiting login
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) router.replace('/')
    })
    return () => {
      mounted = false
    }
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const trimmed = email.trim()
      const isSpitEmail = /@spit\.ac\.in$/i.test(trimmed)
      if (!isSpitEmail) {
        toast.error('Use SPIT email only', { description: 'Please sign in with your @spit.ac.in email.' })
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Logged in successfully')
      const redirect = searchParams.get('redirectedFrom') || '/'
      router.replace(redirect)
    } catch (err: any) {
      toast.error('Login failed', { description: err?.message ?? 'Check credentials and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex min-h-screen">
        {/* Form Section - Left Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 order-1 lg:order-1 animate-slideInLeft">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 bg-indigo-50 rounded-xl p-1">
                  <Image src="/image.png" alt="SPIT CE Logo" fill sizes="64px" className="object-contain" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Deadstock Portal</h1>
              <p className="text-sm text-gray-600">SPIT CE Department</p>
            </div>

            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-3xl font-bold text-gray-900">Login</CardTitle>
                <p className="text-sm text-gray-600">Sign in with your SPIT email to continue</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                        placeholder="name@spit.ac.in"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <p className="text-xs text-indigo-700 font-medium">
                      ✓ Use your @spit.ac.in email address to sign in
                    </p>
                  </div>

                  {/* Sign In Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              © 2026 SPIT Computer Engineering. All rights reserved.
            </p>
          </div>
        </div>

        {/* Hero Section - Right Side */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative overflow-hidden order-2 lg:order-2 animate-slideInRight">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 opacity-95" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute -bottom-8 right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
          </div>
          <div className="relative z-10 text-center text-white max-w-md">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image src="/image.png" alt="SPIT CE Logo" fill sizes="96px" className="object-contain drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">Deadstock Management Portal</h1>
            <p className="text-indigo-100 text-lg mb-2">SPIT CE Department</p>
            <div className="h-1 w-16 bg-indigo-300 mx-auto rounded-full mb-6" />
            <p className="text-indigo-100 leading-relaxed">
              Efficiently manage and track your deadstock assets. Sign in with your SPIT account to access the portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-gray-600">Loading...</div></div>}>
      <LoginFormInner />
    </Suspense>
  )
}
