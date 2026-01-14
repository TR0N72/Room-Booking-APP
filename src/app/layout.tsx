import { Montserrat } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ErrorBoundaryWrapper } from "@/components/common/ErrorBoundaryWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Room Booking System",
  description: "Modern PWA for booking meeting rooms",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Room Booking",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Room Booking" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.cdnfonts.com/css/metropolis-2" rel="stylesheet" />
      </head>
      <body className={`${montserrat.variable} bg-hima-main text-slate-100 font-sans antialiased`}>
        <ErrorBoundaryWrapper>
          {children}
        </ErrorBoundaryWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
