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
export default function SignupPage() {
  // Route disabled: signup handled by admin-created accounts
  return null
}
        options: {
