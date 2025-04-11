"use client";
import { PageLayout } from "@/components/ui/page-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { CreateNewJobForm } from "./create-new-job-form";
import { ArrowLeft } from "lucide-react";

export const STEP_IDS = {
  SET_UP: "set-up",
  CONFIGURE: "configure",
  REVIEW: "review",
} as const;

export const STEP_ORDER = [
  STEP_IDS.SET_UP,
  STEP_IDS.CONFIGURE,
  STEP_IDS.REVIEW,
] as const;

export default function NewFineTuningJob() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get("step");
  const currentStepIndex = currentStepId
    ? STEP_ORDER.indexOf(currentStepId as (typeof STEP_ORDER)[number])
    : -1;

  // Handle initial navigation if no step is specified
  useEffect(() => {
    if (!currentStepId) {
      router.push(`/fine-tuning/new?step=${STEP_ORDER[0]}`);
    }
  }, [currentStepId, router]);

  const handleBack = () => {
    if (currentStepIndex > 0) {
      // Navigate to previous step
      const previousStepId = STEP_ORDER[currentStepIndex - 1];
      router.push(`/fine-tuning/new?step=${previousStepId}`);
    } else {
      // Navigate back to fine-tuning page
      router.push("/fine-tuning");
    }
  };

  const Header = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="hover:bg-accent/50"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <div className="text-sm text-muted-foreground">Fine-tuning</div>
          <div className="text-xl font-semibold">Fine-tune a model</div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout header={<Header />}>
      <CreateNewJobForm />
    </PageLayout>
  );
}
