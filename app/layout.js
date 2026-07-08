import './globals.css'
import { LangProvider } from '@/lib/LangContext'

export const metadata = {
  title: 'Jersey Order',
  description: '球衣及足球周边订购平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <LangProvider>
          <main className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  )
}
