import { NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/dataLoader'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()

    if (body.price !== undefined || body.discountPercent !== undefined) {
      const existing = await getProductById(id)
      const price = body.price !== undefined ? Number(body.price) : existing?.price ?? 0
      const discountPercent = body.discountPercent !== undefined ? Number(body.discountPercent) : existing?.discountPercent ?? 0
      body.finalPrice = Math.round(price - (price * discountPercent) / 100)
    }
    if (body.images?.length) {
      body.thumbnail = body.images[0]
    }

    const updated = await updateProduct(id, body)
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, product: updated })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = await deleteProduct(id)
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
