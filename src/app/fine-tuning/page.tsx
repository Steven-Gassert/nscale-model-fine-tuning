import { PageLayout } from "@/components/ui/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FeatureCard,
} from "@/components/ui/card";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchJobs, throwOnError } from "@/lib/api";
import { Suspense } from "react";
import { JobsInformation } from "./jobs-information";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { STEP_ORDER } from "./new/create-new-job-form";

export default async function FineTuning() {
  return (
    <PageLayout
      header={
        <div className="flex items-center gap-5">
          <div className="bg-black w-20 h-20 rounded-[20px] flex items-center justify-center">
            <span className="text-white text-4xl font-bold">AI</span>
          </div>
          <div className="text-5xl font-bold">Acme Inc</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FineTuningUsageCard />
        <div>
          <GetStartedCard />
        </div>
      </div>
    </PageLayout>
  );
}

async function FineTuningUsageCard() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["jobs"],
    queryFn: () => throwOnError(fetchJobs()),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Fine-Tuning usage</CardTitle>
        <CardDescription>
          A list of all your model fine tuning jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HydrationBoundary state={dehydratedState}>
          <Suspense fallback={<div>Loading...</div>}>
            <JobsInformation />
          </Suspense>
        </HydrationBoundary>
      </CardContent>
    </Card>
  );
}

function GetStartedCard() {
  return (
    <FeatureCard
      leftContent={
        <div className="bg-slate-100 w-20 h-20 rounded-[20px] flex items-center justify-center">
          <Wrench className="w-10 h-10 text-orange-700" />
        </div>
      }
    >
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
      </CardHeader>
      <CardContent className="mb-4">
        Simple, ready-to-use inference endpoints that are paid for per request.
        No commitments, only pay for what you use wtih Nscale Serverless.
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/fine-tuning/new?step=${STEP_ORDER[0]}`}>New Job</Link>
        </Button>
      </CardFooter>
    </FeatureCard>
  );
}
