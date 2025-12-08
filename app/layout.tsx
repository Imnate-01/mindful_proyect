import '../styles/globals.css'
import Header from '@/components/Header'
import { UserProvider } from '@/context/UserContext'

export const metadata = {
  title: 'iNerzia Mind | Tu Espacio de Calma',
  description: 'Plataforma de bienestar emocional y mindfulness diseñada para acompañarte en tu vida universitaria.',
  icons: {
    icon: '/icons/heart-mind.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Tipografía Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen font-poppins bg-gradient-to-br from-[#e8f3ed] to-[#d9eee9] text-gray-800">
        <UserProvider>
          <Header />
          <main className="max-w-[1200px] mx-auto p-6">{children}</main>
        </UserProvider>
        <footer className="p-6 text-center text-sm text-gray-500">
          © 2025 iNerzia Mind — Proyecto académico
        </footer>
      </body>
    </html>
  )
}
