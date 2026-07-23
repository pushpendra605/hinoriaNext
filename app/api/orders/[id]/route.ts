import { NextResponse } from 'next/server'
import { getOrderById } from '@/lib/dataLoader'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json(order)
}
