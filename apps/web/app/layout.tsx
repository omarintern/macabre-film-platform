import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/ui/Navigation";

export const metadata: Metadata = {
  title: "Film Collaboration Platform",
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
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
