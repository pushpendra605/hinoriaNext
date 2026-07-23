import { NextResponse } from 'next/server'
import { getAllProducts, createProduct } from '@/lib/dataLoader'
import type { Product } from '@/types'

export async function GET() {
  const products = await getAllProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.category || !body.price) {
      return NextResponse.json({ success: false, message: 'Name, category and price are required' }, { status: 400 })
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const price = Number(body.price)
    const discountPercent = Number(body.discountPercent) || 0
    const finalPrice = Math.round(price - (price * discountPercent) / 100)

    const product: Product = {
      id: `${body.gender || 'product'}-${Date.now()}`,
      name: body.name,
      slug,
      description: body.description || '',
      price,
      discountPercent,
      finalPrice,
      category: body.category,
      gender: body.gender || 'unisex',
      color: body.color || '',
      material: body.material || '',
      features: body.features || [],
      sizes: body.sizes || [],
      modelInfo: body.modelInfo || undefined,
      images: body.images || [],
      thumbnail: body.images?.[0] || body.thumbnail || '',
      tags: body.tags || [],
      brand: body.brand || '',
      rating: 0,
      reviewCount: 0,
      isFeatured: !!body.isFeatured,
      isNewArrival: body.isNewArrival ?? true,
      isTrending: !!body.isTrending,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
    }

    await createProduct(product)
    return NextResponse.json({ success: true, product })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 })
  }
}
