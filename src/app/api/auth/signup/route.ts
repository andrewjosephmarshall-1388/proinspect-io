import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password,
        companyName: companyName || '',
      })
      .select()
      .single()

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create account' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: data.id, email: data.email, name: data.name } 
    })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}