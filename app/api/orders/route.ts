import { NextResponse } from 'next/server'
import { getAllOrders, getOrdersByUser, createOrder, incrementCouponUsage } from '@/lib/dataLoader'
import type { Order } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    const orders = await getOrdersByUser(userId)
    return NextResponse.json(orders)
  }

  const orders = await getAllOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      userId, items, address, couponApplied,
      subtotal, discount, deliveryCharge, total, paymentMethod,
    } = body

    if (!userId || !items?.length || !address) {
      return NextResponse.json({ message: 'Missing required order fields' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      address,
      couponApplied: couponApplied ?? null,
      subtotal,
      discount,
      deliveryCharge,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Pending',
      statusHistory: [{ status: 'Pending', timestamp: now, note: 'Order placed by customer' }],
      createdAt: now,
      updatedAt: now,
    }

    await createOrder(order)
    if (couponApplied) await incrementCouponUsage(couponApplied)

    return NextResponse.json({ success: true, order })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to place order' }, { status: 500 })
  }
}
