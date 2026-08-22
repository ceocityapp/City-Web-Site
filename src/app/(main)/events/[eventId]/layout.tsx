import type { Metadata } from "next";
import { HUESCA_EVENTS } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = HUESCA_EVENTS.find((e) => e.id === Number(eventId));
  return {
    title: event ? `${event.title} - City App` : "Evento - City App",
    description: event?.description || "Descubre eventos en City App",
    openGraph: {
      title: event?.title || "Evento",
      description: event?.description || "",
      type: "article",
      images: event?.image ? [event.image] : undefined,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = HUESCA_EVENTS.find((e) => e.id === Number(eventId));

  return (
    <>
      {event && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: event.title,
              description: event.description,
              image: event.image,
              location: {
                "@type": "Place",
                name: event.location,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Huesca",
                  addressCountry: "ES",
                },
              },
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
