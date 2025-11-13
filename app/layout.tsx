import AppErrorBoundary  from '@/Components/AppErrorBoundary'
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
      <AppErrorBoundary>
        {children}
        <Toaster
           position="top-right"
           toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#333',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#f87171',
                secondary: '#333',
              },
            }
           }}
          />
          </AppErrorBoundary>
      </body>
    </html>
  );
}
