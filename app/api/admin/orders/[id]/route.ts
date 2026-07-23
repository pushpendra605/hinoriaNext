import { NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/dataLoader'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { status, note } = await request.json()
    if (!status) {
      return NextResponse.json({ success: false, message: 'Status is required' }, { status: 400 })
    }
    const order = await updateOrderStatus(id, status, note || `Status updated to ${status}`)
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    return NextResponse.json({ success: true, order })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 })
  }
}
