'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface TemplateItem {
  category: string
  item_text: string
  condition?: string
  notes?: string
}

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string
  
  const [template, setTemplate] = useState<any>(null)
  const [items, setItems] = useState<TemplateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newItem, setNewItem] = useState('')
  const [categoryItems, setCategoryItems] = useState<{ [key: string]: TemplateItem[] }>({})
  
  const supabase = createClient()

  useEffect(() => {
    if (templateId) fetchTemplate()
  }, [templateId])

  async function fetchTemplate() {
    const { data: template } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (template) {
      setTemplate(template)
      
      // Fetch existing items
      const { data: templateItems } = await supabase
        .from('inspection_items')
        .select('*')
        .eq('template_id', templateId)
        .order('sort_order')

      if (templateItems && templateItems.length > 0) {
        setItems(templateItems)
        const grouped: { [key: string]: TemplateItem[] } = {}
        templateItems.forEach((item: any) => {
          if (!grouped[item.category]) grouped[item.category] = []
          grouped[item.category].push(item)
        })
        setCategoryItems(grouped)
      }
    }
    setLoading(false)
  }

  async function saveTemplate() {
    setSaving(true)
    
    // Get existing items
    const { data: existingItems } = await supabase
      .from('inspection_items')
      .select('id')
      .eq('template_id', templateId)

    // Delete items not in current list
    if (existingItems) {
      const currentIds = items.map(i => i.id).filter(Boolean)
      const toDelete = existingItems.filter((i: any) => !currentIds.includes(i.id))
      if (toDelete.length > 0) {
        await supabase
          .from('inspection_items')
          .delete()
          .in('id', toDelete.map((i: any) => i.id))
      }
    }

    // Save items
    let sortOrder = 0
    for (const category of Object.keys(categoryItems)) {
      for (const item of categoryItems[category]) {
        if (item.id) {
          // Update existing
          await supabase
            .from('inspection_items')
            .update({
              category,
              item_text: item.item_text,
              condition: item.condition,
              notes: item.notes,
              sort_order: sortOrder++
            })
            .eq('id', item.id)
        } else {
          // Insert new
          await supabase
            .from('inspection_items')
            .insert({
              template_id: templateId,
              category,
              item_text: item.item_text,
              condition: item.condition,
              notes: item.notes,
              sort_order: sortOrder++
            })
        }
      }
    }

    setSaving(false)
    alert('Template saved!')
  }

  function addCategoryItem(category: string) {
    if (!newItem.trim()) return
    
    const newItemObj = {
      category,
      item_text: newItem,
      condition: '',
      notes: ''
    }
    
    setCategoryItems({
      ...categoryItems,
      [category]: [...(categoryItems[category] || []), newItemObj]
    })
    setNewItem('')
  }

  function addNewCategory() {
    if (!newCategory.trim()) return
    setCategoryItems({
      ...categoryItems,
      [newCategory]: []
    })
    setNewCategory('')
  }

  function removeItem(category: string, index: number) {
    const updated = { ...categoryItems }
    updated[category] = updated[category].filter((_, i) => i !== index)
    setCategoryItems(updated)
  }

  function updateItem(category: string, index: number, field: string, value: string) {
    const updated = { ...categoryItems }
    updated[category][index] = { ...updated[category][index], [field]: value }
    setCategoryItems(updated)
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!template) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Template not found</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/dashboard/templates')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{template.name}</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{template.description}</p>
          </div>
        </div>
        <button 
          onClick={saveTemplate}
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={18} />{saving ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {Object.keys(categoryItems).map(category => (
          <div key={category} style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <h3 style={{ fontWeight: 600, color: '#1f2937' }}>{category}</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              {categoryItems[category].map((item: any, index: number) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 200px 40px', gap: '0.75rem', alignItems: 'start', marginBottom: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <input
                    type="text"
                    value={item.item_text}
                    onChange={e => updateItem(category, index, 'item_text', e.target.value)}
                    placeholder="Item text"
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', width: '100%' }}
                  />
                  <select
                    value={item.condition || ''}
                    onChange={e => updateItem(category, index, 'condition', e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Condition</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="n/a">N/A</option>
                    <option value="not_observed">Not Observed</option>
                  </select>
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={e => updateItem(category, index, 'notes', e.target.value)}
                    placeholder="Notes"
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                  <button 
                    onClick={() => removeItem(category, index)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  placeholder={`Add item to ${category}`}
                  onKeyDown={e => e.key === 'Enter' && addCategoryItem(category)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
                <button 
                  onClick={() => addCategoryItem(category)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  <Plus size={14} />Add
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new category */}
        <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Add New Category</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Category name (e.g., Roofing, Electrical)"
              onKeyDown={e => e.key === 'Enter' && addNewCategory()}
              style={{ flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
            />
            <button 
              onClick={addNewCategory}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              <Plus size={18} />Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}