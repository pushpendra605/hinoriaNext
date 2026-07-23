import { NextResponse } from 'next/server'
import { getAllCategories, createCategory } from '@/lib/dataLoader'
import type { Category } from '@/types'

export async function GET() {
  const categories = await getAllCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 })
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category: Category = {
      id: `${slug}-${Date.now()}`,
      slug,
      name: body.name,
      gender: body.gender || 'unisex',
      parentSlug: body.parentSlug || '',
      image: body.image || '',
      productCount: 0,
    }

    await createCategory(category)
    return NextResponse.json({ success: true, category })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 })
  }
}
