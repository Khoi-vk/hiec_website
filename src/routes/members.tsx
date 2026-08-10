import { createFileRoute } from "@tanstack/react-router";

import { MembersSection } from "@/components/members-section";
import { PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/members")({
  component: MembersPage,
});

function MembersPage() {
  return (
    <PublicLayout>
      <MembersSection />
    </PublicLayout>
  );
}
