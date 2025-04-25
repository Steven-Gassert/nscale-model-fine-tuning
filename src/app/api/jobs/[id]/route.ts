import { deleteJob } from "@/lib/api";
import { NextResponse } from "next/server";

// Following the exact pattern from Next.js 15 documentation for dynamic route segments
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const response = await deleteJob(id);
    if (response.isError) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
