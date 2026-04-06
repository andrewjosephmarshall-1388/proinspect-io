'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'

const inspections = [
  { id: '1', address: '123 Oak Street, Austin, TX 78701', type: 'Standard Home', client: 'Sarah Johnson', status: 'completed', date: '2026-04-05', amount: 450 },
  { id: '2', address: '456 Maple Ave, Austin, TX 78702', type: '4-Point', client: 'Mike Peters', status: 'in_progress', date: '2026-04-05', amount: 250 },
  { id: '3', address: '789 Pine Road, Austin, TX 78703', type: 'HVAC', client: 'Emily Davis', status: 'scheduled', date: '2026-04-06', amount: 350 },
  { id: '4', address: '321 Cedar Lane, Austin, TX 78704', type: 'Termite/WDO', client: 'James Wilson', status: 'completed', date: '2026-04-04', amount: 150 },
  { id: '5', address: '654 Birch Blvd, Austin, TX 78705', type: 'Commercial', client: 'Lisa Thompson', status: 'delivered', date: '2026-04-03', amount: 1200 },
]

export default function InspectionsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="inspections-page">
      <div className="page-header">
        <h1 className="page-title">Inspections</h1>
        <Link href="/dashboard/inspections/new" className="btn btn-primary">
          <Plus size={18} />
          New Inspection
        </Link>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <Search size={18} />
          <input type="text" placeholder="Search by address or client..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="card">
        <table className="inspections-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td>
                  <Link href={`/dashboard/inspections/${inspection.id}`} className="address-link">
                    {inspection.address}
                  </Link>
                </td>
                <td>{inspection.type}</td>
                <td>{inspection.client}</td>
                <td>{inspection.date}</td>
                <td>
                  <span className="status-badge" data-status={inspection.status}>
                    {inspection.status === 'completed' && 'Completed'}
                    {inspection.status === 'in_progress' && 'In Progress'}
                    {inspection.status === 'scheduled' && 'Scheduled'}
                    {inspection.status === 'delivered' && 'Delivered'}
                  </span>
                </td>
                <td>${inspection.amount}</td>
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
        .inspections-table { width: 100%; border-collapse: collapse; }
        .inspections-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-200); }
        .inspections-table td { padding: 1rem; border-bottom: 1px solid var(--gray-100); }
        .inspections-table tbody tr:hover { background: var(--gray-50); }
        .address-link { font-weight: 500; color: var(--gray-800); }
        .address-link:hover { color: var(--primary); }
        .status-badge { display: inline-block; font-size: 0.75rem; font-weight: 500; padding: 0.25rem 0.75rem; border-radius: 1rem; }
        .status-badge[data-status="completed"] { background: #ECFDF5; color: var(--success); }
        .status-badge[data-status="in_progress"] { background: #EFF6FF; color: var(--primary); }
        .status-badge[data-status="scheduled"] { background: #FFFBEB; color: var(--warning); }
        .status-badge[data-status="delivered"] { background: #F3F4F6; color: var(--gray-600); }
        .btn-icon { background: none; border: none; color: var(--gray-400); padding: 0.5rem; }
        .btn-icon:hover { color: var(--gray-600); }
      `}</style>
    </div>
  )
}
