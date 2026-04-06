'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreVertical } from 'lucide-react'

const clients = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(512) 555-1234', inspections: 3, lastInspection: '2026-04-05' },
  { id: '2', name: 'Mike Peters', email: 'mike@email.com', phone: '(512) 555-2345', inspections: 1, lastInspection: '2026-04-05' },
  { id: '3', name: 'Emily Davis', email: 'emily@email.com', phone: '(512) 555-3456', inspections: 2, lastInspection: '2026-04-06' },
  { id: '4', name: 'James Wilson', email: 'james@email.com', phone: '(512) 555-4567', inspections: 1, lastInspection: '2026-04-04' },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <Link href="/dashboard/clients/new" className="btn btn-primary">
          <Plus size={18} />
          Add Client
        </Link>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <Search size={18} />
          <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Inspections</th>
              <th>Last Inspection</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Link href={`/dashboard/clients/${client.id}`} className="client-name">
                    {client.name}
                  </Link>
                </td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.inspections}</td>
                <td>{client.lastInspection}</td>
                <td>
                  <button className="btn-icon">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .filters-bar { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .search-input { flex: 1; max-width: 400px; display: flex; align-items: center; gap: 0.75rem; background: var(--white); border: 1px solid var(--gray-300); padding: 0.5rem 1rem; border-radius: 0.5rem; }
        .search-input input { border: none; background: none; outline: none; width: 100%; }
        .clients-table { width: 100%; border-collapse: collapse; }
        .clients-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-200); }
        .clients-table td { padding: 1rem; border-bottom: 1px solid var(--gray-100); }
        .clients-table tbody tr:hover { background: var(--gray-50); }
        .client-name { font-weight: 500; color: var(--gray-800); }
        .client-name:hover { color: var(--primary); }
        .btn-icon { background: none; border: none; color: var(--gray-400); padding: 0.5rem; }
        .btn-icon:hover { color: var(--gray-600); }
      `}</style>
    </div>
  )
}
