import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/header";
import ClientLayout from "@/components/client-layout";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className}`}>
        <ClientLayout>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />


        </ClientLayout>
      </body>
    </html>
  );
}
