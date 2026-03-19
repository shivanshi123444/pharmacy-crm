import { useState, useEffect } from 'react'
import { getInventory, getInventoryOverview, addMedicine, updateMedicine, updateStatus } from '../api'
import { getDashboardSummary } from '../api'

const statusStyle = {
  'Active':       { background: '#f0fdf4', color: '#16a34a' },
  'Low Stock':    { background: '#fefce8', color: '#ca8a04' },
  'Expired':      { background: '#fef2f2', color: '#dc2626' },
  'Out of Stock': { background: '#f9fafb', color: '#6b7280' },
}

const emptyForm = {
  medicine_name: '', generic_name: '', category: '',
  batch_no: '', expiry_date: '', quantity: 0,
  cost_price: 0, mrp: 0, supplier: '', status: 'Active'
}

export default function Inventory() {
  const [medicines, setMedicines] = useState([])
  const [overview, setOverview] = useState(null)
  const [summary, setSummary] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchData = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (filterStatus) params.status = filterStatus
    Promise.all([getInventory(params), getInventoryOverview(), getDashboardSummary()])
      .then(([m, o, s]) => { setMedicines(m.data); setOverview(o.data); setSummary(s.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search, filterStatus])

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editItem) await updateMedicine(editItem.id, form)
      else await addMedicine(form)
      setShowModal(false)
      fetchData()
    } catch { alert('Error saving. Check all required fields.') }
  }

  const fields = [
    ['medicine_name', 'Medicine Name', 'text', true],
    ['generic_name', 'Generic Name', 'text', false],
    ['category', 'Category', 'text', false],
    ['batch_no', 'Batch No', 'text', false],
    ['expiry_date', 'Expiry Date', 'date', false],
    ['quantity', 'Quantity', 'number', true],
    ['cost_price', 'Cost Price (₹)', 'number', false],
    ['mrp', 'MRP (₹)', 'number', false],
    ['supplier', 'Supplier', 'text', false],
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Pharmacy CRM</p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Manage inventory, sales, and purchase orders</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export
          </button>
          <button onClick={openAdd} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Medicine
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards — same as Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { icon: '₹', bg: '#16a34a', val: `₹${(summary?.today_sales || 124580).toLocaleString('en-IN')}`, label: "Today's Sales", badge: '↑ +12.5%', badgeBg: '#f0fdf4', badgeColor: '#16a34a' },
          { svgPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', bg: '#2563eb', val: summary?.items_sold_today || 156, label: 'Items Sold Today', badge: '32 Orders', badgeBg: '#eff6ff', badgeColor: '#2563eb' },
          { svgPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', bg: '#f97316', val: summary?.low_stock_items || 12, label: 'Low Stock Items', badge: 'Action Needed', badgeBg: '#fff7ed', badgeColor: '#ea580c' },
          { svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', bg: '#a855f7', val: '₹96,250', label: 'Purchase Orders', badge: '5 Pending', badgeBg: '#faf5ff', badgeColor: '#a855f7' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '38px', height: '38px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: card.icon ? '18px' : undefined }}>
                {card.icon ? card.icon : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.svgPath} />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '11px', background: card.badgeBg, color: card.badgeColor, padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{card.badge}</span>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>{card.val}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Inventory Overview */}
      {overview && (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>Inventory Overview</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>

            {/* Total Items */}
            <div style={{ paddingRight: '24px', borderRight: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Total Items</p>
                <div style={{ width: '22px', height: '22px', background: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#2563eb', margin: 0 }}>{overview.total_items}</p>
            </div>

            {/* Active Stock */}
            <div style={{ padding: '0 24px', borderRight: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Active Stock</p>
                <div style={{ width: '22px', height: '22px', background: '#f0fdf4', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a', margin: 0 }}>{overview.active_stock}</p>
            </div>

            {/* Low Stock */}
            <div style={{ padding: '0 24px', borderRight: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Low Stock</p>
                <div style={{ width: '22px', height: '22px', background: '#fff7ed', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" fill="none" stroke="#f97316" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#f97316', margin: 0 }}>{overview.low_stock}</p>
            </div>

            {/* Total Value */}
            <div style={{ paddingLeft: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Total Value</p>
                <div style={{ width: '22px', height: '22px', background: '#faf5ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" fill="none" stroke="#a855f7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>₹{Number(overview.total_value || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Complete Inventory Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>Complete Inventory</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', outline: 'none', width: '200px' }}
              placeholder="Search medicines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', outline: 'none', color: '#374151' }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option>Active</option>
              <option>Low Stock</option>
              <option>Expired</option>
              <option>Out of Stock</option>
            </select>
            <button style={{ border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filter
            </button>
            <button style={{ border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['Medicine Name','Generic Name','Category','Batch No','Expiry Date','Quantity','Cost Price','MRP','Supplier','Status','Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#9ca3af', fontWeight: 500, fontSize: '12px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <div style={{ width: '24px', height: '24px', border: '3px solid #dbeafe', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </td></tr>
              ) : medicines.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>No medicines found</td></tr>
              ) : medicines.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f9fafb', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 12px', fontWeight: 600, color: '#111827' }}>{m.medicine_name}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>{m.generic_name}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>{m.category}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>{m.batch_no}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>{m.expiry_date}</td>
                  <td style={{ padding: '12px 12px', color: m.quantity === 0 ? '#dc2626' : m.quantity < 50 ? '#ca8a04' : '#111827', fontWeight: 500 }}>{m.quantity}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>₹{m.cost_price}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280' }}>₹{m.mrp}</td>
                  <td style={{ padding: '12px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{m.supplier}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, whiteSpace: 'nowrap', ...(statusStyle[m.status] || { background: '#f3f4f6', color: '#374151' }) }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(m)} style={{ fontSize: '12px', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                      <button onClick={() => updateStatus(m.id, 'Expired').then(fetchData)} style={{ fontSize: '12px', color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>Expire</button>
                      <button onClick={() => updateStatus(m.id, 'Out of Stock').then(fetchData)} style={{ fontSize: '12px', color: '#6b7280', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>OOS</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
              {editItem ? 'Edit Medicine' : 'Add New Medicine'}
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {fields.map(([key, label, type, required]) => (
                  <div key={key}>
                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>{label}</label>
                    <input
                      type={type} required={required}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}
                  >
                    {['Active', 'Low Stock', 'Expired', 'Out of Stock'].map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
                  {editItem ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}