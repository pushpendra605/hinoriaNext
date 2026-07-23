import { Suspense } from 'react'
import OrderConfirmationClient from './OrderConfirmationClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed!' }

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    }>
      <OrderConfirmationClient />
    </Suspense>
  )
}
