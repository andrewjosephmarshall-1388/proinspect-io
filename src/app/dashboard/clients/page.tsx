export default function ClientsPage() {
  const clients = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(512) 555-1234', inspections: 3 },
    { id: '2', name: 'Mike Peters', email: 'mike@email.com', phone: '(512) 555-2345', inspections: 1 },
    { id: '3', name: 'Emily Davis', email: 'emily@email.com', phone: '(512) 555-3456', inspections: 2 },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Clients</h1>
      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <table style={{ width: '100%' }}>
          <thead><tr><th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Name</th><th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Email</th><th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Phone</th><th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Inspections</th></tr></thead>
          <tbody>
            {clients.map((c) => (<tr key={c.id}><td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 500 }}>{c.name}</td><td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.email}</td><td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.phone}</td><td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{c.inspections}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
