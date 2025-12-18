import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { PageTransition } from './layout-client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Port Under Attack - GNSS Cybersecurity Game",
  description: "An educational serious game about GNSS spoofing and jamming for geospatial security training. Master's thesis project in Geospatial Technologies.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050805" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <PageTransition>
          {children}
        </PageTransition>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              },
              iconTheme: {
                primary: '#34d399',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              },
              iconTheme: {
                primary: '#fca5a5',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}