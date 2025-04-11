"use server";
import { redirect } from "next/navigation";
import { WorkflowFormData, workFlowSchema } from "./schema";
import { createJob } from "@/lib/api";

// Redirects on success, returns field errors for form validation or form level error for network or http failure
export async function createNewJob(data: WorkflowFormData): Promise<{
  fieldErrors?: Record<keyof WorkflowFormData, string>;
  formError?: string;
} | void> {
  const result = workFlowSchema.safeParse(data);

  if (!result.success) {
    // Return validation errors in a format React Hook Form can understand
    return {
      fieldErrors: result.error.errors.reduce((acc, curr) => {
        const path = curr.path[0] as keyof WorkflowFormData;
        acc[path] = curr.message;
        return acc;
      }, {} as Record<keyof WorkflowFormData, string>),
    };
  }

  const response = await createJob(result.data);
  console.log("response", response);
  if (response.isError) {
    // return form level error for network or http failure
    return {
      formError: "Unable to create job, please try again later.",
    };
  }

  redirect("/fine-tuning");
}
