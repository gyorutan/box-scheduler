import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const font = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Box Scheduler",
  description: "Kasinoki Box Reservation System",
  icons: {
    icon: ["image/png", "/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster toastOptions={{ position: "top-right", duration: 2000 }} />
        {children}
      </body>
    </html>
  );
}
