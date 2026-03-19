import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{display:'flex', minHeight:'100vh', background:'#f9fafb'}}>
        <aside style={{width:'56px', background:'white', borderRight:'1px solid #e5e7eb', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'16px', gap:'8px'}}>
          <NavLink to="/" end style={({isActive}) => ({
            padding:'8px', borderRadius:'8px', display:'flex',
            background: isActive ? '#eff6ff' : 'transparent',
            color: isActive ? '#2563eb' : '#9ca3af'
          })}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </NavLink>
          <NavLink to="/inventory" style={({isActive}) => ({
            padding:'8px', borderRadius:'8px', display:'flex',
            background: isActive ? '#eff6ff' : 'transparent',
            color: isActive ? '#2563eb' : '#9ca3af'
          })}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </NavLink>
        </aside>
        <main style={{flex:1, overflow:'auto'}}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}