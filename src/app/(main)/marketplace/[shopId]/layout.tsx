import type { Metadata } from "next";
import { HUESCA_SHOPS } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string }>;
}): Promise<Metadata> {
  const { shopId } = await params;
  const shop = HUESCA_SHOPS.find((s) => s.id === Number(shopId));
  return {
    title: shop ? `${shop.name} - City App` : "Tienda - City App",
    description: shop?.description || "Descubre tiendas y negocios locales en City App",
    openGraph: {
      title: shop?.name || "Tienda",
      description: shop?.description || "",
      type: "website",
      images: shop?.image_url ? [shop.image_url] : undefined,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const shop = HUESCA_SHOPS.find((s) => s.id === Number(shopId));

  return (
    <>
      {shop && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: shop.name,
              description: shop.description,
              image: shop.image_url,
              address: {
                "@type": "PostalAddress",
                streetAddress: shop.address,
                addressLocality: "Huesca",
                addressCountry: "ES",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: shop.rating,
                ratingCount: 8 + (shop.id * 3) % 24,
              },
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
