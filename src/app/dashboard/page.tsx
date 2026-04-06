import Link from 'next/link'
import { FileText, DollarSign, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react'

// Demo data
const stats = [
  { label: 'Total Inspections', value: '47', icon: FileText, change: '+12%', color: 'primary' },
  { label: 'Revenue (MTD)', value: '$8,450', icon: DollarSign, change: '+8%', color: 'success' },
  { label: 'Pending Reports', value: '3', icon: Clock, change: '-2', color: 'warning' },
  { label: 'This Month', value: '14', icon: TrendingUp, change: '+25%', color: 'primary' },
]

const recentInspections = [
  { id: '1', address: '123 Oak Street, Austin, TX', type: 'Standard Home', client: 'Sarah Johnson', status: 'completed', date: '2026-04-05' },
  { id: '2', address: '456 Maple Ave, Austin, TX', type: '4-Point', client: 'Mike Peters', status: 'in_progress', date: '2026-04-05' },
  { id: '3', address: '789 Pine Road, Austin, TX', type: 'HVAC', client: 'Emily Davis', status: 'scheduled', date: '2026-04-06' },
]

const inspectionTypes = [
  'Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa'
]

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" data-color={stat.color}>
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <span className="stat-change">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent Inspections</h2>
            <Link href="/dashboard/inspections" className="view-all">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="inspections-list">
            {recentInspections.map((inspection) => (
              <Link key={inspection.id} href={`/dashboard/inspections/${inspection.id}`} className="inspection-item">
                <div className="inspection-info">
                  <span className="inspection-address">{inspection.address}</span>
                  <span className="inspection-meta">{inspection.type} • {inspection.client}</span>
                </div>
                <div className="inspection-status" data-status={inspection.status}>
                  {inspection.status === 'completed' && 'Completed'}
                  {inspection.status === 'in_progress' && 'In Progress'}
                  {inspection.status === 'scheduled' && 'Scheduled'}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link href="/dashboard/inspections/new" className="action-btn">
              <Plus size={20} />
              <span>New Inspection</span>
            </Link>
            <Link href="/dashboard/clients/new" className="action-btn">
              <Plus size={20} />
              <span>Add Client</span>
            </Link>
            <Link href="/dashboard/reports" className="action-btn">
              <FileText size={20} />
              <span>View Reports</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2>Inspection Types Supported</h2>
        </div>
        <div className="types-grid">
          {inspectionTypes.map((type) => (
            <div key={type} className="type-badge">{type}</div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--white); padding: 1.25rem; border-radius: 0.75rem; box-shadow: var(--shadow); display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; background: #EFF6FF; color: var(--primary); }
        .stat-icon[data-color="success"] { background: #ECFDF5; color: var(--success); }
        .stat-icon[data-color="warning"] { background: #FFFBEB; color: var(--warning); }
        .stat-content { flex: 1; }
        .stat-label { display: block; font-size: 0.875rem; color: var(--gray-500); }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 600; color: var(--gray-900); }
        .stat-change { font-size: 0.875rem; color: var(--success); font-weight: 500; }
        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .card-header h2 { font-size: 1.125rem; font-weight: 600; }
        .view-all { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--primary); font-weight: 500; }
        .inspections-list { display: flex; flex-direction: column; }
        .inspection-item { display: flex; justify-content: space-between; align-items: center; padding: 0.875rem; border-radius: 0.5rem; transition: background: 0.15s; border-bottom: 1px solid var(--gray-100); }
        .inspection-item:hover { background: var(--gray-50); }
        .inspection-item:last-child { border-bottom: none; }
        .inspection-address { display: block; font-weight: 500; color: var(--gray-800); }
        .inspection-meta { display: block; font-size: 0.875rem; color: var(--gray-500); }
        .inspection-status { font-size: 0.75rem; font-weight: 500; padding: 0.25rem 0.75rem; border-radius: 1rem; }
        .inspection-status[data-status="completed"] { background: #ECFDF5; color: var(--success); }
        .inspection-status[data-status="in_progress"] { background: #EFF6FF; color: var(--primary); }
        .inspection-status[data-status="scheduled"] { background: #FFFBEB; color: var(--warning); }
        .quick-actions { display: flex; flex-direction: column; gap: 0.75rem; }
        .action-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; border-radius: 0.5rem; background: var(--gray-50); color: var(--gray-700); font-weight: 500; transition: all 0.15s; }
        .action-btn:hover { background: var(--primary); color: white; }
        .types-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .type-badge { background: var(--gray-100); padding: 0.375rem 0.875rem; border-radius: 1rem; font-size: 0.875rem; color: var(--gray-700); }
        
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
