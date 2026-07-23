import { NextResponse } from 'next/server'
import { updateUser } from '@/lib/dataLoader'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const updated = await updateUser(id, body)
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  const { password, ...safe } = updated
  return NextResponse.json({ success: true, user: safe })
}
