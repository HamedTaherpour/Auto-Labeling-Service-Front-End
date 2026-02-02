"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { WorkflowTracker } from "@/features/workflow-tracker";
import { DatasetStats } from "@/widgets/dataset-stats";
import { DatasetFileGrid } from "@/entities/dataset-file";
import { DatasetCard } from "@/entities/dataset";
import { ItemFilters } from "@/features/item-filters";
import {
  datasetApi,
  Dataset,
  DatasetWorkflowStats,
  DatasetDetailedStats,
  DatasetFile,
} from "@/shared/api";
import { ItemFilters as ItemFiltersType } from "@/entities/property";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Home, ChevronRight, Download, Settings } from "lucide-react";
import Link from "next/link";

export default function DatasetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.datasetId as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [workflowStats, setWorkflowStats] =
    useState<DatasetWorkflowStats | null>(null);
  const [detailedStats, setDetailedStats] =
    useState<DatasetDetailedStats | null>(null);
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ItemFiltersType>({
    filters: [],
    operator: 'AND',
  });

  useEffect(() => {
    const fetchDatasetData = async () => {
      try {
        setLoading(true);

        const [datasetData, workflowData, statsData, filesData] =
          await Promise.all([
            datasetApi.getDataset(datasetId),
            datasetApi.getDatasetWorkflowStats(datasetId),
            datasetApi.getDatasetDetailedStats(datasetId),
            datasetApi.getDatasetFiles(datasetId),
          ]);

        setDataset(datasetData);
        setWorkflowStats(workflowData);
        setDetailedStats(statsData);
        setFiles(filesData);
      } catch (error) {
        console.error("Failed to fetch dataset data:", error);
        // Redirect to datasets list if dataset not found
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (datasetId) {
      fetchDatasetData();
    }
  }, [datasetId, router]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Datasets", href: "/dashboard" },
    {
      label: dataset?.name || "Loading...",
      href: `/dashboard/datasets/${datasetId}`,
      current: true,
    },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Breadcrumbs */}
        <div className="border-b border-[#1A1A1A]">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Datasets
              </Button>
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              {breadcrumbItems.map((item, index) => (
                <div
                  key={`${item.href}-${index}`}
                  className="flex items-center"
                >
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                  {item.icon ? (
                    <item.icon className="h-4 w-4" />
                  ) : (
                    <span
                      className={
                        index === breadcrumbItems.length - 1 ? "text-white" : ""
                      }
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Dataset Overview */}
            <div>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64 bg-[#1A1A1A]" />
                  <Skeleton className="h-4 w-96 bg-[#1A1A1A]" />
                </div>
              ) : dataset ? (
                <div className="mb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {dataset.name}
                      </h1>
                      <p className="text-gray-400 text-lg">{dataset.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/datasets/${datasetId}/settings`}>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/dashboard/datasets/${datasetId}/exports`}>
                          <Download className="w-4 h-4 mr-2" />
                          Manage Exports
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Stats and Workflow Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dataset Stats */}
              <div className="lg:col-span-1">
                {loading ? (
                  <Skeleton className="h-64 w-full bg-[#1A1A1A]" />
                ) : detailedStats ? (
                  <DatasetStats stats={detailedStats} />
                ) : null}
              </div>

              {/* Workflow Tracker */}
              <div className="lg:col-span-2">
                {loading ? (
                  <Skeleton className="h-64 w-full bg-[#1A1A1A]" />
                ) : workflowStats ? (
                  <WorkflowTracker stats={workflowStats} />
                ) : null}
              </div>
            </div>

            {/* Dataset Card Preview */}
            {dataset && (
              <div className="max-w-md">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Dataset Overview
                </h2>
                <DatasetCard dataset={dataset} />
              </div>
            )}

            {/* Item Filters */}
            <ItemFilters
              datasetId={datasetId}
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Files Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Dataset Files
                </h2>
                <div className="text-sm text-gray-400">
                  {loading ? "Loading..." : `${files.length} files`}
                </div>
              </div>

              <DatasetFileGrid
                files={files}
                datasetId={datasetId}
                isLoading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
