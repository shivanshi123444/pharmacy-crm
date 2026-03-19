import axios from 'axios'

const API = axios.create({
  baseURL: 'https://pharmacy-crm-backend-kwdu.onrender.com'
})

export const getDashboardSummary = () => API.get('/api/dashboard/summary')
export const getRecentSales = () => API.get('/api/dashboard/recent-sales')
export const getInventory = (params) => API.get('/api/inventory', { params })
export const getInventoryOverview = () => API.get('/api/inventory/overview')
export const addMedicine = (data) => API.post('/api/inventory', data)
export const updateMedicine = (id, data) => API.put(`/api/inventory/${id}`, data)
export const updateStatus = (id, status) => API.patch(`/api/inventory/${id}/status?status=${status}`)
export const deleteMedicine = (id) => API.delete(`/api/inventory/${id}`)