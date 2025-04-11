"use client";
import { ErrorMessage } from "@/components/ui/errorMessage";
// In the future, I would implement more fine grained unexpected error boundaries

import { PageLayout } from "@/components/ui/page-layout";

export default function GlobalError({ error }: { error: Error }) {
  console.error("There was an unexpected error: ", error);
  return (
    <PageLayout>
      <ErrorMessage error="There was an unexpected error, we're investigating this now" />
    </PageLayout>
  );
}
