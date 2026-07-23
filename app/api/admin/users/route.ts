import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/dataLoader'

export async function GET() {
  const users = await getAllUsers()
  const safe = users.map(({ password, ...u }) => u)
  return NextResponse.json(safe)
}
