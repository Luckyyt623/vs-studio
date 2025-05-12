import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Already removed, keeping as is
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'Firebase Visual Studio - Mobile Workspace',
  description: 'A comprehensive mobile application development workspace, integrating Visual Studio features with Firebase, optimized for mobile app creation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable}`}>
      <body
        className="antialiased font-sans"
      >
        <SidebarProvider>
          {children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
