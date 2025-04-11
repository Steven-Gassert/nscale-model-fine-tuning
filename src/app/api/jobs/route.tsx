import { fetchJobs } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetchJobs();
    if (response.isError) {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching jobs:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
