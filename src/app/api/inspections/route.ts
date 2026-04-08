import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Get the actual logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { propertyAddress, propertyCity, propertyState, propertyZip, inspectionType, clientName, clientEmail } = body

    // First, get or create the client for this user
    let clientId = ''
    
    // Check if client exists for this user
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', clientEmail)
      .eq('user_id', user.id)
      .single()
    
    if (existingClient) {
      clientId = existingClient.id
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: clientName,
          email: clientEmail
        })
        .select()
        .single()
      
      if (clientError) {
        console.error('Client error:', clientError)
      }
      
      if (newClient) {
        clientId = newClient.id
      }
    }

    // Create the inspection with the actual user's ID
    const { data: inspection, error } = await supabase
      .from('inspections')
      .insert({
        user_id: user.id,
        client_id: clientId,
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
  const supabase = await createClient()
  
  // Get the actual logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  // Fetch only the logged-in user's inspections
  const { data, error } = await supabase
    .from('inspections')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}