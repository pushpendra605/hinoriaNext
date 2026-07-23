

import { NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/dataLoader'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') || ''
  const total = Number(searchParams.get('total') || 0)
  const result = await validateCoupon(code, total)
  return NextResponse.json(result)
}
