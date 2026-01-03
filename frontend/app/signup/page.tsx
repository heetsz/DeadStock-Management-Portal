"use client"

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

function deriveFullName(email: string) {
  const localPart = email.split('@')[0] // heet.shah123
  const parts = localPart.split(/[._]/) // split by . or _
  
  if (parts.length < 2) return ''

  const firstName = parts[0]
  const lastName = parts[1].replace(/\d+/g, '') // remove numbers

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  return `${capitalize(firstName)} ${capitalize(lastName)}`
}

function SignupFormInner() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
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
      const trimmedEmail = email.trim()
      const isSpitEmail = /@spit\.ac\.in$/i.test(trimmedEmail)

      if (!isSpitEmail) {
        toast.error('Use SPIT email only', {
          description: 'Please sign up with your @spit.ac.in email.',
        })
        setLoading(false)
        return
      }

      const fullName = deriveFullName(trimmedEmail)

      if (!fullName) {
        toast.error('Invalid email format', {
          description: 'Email should be like first.last@spit.ac.in',
        })
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      toast.success('Account created!', {
        description: 'Please check your email to confirm your account.',
      })

      router.replace('/login')
    } catch (err: any) {
      toast.error('Sign up failed', {
        description: err?.message ?? 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex min-h-screen">
        
        {/* Left Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-95" />
          <div className="relative z-10 text-center text-white max-w-md">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image src="/image.png" alt="SPIT CE Logo" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">Deadstock Management Portal</h1>
            <p className="text-indigo-100">SPIT CE Department</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">

            <Card className="shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Signup</CardTitle>
                <p className="text-sm text-gray-600">
                  Name will be auto-generated from your email
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={onSubmit} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@spit.ac.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm font-semibold">Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>

                <p className="text-sm text-center mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-600 font-semibold">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-gray-500 mt-6">
              © 2026 SPIT Computer Engineering
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupFormInner />
    </Suspense>
  )
}
