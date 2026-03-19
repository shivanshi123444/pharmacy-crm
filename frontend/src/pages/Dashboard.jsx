import { useState, useEffect } from 'react'
import { getDashboardSummary, getRecentSales } from '../api'

const s = {
  page: { padding: '24px', maxWidth: '1100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 },
  subtitle: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  btnRow: { display: 'flex', gap: '8px' },
  btnOutline: { border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer' },
  btnBlue: { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  card: { background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  iconGreen: { width: '36px', height: '36px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 700, fontSize: '16px' },
  iconBlue: { width: '36px', height: '36px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' },
  iconOrange: { width: '36px', height: '36px', background: '#ffedd5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' },
  iconPurple: { width: '36px', height: '36px', background: '#ede9fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' },
  badgeGreen: { fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '20px' },
  badgeBlue: { fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '20px' },
  badgeOrange: { fontSize: '11px', background: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: '20px' },
  badgePurple: { fontSize: '11px', background: '#faf5ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '20px' },
  cardVal: { fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 },
  cardLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  panelTitle: { fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px' },
  saleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', cursor: 'default' },
  saleLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  saleIcon: { width: '32px', height: '32px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 },
  saleName: { fontSize: '14px', fontWeight: 500, color: '#111827' },
  saleSub: { fontSize: '12px', color: '#9ca3af' },
  saleRight: { textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' },
  saleAmt: { fontSize: '14px', fontWeight: 600, color: '#111827' },
  saleDate: { fontSize: '12px', color: '#9ca3af' },
  badgeDone: { fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
  loader: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardSummary(), getRecentSales()])
      .then(([s, r]) => { setSummary(s.data); setSales(r.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={s.loader}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #dbeafe', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <p style={s.title}>Pharmacy CRM</p>
          <p style={s.subtitle}>Manage inventory, sales, and purchase orders</p>
        </div>
        <div style={s.btnRow}>
          <button style={s.btnOutline}>Export</button>
          <button style={s.btnBlue}>+ Add Medicine</button>
        </div>
      </div>

      <div style={s.grid4}>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconGreen}>₹</div>
            <span style={s.badgeGreen}>+12.5%</span>
          </div>
          <p style={s.cardVal}>₹{(summary?.today_sales || 124580).toLocaleString('en-IN')}</p>
          <p style={s.cardLabel}>Today's Sales</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconBlue}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <span style={s.badgeBlue}>22 Orders</span>
          </div>
          <p style={s.cardVal}>{summary?.items_sold_today || 156}</p>
          <p style={s.cardLabel}>Items Sold Today</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconOrange}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <span style={s.badgeOrange}>Action Needed</span>
          </div>
          <p style={s.cardVal}>{summary?.low_stock_items || 12}</p>
          <p style={s.cardLabel}>Low Stock Items</p>
        </div>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconPurple}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <span style={s.badgePurple}>5 Pending</span>
          </div>
          <p style={s.cardVal}>₹96,250</p>
          <p style={s.cardLabel}>Purchase Orders</p>
        </div>
      </div>

      <div style={s.panel}>
        <p style={s.panelTitle}>Recent Sales</p>
        {sales.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '24px', fontSize: '14px' }}>No sales yet</p>
        ) : sales.map((sale, i) => (
          <div key={sale.id} style={{ ...s.saleRow, background: i % 2 === 0 ? 'white' : '#f9fafb' }}>
            <div style={s.saleLeft}>
              <div style={s.saleIcon}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
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
      </div>
    </div>
  )
}