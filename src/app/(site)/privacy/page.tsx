import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hackway Academy handles account and learning data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updated="2026-10-12T00:00:00.000Z"
      intro="This policy describes what Hackway Academy stores when you create an account, enrol in a course and watch lessons. It applies to the data handled by this website."
      sections={[
        {
          heading: "Data we store",
          body: [
            "Account data: your display name, email address, a securely hashed password, and the date your account was created. Your password is never stored in plain text and cannot be read back.",
            "Learning data: which courses you have enrolled in, which lessons you have completed, and the playback position of the lesson you are watching so you can resume where you stopped.",
            "Session data: a single signed session identifier stored in an HTTP-only cookie so that signing in works across pages.",
          ],
        },
        {
          heading: "How the data is used",
          body: [
            "Account data identifies your session and lets you manage your own profile. Learning data is used only to show your progress, resume lessons and list the courses you have enrolled in.",
            "Your learning data is private. There are no public student profiles, no community features and no sharing of your information with other students.",
          ],
        },
        {
          heading: "Video delivery",
          body: [
            "Lesson video files are stored outside the public web folder and served through an access-controlled streaming endpoint. Requests for restricted lessons are checked on the server against your enrollment before any bytes of media are sent.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "A single essential cookie stores your session identifier. It is HTTP-only, is scoped to this site, and is removed when you sign out or when the session expires. It is not used for advertising or cross-site tracking.",
          ],
        },
        {
          heading: "Retention and deletion",
          body: [
            "Enrollments and lesson progress are kept for as long as your account exists so that your progress remains accurate. Signing out clears the session cookie; deleting your account removes your enrollments and lesson progress.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "For questions about this policy, contact the Hackway Academy operator through the contact details published on this site.",
          ],
        },
      ]}
    />
  );
}
