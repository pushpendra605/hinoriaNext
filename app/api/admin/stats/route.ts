import { NextResponse } from 'next/server'
import { getAllOrders, getAllProducts, getAllUsers, getAllInventory } from '@/lib/dataLoader'

export async function GET() {
  const [orders, products, users, inventory] = await Promise.all([
    getAllOrders(),
    getAllProducts(),
    getAllUsers(),
    getAllInventory(),
  ])

  const nonCancelled = orders.filter(o => o.status !== 'Cancelled')
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const totalCustomers = users.filter(u => u.role === 'user').length
  const totalProducts = products.length

  // Revenue by day (last 14 days)
  const revenueByDay: Record<string, number> = {}
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    revenueByDay[d.toISOString().slice(0, 10)] = 0
  }
  nonCancelled.forEach(o => {
    const key = o.createdAt.slice(0, 10)
    if (key in revenueByDay) revenueByDay[key] += o.total
  })
  const revenueTrend = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }))

  // Order status breakdown
  const statusCounts: Record<string, number> = {}
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1 })
  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({ status, count }))

  // Top selling products
  const productSales: Record<string, { name: string; qty: number; revenue: number; thumbnail: string }> = {}
  nonCancelled.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, qty: 0, revenue: 0, thumbnail: item.thumbnail }
      }
      productSales[item.productId].qty += item.quantity
      productSales[item.productId].revenue += item.finalPrice * item.quantity
    })
  })
  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Category breakdown (by product count)
  const categoryCounts: Record<string, number> = {}
  products.forEach(p => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1 })
  const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }))

  // Low stock / out of stock
  const lowStock = inventory
    .filter(i => i.available <= 5)
    .map(i => {
      const product = products.find(p => p.id === i.productId)
      return { productId: i.productId, name: product?.name || i.productId, thumbnail: product?.thumbnail || '', available: i.available }
    })
    .sort((a, b) => a.available - b.available)

  // Product status breakdown
  const productStatusCounts: Record<string, number> = { published: 0, draft: 0, pending: 0 }
  products.forEach(p => { productStatusCounts[p.status || 'published']++ })

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueTrend,
    statusBreakdown,
    topProducts,
    categoryBreakdown,
    lowStock,
    productStatusCounts,
    recentOrders,
  })
}
