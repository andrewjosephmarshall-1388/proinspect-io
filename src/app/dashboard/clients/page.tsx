import { createClient } from '@/utils/supabase/server'

export default async function ClientsPage() {
  const supabase = await createClient()
  
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Clients</h1>
      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Address</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.email}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.phone || '-'}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.address || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!clients || clients.length === 0) && (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No clients yet.</p>
        )}
      </div>
    </div>
  )
}