"use server";
import { fetchModels } from "@/lib/api";
import { CreateNewJobForm } from "./create-new-job-form";

export default async function NewFineTuningJob() {
  const modelsPromise = fetchModels();
  return <CreateNewJobForm modelsPromise={modelsPromise} />;
}
