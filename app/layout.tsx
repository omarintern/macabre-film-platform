import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/ui/Sidebar";
import ErrorBoundary from "../components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "Macabre",
  description: "A professional platform for screenplay collaboration between writers, producers, and directors",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <Sidebar />
          <main className="main-content">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}