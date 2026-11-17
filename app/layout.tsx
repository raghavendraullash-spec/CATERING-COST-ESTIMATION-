import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catering Cost Estimation & Quotation Engine',
  description:
    'Real-time interactive banquet budgeting, menu package selection, ceiling-ratio staffing calculations, and executive printable invoices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
