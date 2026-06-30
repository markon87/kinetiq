import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '../providers/ThemeProvider'
import { UploadAnalysisProvider } from '../providers/UploadAnalysisProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata = {
  title: 'Kinetiq',
  description: 'AI-powered running intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider>
          <UploadAnalysisProvider>{children}</UploadAnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
