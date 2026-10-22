import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use Hackway Academy.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      updated="2026-10-12T00:00:00.000Z"
      intro="These terms apply when you create an account, enrol in a course and use the Hackway Academy learning platform."
      sections={[
        {
          heading: "Your account",
          body: [
            "You are responsible for the activity that happens under your account and for keeping your credentials confidential. Tell us promptly if you believe your account has been accessed by someone else.",
            "Account details must be accurate. Accounts may be suspended if they are used to share, resell or distribute course material, or to interfere with the platform or other students.",
          ],
        },
        {
          heading: "Course content and enrolment",
          body: [
            "Enrolling in a course grants you a personal, non-transferable licence to watch the lessons included in it. Course material may not be redistributed, recorded or published elsewhere.",
            "Some courses are marked as demonstration content. Where a lesson shows sample media, the lesson description and the player make that clear, and the material may be replaced before the course is published.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Free courses require no payment. Where a course is priced, enrolment is only completed once a payment provider processes the transaction, and a receipt is issued by that provider.",
            "If no payment provider is configured for a priced course, the platform will say so rather than simulate a purchase.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Do not attempt to access lesson media for courses you have not enrolled in, probe the streaming endpoints, or interfere with the availability of the service for other students.",
            "The academy provides general cybersecurity education. It is not a substitute for professional advice, and it is not a route to any certification or employment outcome.",
          ],
        },
        {
          heading: "Availability",
          body: [
            "Courses, lessons and durations may change as material is revised. Progress you have completed is preserved when content changes, and lessons that are removed are excluded from future progress calculations.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "When these terms change, the updated date at the top of this page is updated. Continuing to use the platform after a change means you accept the revised terms.",
          ],
        },
      ]}
    />
  );
}
