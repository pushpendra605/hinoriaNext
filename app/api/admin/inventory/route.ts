import { NextResponse } from 'next/server'
import { getAllInventory, updateInventory } from '@/lib/dataLoader'

export async function GET() {
  const inventory = await getAllInventory()
  return NextResponse.json(inventory)
}

export async function PUT(request: Request) {
  try {
    const { productId, sizes } = await request.json()
    if (!productId || !sizes) {
      return NextResponse.json({ success: false, message: 'productId and sizes are required' }, { status: 400 })
    }
    const record = await updateInventory(productId, sizes)
    return NextResponse.json({ success: true, inventory: record })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to update inventory' }, { status: 500 })
  }
}
