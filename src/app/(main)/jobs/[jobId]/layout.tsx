import type { Metadata } from "next";
import { HUESCA_JOBS } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const job = HUESCA_JOBS.find((j) => j.id === Number(jobId));
  return {
    title: job ? `${job.title} - City App` : "Trabajo - City App",
    description: job?.body || "Descubre ofertas de empleo en City App",
    openGraph: {
      title: job?.title || "Trabajo",
      description: job?.body || "",
      type: "article",
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = HUESCA_JOBS.find((j) => j.id === Number(jobId));

  return (
    <>
      {job && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: job.title,
              description: job.body,
              hiringOrganization: {
                "@type": "Organization",
                name: job.company,
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: job.location || "Huesca",
                  addressCountry: "ES",
                },
              },
              ...(job.salary && {
                baseSalary: {
                  "@type": "MonetaryAmount",
                  currency: "EUR",
                  value: { "@type": "QuantitativeValue", value: job.salary, unitText: "MONTH" },
                },
              }),
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
