import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/** UI face for the product shell. */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/**
 * The website typeface.
 *
 * One face for the whole public site — a modern grotesk with a slightly
 * humanist warmth, which is what keeps a very dark, very geometric brand from
 * reading as cold infrastructure. Loaded as a variable font so the display
 * sizes can sit at 600 without the site ever needing a heavier cut; the
 * confidence in the headlines comes from scale and tracking, not weight.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The stylish half of the pairing.
 *
 * Manrope alone is correct but corporate — it states things, it doesn't say
 * them with any character. Instrument Serif italic supplies the other half:
 * a contemporary cut rather than a revival, so it reads as considered rather
 * than costumed. It is licensed to exactly one job on the site — the rotating
 * word in the hero — and never appears at small sizes or in the UI.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#00D47E",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "City App - Tu ciudad, conectada",
    template: "%s | City App",
  },
  description:
    "La plataforma de comercio social que conecta tu ciudad. Descubre tiendas locales, únete a comunidades, encuentra eventos y mucho más.",
  manifest: "/manifest.json",
  applicationName: "City App",
  keywords: [
    "Huesca",
    "comercio local",
    "red social",
    "comunidad",
    "eventos",
    "marketplace",
    "social commerce",
    "España",
  ],
  authors: [{ name: "City App" }],
  creator: "City App",
  publisher: "City App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "City App - Tu ciudad, conectada",
    description: "La plataforma social y de comercio local para tu ciudad",
    type: "website",
    locale: "es_ES",
    siteName: "City App",
  },
  twitter: {
    card: "summary_large_image",
    title: "City App - Tu ciudad, conectada",
    description: "La plataforma social y de comercio local para tu ciudad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  category: "social",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${manrope.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { var t = localStorage.getItem("city-theme"); if (t === "dark") document.documentElement.classList.add("dark"); } catch (e) {}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
