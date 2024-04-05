import { Inter } from "next/font/google";
import "./globals.css";
// import socket from "@/socket/socket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Background-Verification-Portal",
  description: "Generated by create next app",
  icons: {
    // icon: ["/assets/favicon.ico?v=4"],
 
  },
};

export default function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}