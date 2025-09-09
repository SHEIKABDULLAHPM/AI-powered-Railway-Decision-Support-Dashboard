// app/layout.tsx - Root layout component
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Railway AI Dashboard - Decision Support System',
  description: 'AI-powered railway decision support dashboard for optimizing train operations, managing delays, and improving network efficiency.',
  keywords: 'railway, AI, dashboard, trains, optimization, decision support',
  authors: [{ name: 'Railway AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background">
            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Top Navigation Bar */}
              <Topbar />
              
              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
                <div className="mx-auto max-w-7xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
          
          {/* Global Chatbot Widget */}
          <ChatbotWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}