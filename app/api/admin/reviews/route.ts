import { NextResponse } from 'next/server'
import { getAllReviews } from '@/lib/dataLoader'

export async function GET() {
  const reviews = await getAllReviews()
  return NextResponse.json(reviews)
}
