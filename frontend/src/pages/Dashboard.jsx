import { useState, useEffect } from 'react'
import { getDashboardSummary, getRecentSales, getInventory } from '../api'

const s = {
  page: { padding: '24px', maxWidth: '1100px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 },
  subtitle: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  btnRow: { display: 'flex', gap: '8px' },
  btnOutline: { border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  btnBlue: { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  card: { background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  iconGreen: { width: '38px', height: '38px', background: '#16a34a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '18px' },
  iconBlue: { width: '38px', height: '38px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  iconOrange: { width: '38px', height: '38px', background: '#f97316', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  iconPurple: { width: '38px', height: '38px', background: '#a855f7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  badgeGreen: { fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
  badgeBlue: { fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
  badgeOrange: { fontSize: '11px', background: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
  badgePurple: { fontSize: '11px', background: '#faf5ff', color: '#a855f7', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
  cardVal: { fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 },
  cardLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  tabBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #f3f4f6' },
  tabLeft: { display: 'flex' },
  tab: { padding: '12px 16px', fontSize: '13px', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' },
  tabActive: { padding: '12px 16px', fontSize: '13px', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', borderBottom: '2px solid #2563eb', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' },
  tabRight: { display: 'flex', gap: '8px' },
  btnGreen: { background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' },
  btnNewOutline: { border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#374151', cursor: 'pointer' },
  saleSection: { padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f8fafc' },
  saleSectionTitle: { fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' },
  saleSectionSub: { fontSize: '12px', color: '#9ca3af', marginBottom: '12px' },
  saleInputRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' },
  patientInput: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', width: '140px', background: 'white' },
  searchWrap: { position: 'relative', flex: 1 },
  searchInput: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px 8px 32px', fontSize: '13px', outline: 'none', width: '100%', background: 'white' },
  btnEnter: { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' },
  btnBill: { background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' },
  medTable: { width: '100%', borderCollapse: 'collapse' },
  medTh: { textAlign: 'left', padding: '8px 10px', color: '#9ca3af', fontWeight: 500, fontSize: '11px', borderBottom: '1px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '0.04em' },
  recentTitle: { fontSize: '14px', fontWeight: 600, color: '#111827', padding: '16px 20px 12px' },
  saleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #f9fafb' },
  saleLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  saleIcon: { width: '34px', height: '34px', background: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
  saleName: { fontSize: '13px', fontWeight: 500, color: '#111827' },
  saleSub: { fontSize: '12px', color: '#9ca3af' },
  saleRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  saleAmt: { fontSize: '13px', fontWeight: 600, color: '#111827' },
  saleDate: { fontSize: '12px', color: '#9ca3af' },
  badgeDone: { fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 },
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [sales, setSales] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sales')
  const [patientId, setPatientId] = useState('')
  const [searchMed, setSearchMed] = useState('')

  useEffect(() => {
    Promise.all([getDashboardSummary(), getRecentSales(), getInventory({})])
      .then(([s, r, m]) => { setSummary(s.data); setSales(r.data); setMedicines(m.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #dbeafe', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const filteredMeds = medicines.filter(m =>
    !searchMed || m.medicine_name.toLowerCase().includes(searchMed.toLowerCase())
  )

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <p style={s.title}>Pharmacy CRM</p>
          <p style={s.subtitle}>Manage inventory, sales, and purchase orders</p>
        </div>
        <div style={s.btnRow}>
          <button style={s.btnOutline}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export
          </button>
          <button style={s.btnBlue}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Medicine
          </button>
        </div>
      </div>

      <div style={s.grid4}>
        <div style={s.card}>
          <div style={s.cardTop}><div style={s.iconGreen}>₹</div><span style={s.badgeGreen}>↑ +12.5%</span></div>
          <p style={s.cardVal}>₹{(summary?.today_sales || 124580).toLocaleString('en-IN')}</p>
          <p style={s.cardLabel}>Today's Sales</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconBlue}><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></div>
            <span style={s.badgeBlue}>32 Orders</span>
          </div>
          <p style={s.cardVal}>{summary?.items_sold_today || 156}</p>
          <p style={s.cardLabel}>Items Sold Today</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconOrange}><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
            <span style={s.badgeOrange}>Action Needed</span>
          </div>
          <p style={s.cardVal}>{summary?.low_stock_items || 12}</p>
          <p style={s.cardLabel}>Low Stock Items</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconPurple}><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            <span style={s.badgePurple}>5 Pending</span>
          </div>
          <p style={s.cardVal}>₹96,250</p>
          <p style={s.cardLabel}>Purchase Orders</p>
        </div>
      </div>

      <div style={s.panel}>
        <div style={s.tabBar}>
          <div style={s.tabLeft}>
            {[
              { key: 'sales', label: 'Sales' },
              { key: 'purchase', label: 'Purchase' },
              { key: 'inventory', label: 'Inventory' },
            ].map(t => (
              <button key={t.key} style={activeTab === t.key ? s.tabActive : s.tab} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={s.tabRight}>
            <button style={s.btnGreen}>+ New Sale</button>
            <button style={s.btnNewOutline}>+ New Purchase</button>
          </div>
        </div>

        {activeTab === 'sales' && (
          <>
            <div style={s.saleSection}>
              <p style={s.saleSectionTitle}>Make a Sale</p>
              <p style={s.saleSectionSub}>Select medicines from inventory</p>
              <div style={s.saleInputRow}>
                <input style={s.patientInput} placeholder="Patient Id" value={patientId} onChange={e => setPatientId(e.target.value)} />
                <div style={s.searchWrap}>
                  <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
                  <input style={s.searchInput} placeholder="Search medicines..." value={searchMed} onChange={e => setSearchMed(e.target.value)} />
                </div>
                <button style={s.btnEnter}>Enter</button>
                <button style={s.btnBill}>Bill</button>
              </div>
              <table style={s.medTable}>
                <thead>
                  <tr>{['Medicine Name','Generic Name','Batch No','Expiry Date','Quantity','MRP / Price','Supplier','Status','Actions'].map(h => (
                    <th key={h} style={s.medTh}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filteredMeds.slice(0, 4).map(m => (
                    <tr key={m.id}>
                      <td style={{ padding: '8px 10px', fontSize: '12px', fontWeight: 500, color: '#111827' }}>{m.medicine_name}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>{m.generic_name}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>{m.batch_no}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>{m.expiry_date}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>{m.quantity}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>₹{m.mrp}</td>
                      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280' }}>{m.supplier}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500, background: m.status === 'Active' ? '#f0fdf4' : m.status === 'Low Stock' ? '#fefce8' : '#fef2f2', color: m.status === 'Active' ? '#16a34a' : m.status === 'Low Stock' ? '#ca8a04' : '#dc2626' }}>{m.status}</span>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <button style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}>Add</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={s.recentTitle}>Recent Sales</p>
            {sales.map(sale => (
              <div key={sale.id} style={s.saleRow}>
                <div style={s.saleLeft}>
                  <div style={s.saleIcon}><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></div>
                  <div>
                    <p style={s.saleName}>{sale.invoice_no}</p>
                    <p style={s.saleSub}>{sale.patient_name} · {sale.items_count} items · {sale.payment_method}</p>
                  </div>
                </div>
                <div style={s.saleRight}>
                  <p style={s.saleAmt}>₹{sale.total_amount}</p>
                  <p style={s.saleDate}>{new Date(sale.created_at).toLocaleDateString()}</p>
                  <span style={s.badgeDone}>{sale.status}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {activeTab === 'purchase' && <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No purchase orders yet</div>}
        {activeTab === 'inventory' && <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Use the Inventory page from the sidebar</div>}
      </div>
    </div>
  )
}