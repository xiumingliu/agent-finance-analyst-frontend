import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Tailwind Template',
  description: 'Minimal Next.js + Tailwind starter deployed to Azure Web App'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh w-full bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}