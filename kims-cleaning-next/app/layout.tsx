import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/Toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});
const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kimscleaningsupplies.netlify.app"),
  title: {
    default: "Kim's Cleaning Supplies — cleans with just water",
    template: "%s — Kim's Cleaning Supplies",
  },
  description:
    "Kim's Cleaning Cloth: microfiber that cleans glass, granite, screens and windshields with water only. Made in USA. Sold by Kim Schoch and Alice at Iowa and Illinois shows, and here.",
  icons: { icon: "/images/brand/logo-mark.png" },
  openGraph: {
    title: "Kim's Cleaning Supplies",
    description: "Cleans with just water. Made in USA.",
    images: ["/images/brand/hero-earth-full.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${source.variable}`}>
      <body>
        <CartProvider>
          <PromoBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
