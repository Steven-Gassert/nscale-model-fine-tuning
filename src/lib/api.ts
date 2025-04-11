import { WorkflowFormData } from "@/app/fine-tuning/new/schema";
import axios from "axios";
/**
 * A note about functions and error handling in this file:
 *
 * fetchX() - This are server side functions. In case of error, we should return a response object so that the client can handle gracefully.
 * This is in accordance with Next.js best practices: https://nextjs.org/docs/app/getting-started/error-handling#handling-expected-errors
 *
 * fetchXFromFE() - These are client side functions. Used so that React Query can refetch stale data.
 * In case of error in this function, we should throw the error so that our react query code can handle it properly.
 * https://tanstack.com/query/latest/docs/framework/react/guides/query-functions#handling-and-throwing-errors
 */

export type JobStatus = "Running" | "Completed" | "Failed";

export interface Job {
  id: string;
  name: string;
  baseModel: string;
  epochs: number;
  evaluationEpochs: number;
  warmupEpochs: number;
  learningRate: number;
  date: string;
  createdAt: string;
  status: JobStatus;
}

export interface JobsData {
  jobs: Job[];
  summary: {
    completed: number;
    running: number;
    failed: number;
  };
}

export interface Model {
  id: string;
  displayName: string;
}

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://fe-test-api-production.up.railway.app/api";

// Create axios instance with default config
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": API_KEY || "",
    "Content-Type": "application/json",
  },
});

export type ServerSideResponse<T> =
  | {
      data: T;
      isSuccess: true;
      isError: false;
    }
  | {
      error: string;
      isSuccess: false;
      isError: true;
    };

// Catch errors and return a ServerSideResponse or the data from the Promise passed
async function handleApiRequest<T>(
  request: Promise<{ data: T }>,
  errorMessage: string
): Promise<ServerSideResponse<T>> {
  try {
    const response = await request;
    return {
      data: response.data,
      isSuccess: true,
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      error: errorMessage,
      isSuccess: false,
      isError: true,
    };
  }
}

export async function fetchJobs(): Promise<ServerSideResponse<JobsData>> {
  return handleApiRequest<JobsData>(
    client.get("/jobs"),
    "Failed to fetch jobs"
  );
}

export async function fetchJobsFromFE(): Promise<ServerSideResponse<JobsData>> {
  return handleApiRequest<JobsData>(
    axios.get<JobsData>("/api/jobs"),
    "Failed to fetch jobs"
  );
}

// used when you want to use a function inside of react query. React query expects your promises to reject, so we need to throw an error here
export async function throwOnError<T>(
  request: Promise<ServerSideResponse<T>>
): Promise<T> {
  const response = await request;
  if (response.isError) {
    throw new Error(response.error);
  }
  return response.data;
}

export async function fetchModels(): Promise<ServerSideResponse<Model[]>> {
  return handleApiRequest<Model[]>(
    client.get("/models"),
    "Failed to fetch models"
  );
}

export async function createJob(
  params: WorkflowFormData
): Promise<ServerSideResponse<void>> {
  return handleApiRequest<void>(
    client.post("/jobs", params),
    "Failed to create job"
  );
}
