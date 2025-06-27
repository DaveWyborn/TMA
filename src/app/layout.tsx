import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tailor Made Analytics",
  description: "Providing expert analytics and consent management solutions.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="root-body">
        {children}
      </body>
    </html>
  );
}
