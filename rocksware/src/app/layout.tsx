import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Rocksware — Premium Footwear",
  description: "Premium footwear for the discerning individual.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A0A0A",
              color: "#F5F0E8",
              fontFamily: "Jost, sans-serif",
              fontSize: "13px",
              letterSpacing: "0.05em",
            },
          }}
        />
      </body>
    </html>
  );
}