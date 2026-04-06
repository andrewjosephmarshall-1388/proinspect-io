import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyAddress, propertyCity, propertyState, propertyZip, inspectionType, clientName, clientEmail } = body

    // For demo, use a demo user. In production, get userId from session
    const userId = 'demo-user-id'
    
    // First, get or create the client
    let clientId = ''
    
    // Check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', clientEmail)
      .single()
    
    if (existingClient) {
      clientId = existingClient.id
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: userId,
          name: clientName,
          email: clientEmail
        })
        .select()
        .single()
      
      if (clientError) {
        console.error('Client error:', clientError)
        // Continue anyway
      }
      
      if (newClient) {
        clientId = newClient.id
      }
    }

    // Create the inspection
    const { data: inspection, error } = await supabase
      .from('inspections')
      .insert({
        user_id: userId,
        client_id: clientId || 'demo-client-id',
        property_address: propertyAddress,
        property_city: propertyCity,
        property_state: propertyState,
        property_zip: propertyZip,
        inspection_type: inspectionType,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) {
      console.error('Inspection error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: inspection })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Fetch inspections for demo user
  const { data, error } = await supabase
    .from('inspections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}