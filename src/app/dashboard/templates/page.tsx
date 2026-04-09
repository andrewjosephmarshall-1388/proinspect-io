'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText, Copy, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const DEFAULT_TEMPLATES = [
  {
    name: 'General Home Inspection',
    inspection_type: 'standard',
    description: 'Complete structural and systems inspection for residential properties',
    is_default: true,
    items: [
      { category: 'Exterior', item_text: 'Siding/Cladding condition' },
      { category: 'Exterior', item_text: 'Exterior walls - visible damage' },
      { category: 'Exterior', item_text: 'Foundation - visible cracks' },
      { category: 'Roofing', item_text: 'Roof covering material' },
      { category: 'Roofing', item_text: 'Roof drainage system' },
      { category: 'Roofing', item_text: 'Attic ventilation' },
      { category: 'Electrical', item_text: 'Service entrance conductors' },
      { category: 'Electrical', item_text: 'GFCI protection' },
      { category: 'Plumbing', item_text: 'Water supply piping' },
      { category: 'Plumbing', item_text: 'Water heater' },
      { category: 'HVAC', item_text: 'Heating system' },
      { category: 'HVAC', item_text: 'Cooling system' },
      { category: 'Interior', item_text: 'Windows and doors' },
      { category: 'Interior', item_text: 'Stairways and railings' },
      { category: 'Kitchen', item_text: 'Appliances' },
      { category: 'Kitchen', item_text: 'Cabinets and countertops' },
      { category: 'Bathrooms', item_text: 'Toilets and bidets' },
      { category: 'Bathrooms', item_text: 'Shower/tub enclosure' },
    ]
  },
  {
    name: 'HVAC System Inspection',
    inspection_type: 'hvac',
    description: 'Heating, ventilation, and air conditioning system inspection',
    is_default: true,
    items: [
      { category: 'Heating', item_text: 'Fuel supply system' },
      { category: 'Heating', item_text: 'Heat exchanger' },
      { category: 'Heating', item_text: 'Blower motor operation' },
      { category: 'Cooling', item_text: 'Refrigerant lines' },
      { category: 'Cooling', item_text: 'Condenser coil condition' },
      { category: 'Cooling', item_text: 'Thermostat operation' },
      { category: 'Ventilation', item_text: 'Air handler' },
      { category: 'Ventilation', item_text: 'Ductwork condition' },
    ]
  },
  {
    name: '4-Point Inspection',
    inspection_type: '4_point',
    description: 'Insurance inspection covering roof, electrical, plumbing, and HVAC',
    is_default: true,
    items: [
      { category: 'Roofing', item_text: 'Roof covering age and condition' },
      { category: 'Roofing', item_text: 'Roof structure' },
      { category: 'Electrical', item_text: 'Main electrical panel' },
      { category: 'Electrical', item_text: 'Wiring type' },
      { category: 'Plumbing', item_text: 'Water supply piping material' },
      { category: 'Plumbing', item_text: 'Water heater age' },
      { category: 'HVAC', item_text: 'HVAC system age' },
      { category: 'HVAC', item_text: 'HVAC system condition' },
    ]
  },
  {
    name: 'Wind Mitigation Inspection',
    inspection_type: 'wind_mitigation',
    description: 'Inspection for wind resistance features to qualify for insurance discounts',
    is_default: true,
    items: [
      { category: 'Roof', item_text: 'Roof shape and slope' },
      { category: 'Roof', item_text: 'Roof covering material' },
      { category: 'Roof', item_text: 'Roof deck attachment' },
      { category: 'Roof', item_text: 'Roof-to-wall connection' },
      { category: 'Opening Protection', item_text: 'Windows and doors' },
      { category: 'Opening Protection', item_text: 'Garage doors' },
      { category: 'Building Code', item_text: 'Year of construction' },
    ]
  },
  {
    name: 'Termite/WDO Inspection',
    inspection_type: 'termite',
    description: 'Wood-destroying organism inspection for real estate transactions',
    is_default: true,
    items: [
      { category: 'Structure', item_text: 'Foundation - visible pest damage' },
      { category: 'Structure', item_text: 'Wood framing' },
      { category: 'Structure', item_text: 'Support beams' },
      { category: 'Exterior', item_text: 'Siding condition' },
      { category: 'Exterior', item_text: 'Fascia and trim' },
      { category: 'Interior', item_text: 'Flooring substructure' },
      { category: 'Interior', item_text: 'Walls and ceilings' },
    ]
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ name: '', inspection_type: '', description: '' })
  const supabase = createClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('inspection_templates')
      .select('*')
      .or(`user_id.eq.${user.id},is_default.eq.true`)
      .order('created_at', { ascending: false })

    if (data) setTemplates(data)
    setLoading(false)
  }

  async function createTemplate() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: template } = await supabase
      .from('inspection_templates')
      .insert({
        user_id: user.id,
        name: newTemplate.name,
        inspection_type: newTemplate.inspection_type,
        description: newTemplate.description,
        is_default: false
      })
      .select()
      .single()

    if (template) {
      setTemplates([template, ...templates])
      setShowCreate(false)
      setNewTemplate({ name: '', inspection_type: '', description: '' })
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return
    
    await supabase.from('inspection_templates').delete().eq('id', id)
    setTemplates(templates.filter(t => t.id !== id))
  }

  async function duplicateTemplate(template: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: newTemplate } = await supabase
      .from('inspection_templates')
      .insert({
        user_id: user.id,
        name: `${template.name} (Copy)`,
        inspection_type: template.inspection_type,
        description: template.description,
        is_default: false
      })
      .select()
      .single()

    if (newTemplate) {
      setTemplates([newTemplate, ...templates])
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Inspection Templates</h1>
        <button 
          onClick={() => setShowCreate(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}
        >
          <Plus size={18} />New Template
        </button>
      </div>

      {showCreate && (
        <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Create New Template</h3>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
              style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '100%' }}
            />
            <select
              value={newTemplate.inspection_type}
              onChange={e => setNewTemplate({ ...newTemplate, inspection_type: e.target.value })}
              style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '100%' }}
            >
              <option value="">Select Type</option>
              <option value="standard">Standard Home</option>
              <option value="hvac">HVAC System</option>
              <option value="4_point">4-Point</option>
              <option value="wind_mitigation">Wind Mitigation</option>
              <option value="termite">Termite/WDO</option>
              <option value="commercial">Commercial</option>
              <option value="roof">Roof Inspection</option>
            </select>
            <textarea
              placeholder="Description"
              value={newTemplate.description}
              onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
              rows={3}
              style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={createTemplate}
                style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}
              >
                Create Template
              </button>
              <button 
                onClick={() => setShowCreate(false)}
                style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {templates.map(template => (
          <div key={template.id} style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{template.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {template.description || 'No description'}
                </p>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: '#f3f4f6', color: '#6b7280' }}>
                  {template.inspection_type || 'custom'}
                </span>
                {template.is_default && (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: '#ecfdf5', color: '#10b981', marginLeft: '0.5rem' }}>
                    Default
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
              <Link 
                href={`/dashboard/templates/${template.id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}
              >
                <Edit size={14} />Edit
              </Link>
              <button 
                onClick={() => duplicateTemplate(template)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Copy size={14} />Duplicate
              </button>
              {!template.is_default && (
                <button 
                  onClick={() => deleteTemplate(template.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
                >
                  <Trash2 size={14} />Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No templates yet. Create your first template to get started.</p>
        </div>
      )}
    </div>
  )
}