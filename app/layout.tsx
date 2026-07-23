import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/dataLoader'
import Providers from '@/components/Providers'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig()
  return {
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.tagline,
    icons: { icon: site.favicon },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteConfig()
  const { theme } = site

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${theme.fontHeading.replace(' ', '+')}:ital,wght@0,400;0,500;0,600;0,700;1,400&family=${theme.fontBody.replace(' ', '+')}:wght@300;400;500;600&display=swap`}
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body
        className="antialiased"
        style={{
          '--color-primary': theme.primaryColor,
          '--color-primary-hover': theme.primaryHover,
          '--color-dark': theme.darkColor,
          '--color-accent': theme.accentColor,
          '--color-gold': (theme as any).goldColor || '#d7b053',
          '--font-heading': theme.fontHeading,
          '--font-body': theme.fontBody,
        } as React.CSSProperties}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
