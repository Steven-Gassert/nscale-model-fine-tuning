"use server";
import { fetchModels } from "@/lib/api";
import { CreateNewJobForm } from "./create-new-job-form";
import { Suspense } from "react";

export default async function NewFineTuningJob() {
  const modelsPromise = fetchModels();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewJobForm modelsPromise={modelsPromise} />
    </Suspense>
  );
}
