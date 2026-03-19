import { useState, useEffect } from 'react'
import { getInventory, getInventoryOverview, addMedicine, updateMedicine, updateStatus } from '../api'

const statusStyle = {
  'Active':       { background: '#f0fdf4', color: '#16a34a' },
  'Low Stock':    { background: '#fefce8', color: '#ca8a04' },
  'Expired':      { background: '#fef2f2', color: '#dc2626' },
  'Out of Stock': { background: '#f9fafb', color: '#6b7280' },
}

const s = {
  page: { padding: '24px', maxWidth: '1200px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 },
  subtitle: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  btnRow: { display: 'flex', gap: '8px' },
  btnOutline: { border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer' },
  btnBlue: { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' },
  panelTitle: { fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px' },
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' },
  ovVal: { fontSize: '26px', fontWeight: 700, margin: 0 },
  ovLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  filterRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  input: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', outline: 'none', width: '200px' },
  select: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', outline: 'none', color: '#374151' },
  filterRight: { display: 'flex', gap: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '8px 10px', color: '#9ca3af', fontWeight: 500, fontSize: '12px', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' },
  td: { padding: '12px 10px', color: '#374151', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' },
  tdBold: { padding: '12px 10px', color: '#111827', fontWeight: 500, borderBottom: '1px solid #f3f4f6' },
  badge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500, display: 'inline-block' },
  actionBtn: { fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { background: 'white', borderRadius: '16px', padding: '24px', width: '560px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' },
  formInput: { width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' },
  btnCancel: { border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#374151' },
  btnSubmit: { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
}

const emptyForm = {
  medicine_name: '', generic_name: '', category: '',
  batch_no: '', expiry_date: '', quantity: 0,
  cost_price: 0, mrp: 0, supplier: '', status: 'Active'
}

export default function Inventory() {
  const [medicines, setMedicines] = useState([])
  const [overview, setOverview] = useState(null)
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
    Promise.all([getInventory(params), getInventoryOverview()])
      .then(([m, o]) => { setMedicines(m.data); setOverview(o.data) })
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
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <p style={s.title}>Pharmacy CRM</p>
          <p style={s.subtitle}>Manage inventory, sales, and purchase orders</p>
        </div>
        <div style={s.btnRow}>
          <button style={s.btnOutline}>Export</button>
          <button style={s.btnBlue} onClick={openAdd}>+ Add Medicine</button>
        </div>
      </div>

      {overview && (
        <div style={s.panel}>
          <p style={s.panelTitle}>Inventory Overview</p>
          <div style={s.overviewGrid}>
            <div><p style={{ ...s.ovVal, color: '#2563eb' }}>{overview.total_items}</p><p style={s.ovLabel}>Total Items</p></div>
            <div><p style={{ ...s.ovVal, color: '#16a34a' }}>{overview.active_stock}</p><p style={s.ovLabel}>Active Stock</p></div>
            <div><p style={{ ...s.ovVal, color: '#ea580c' }}>{overview.low_stock}</p><p style={s.ovLabel}>Low Stock</p></div>
            <div><p style={{ ...s.ovVal, color: '#111827' }}>₹{Number(overview.total_value || 0).toLocaleString('en-IN')}</p><p style={s.ovLabel}>Total Value</p></div>
          </div>
        </div>
      )}

      <div style={s.panel}>
        <div style={s.filterRow}>
          <p style={s.panelTitle}>Complete Inventory</p>
          <div style={s.filterRight}>
            <input style={s.input} placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={s.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option><option>Low Stock</option><option>Expired</option><option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Medicine Name','Generic Name','Category','Batch No','Expiry','Qty','Cost','MRP','Supplier','Status','Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</td></tr>
              ) : medicines.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No medicines found</td></tr>
              ) : medicines.map(m => (
                <tr key={m.id} style={{ cursor: 'default' }}>
                  <td style={s.tdBold}>{m.medicine_name}</td>
                  <td style={s.td}>{m.generic_name}</td>
                  <td style={s.td}>{m.category}</td>
                  <td style={s.td}>{m.batch_no}</td>
                  <td style={s.td}>{m.expiry_date}</td>
                  <td style={s.td}>{m.quantity}</td>
                  <td style={s.td}>₹{m.cost_price}</td>
                  <td style={s.td}>₹{m.mrp}</td>
                  <td style={s.td}>{m.supplier}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(statusStyle[m.status] || { background: '#f3f4f6', color: '#374151' }) }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={{ ...s.actionBtn, color: '#2563eb' }} onClick={() => openEdit(m)}>Edit</button>
                    <button style={{ ...s.actionBtn, color: '#dc2626' }} onClick={() => updateStatus(m.id, 'Expired').then(fetchData)}>Expire</button>
                    <button style={{ ...s.actionBtn, color: '#6b7280' }} onClick={() => updateStatus(m.id, 'Out of Stock').then(fetchData)}>OOS</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editItem ? 'Edit Medicine' : 'Add New Medicine'}</p>
            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                {fields.map(([key, label, type, required]) => (
                  <div key={key}>
                    <label style={s.label}>{label}</label>
                    <input type={type} required={required} value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={s.formInput} />
                  </div>
                ))}
                <div>
                  <label style={s.label}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={s.formInput}>
                    {['Active', 'Low Stock', 'Expired', 'Out of Stock'].map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.btnSubmit}>{editItem ? 'Update' : 'Add Medicine'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}