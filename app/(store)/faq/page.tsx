import type { Metadata } from 'next'
import FAQClient from './FAQClient'

export const metadata: Metadata = { title: 'FAQ — Frequently Asked Questions' }

export default function FAQPage() {
  return <FAQClient />
}
