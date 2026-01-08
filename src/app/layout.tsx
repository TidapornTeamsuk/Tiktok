import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'TikTok Video Creator | สร้างวิดีโอรีวิวสินค้าด้วย AI',
  description: 'เครื่องมือสร้างวิดีโอรีวิวสินค้า TikTok อัตโนมัติด้วยพลัง AI จาก Google - Gemini, Imagen และ VEO3',
  keywords: 'TikTok, Video Creator, AI, Affiliate, รีวิวสินค้า, VEO3, Gemini',
  authors: [{ name: 'TikTok Creator' }],
  openGraph: {
    title: 'TikTok Video Creator',
    description: 'สร้างวิดีโอรีวิวสินค้าระดับมืออาชีพภายในไม่กี่วินาที',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
