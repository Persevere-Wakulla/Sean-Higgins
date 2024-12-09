
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prometheus",
  description: "Prometheus Banking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-gray-500  to-gray-900 from-5%  ">
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-400  to-transparent to-20% ">
          {children}
        </div>
      </body>
    </html>
  );
}
