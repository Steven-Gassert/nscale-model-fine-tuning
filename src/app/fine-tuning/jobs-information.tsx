"use client";

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchJobsFromFE, throwOnError, deleteJobFromFE } from "@/lib/api";
import type { JobsData } from "@/lib/api";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FeatureCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDistanceToNow } from "date-fns";
import { ClipboardCopy, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../providers";
import { Button } from "@/components/ui/button";

export function useJobs() {
  return useSuspenseQuery<JobsData>({
    queryKey: ["jobs"],
    queryFn: () => throwOnError(fetchJobsFromFE()),
    refetchInterval: (query) => {
      const runningJobs = query.state.data?.summary?.running ?? 0;
      // If there are running jobs, refetch every 5 seconds
      if (runningJobs > 0) {
        return 5000;
      }
      // Otherwise, don't refetch automatically
      return false;
    },
  });
}

function JobChart() {
  const { isError, data } = useJobs();
  if (isError) {
    throw new Error("Error fetching jobs, please try again later.");
  }

  const COLORS = {
    running: "#1D4ED8",
    completed: "#15803D",
    failed: "#B91C1C",
  };

  // Transform jobs data for the chart
  const chartData = [
    {
      name: "Running",
      value: data.summary?.running || 0,
      color: COLORS.running,
    },
    {
      name: "Completed",
      value: data.summary?.completed || 0,
      color: COLORS.completed,
    },
    { name: "Failed", value: data.summary?.failed || 0, color: COLORS.failed },
  ];

  const StatusSection = ({
    status,
    count,
    color,
  }: {
    status: string;
    count: number;
    color: string;
  }) => (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium">{status}</span>
      <span className="text-muted-foreground">{count} jobs</span>
    </div>
  );

  return (
    <FeatureCard
      leftContent={
        <div className="min-w-[200px] min-h-[200px] w-full h-full">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Job Status</h3>
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <StatusSection
              key={index}
              status={item.name}
              count={item.value}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </FeatureCard>
  );
}

function JobTable() {
  const { data, isError } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await deleteJobFromFE(jobId);
      if (response.isError) {
        throw new Error(response.error);
      }
      return jobId;
    },
    onSuccess: (jobId) => {
      // Invalidate and refetch jobs
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      addNotification(
        "Job deleted",
        `Job ${jobId} was successfully deleted`,
        "success"
      );
    },
    onError: (error) => {
      // Show error notification
      addNotification(
        "Failed to delete job",
        error instanceof Error ? error.message : "An unknown error occurred",
        "error"
      );
    },
  });

  const handleDelete = (jobId: string) => {
    deleteMutation.mutate(jobId);
  };

  const handleCopyToClipboard = (jobId: string) => {
    navigator.clipboard.writeText(jobId).then(() => {
      setCopiedId(jobId);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    });
  };

  if (isError) {
    throw new Error("Error fetching jobs, please try again later.");
  }

  const totalPages = Math.ceil(data.jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = data.jobs.slice(startIndex, endIndex);

  const handlePageClick = (page: number) => () => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>List of fine-tuning jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentJobs.map((job) => {
            const isDeleting =
              deleteMutation.isPending && deleteMutation.variables === job.id;
            const isCopied = copiedId === job.id;

            return (
              <TableRow
                key={job.id}
                className={isDeleting ? "opacity-50 italic" : ""}
              >
                <TableCell className="font-mono flex items-center gap-2">
                  {job.id}
                  <button
                    className="opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => handleCopyToClipboard(job.id)}
                    title="Copy job ID to clipboard"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(job.createdAt))} ago
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      job.status.toLowerCase() as
                        | "running"
                        | "completed"
                        | "failed"
                    }
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                    disabled={isDeleting}
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePageClick(Math.max(1, currentPage - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={handlePageClick(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handlePageClick(Math.min(totalPages, currentPage + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export function JobsInformation() {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage error="Error fetching jobs, please try again later." />
      }
    >
      <JobChart />
      <JobTable />
    </ErrorBoundary>
  );
}
