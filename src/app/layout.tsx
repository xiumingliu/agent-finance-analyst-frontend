import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emble Finance AI Agent',
  description: 'Insights and actions from your financial data using AI',
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