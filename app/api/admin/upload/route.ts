import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Unsupported file type' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products', 'uploads')

    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, safeName), buffer)

    return NextResponse.json({ success: true, url: `/images/products/uploads/${safeName}` })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
  }
}
