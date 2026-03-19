import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'

const SideIcon = ({ path, to, end }) => (
  <NavLink to={to} end={end} style={({ isActive }) => ({
    width: '36px', height: '36px', borderRadius: '8px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    background: isActive ? '#eff6ff' : 'transparent',
    color: isActive ? '#2563eb' : '#9ca3af',
    border: 'none', textDecoration: 'none'
  })}>
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
    </svg>
  </NavLink>
)

const IconBtn = ({ path }) => (
  <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af' }}>
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
    </svg>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

        {/* Sidebar */}
        <aside style={{
          width: '56px', background: 'white',
          borderRight: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '16px 0',
          gap: '4px', flexShrink: 0,
          boxShadow: '1px 0 4px rgba(0,0,0,0.04)'
        }}>
          {/* Search */}
          <IconBtn path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />

          {/* Dashboard (Home) */}
          <SideIcon to="/" end path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />

          {/* Menu / List */}
          <IconBtn path="M4 6h16M4 12h16M4 18h16" />

          {/* Activity */}
          <IconBtn path="M22 12h-4l-3 9L9 3l-3 9H2" />

          {/* Calendar */}
          <IconBtn path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />

          {/* People */}
          <IconBtn path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />

          {/* Stethoscope / Medical */}
          <IconBtn path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />

          {/* Link */}
          <IconBtn path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />

          {/* Plus */}
          <IconBtn path="M12 4v16m8-8H4" />

          {/* Sparkle / Star */}
          <IconBtn path="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />

          {/* Inventory */}
          <SideIcon to="/inventory" path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Settings */}
          <IconBtn path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {/* Top white content area */}
          <div style={{ margin: '16px', background: 'white', borderRadius: '16px', minHeight: 'calc(100vh - 32px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}