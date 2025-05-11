import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it might not be installed
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';

const geistSans = GeistSans;
// const geistMono = GeistMono; // Removed

export const metadata: Metadata = {
  title: 'CodeWrite Mobile',
  description: 'A mobile-first code editor with AI-powered autocompletion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable}`}>
      <body
        className="antialiased font-sans" // Removed geistMono.variable
      >
        <SidebarProvider>
          {children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
