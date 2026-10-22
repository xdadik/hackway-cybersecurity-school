import Link from "next/link";
import { formatDate } from "@/lib/format";

export function LegalDocument({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="border-b border-line">
      <div className="container-page py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="heading-md mt-4">{title}</h1>
          <p className="mt-3 text-[0.8125rem] text-ink-muted">
            Last updated {formatDate(updated)}
          </p>

          <p className="body-base mt-7 border-l-2 border-acid/40 pl-4 text-ink-secondary">
            {intro}
          </p>

          <div className="mt-10 space-y-9">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[1.0625rem] font-semibold text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="body-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 text-[0.8125rem] text-ink-muted">
            Questions about this document?{" "}
            <Link href="/" className="link-underline">
              Return to Hackway Academy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
