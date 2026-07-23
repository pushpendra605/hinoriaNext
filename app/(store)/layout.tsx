import { getSiteConfig } from '@/lib/dataLoader'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/layout/CartSidebar'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteConfig()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar site={site} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
      <CartSidebar />
    </div>
  )
}
