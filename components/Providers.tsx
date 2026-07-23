'use client'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#1c1712',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '10px',
            padding: '10px 16px',
          },
          success: {
            iconTheme: { primary: 'var(--color-primary)', secondary: '#fff' },
          },
        }}
      />
    </>
  )
}
