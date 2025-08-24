import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/ui/Sidebar";

export const metadata: Metadata = {
  title: "Synopsis Hub",
  description: "A professional platform for screenplay collaboration between writers, producers, and directors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
