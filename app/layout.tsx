import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SplitEase",
  description: "Split expenses easily with friends and family",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
            <header className="h-16 border-b flex items-center px-4 md:px-6">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-semibold tracking-wide">SplitEase</h1>
                <Navigation />
              </div>
            </header>
            <main className="flex-1 py-6 px-4 md:px-6">{children}</main>
            <footer className="h-12 border-t flex items-center justify-center">
              <p className="text-xs text-gray-500">© 2025 SplitEase</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
