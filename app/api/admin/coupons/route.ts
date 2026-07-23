import { NextResponse } from 'next/server'
import { getAllCoupons, createCoupon } from '@/lib/dataLoader'
import type { Coupon } from '@/types'

export async function GET() {
  const coupons = await getAllCoupons()
  return NextResponse.json(coupons)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.code || !body.value) {
      return NextResponse.json({ success: false, message: 'Coupon code and value are required' }, { status: 400 })
    }

    const coupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: body.code.toUpperCase(),
      description: body.description || '',
      type: body.type || 'percentage',
      value: Number(body.value),
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: Number(body.maxDiscount) || Number(body.value),
      usageLimit: Number(body.usageLimit) || 100,
      usedCount: 0,
      isActive: body.isActive ?? true,
      expiresAt: body.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
      applicableFor: body.applicableFor || 'all',
    }

    await createCoupon(coupon)
    return NextResponse.json({ success: true, coupon })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to create coupon' }, { status: 500 })
  }
}
