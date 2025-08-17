import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assignment",
  description: "Developed By Tarun Gupta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
