"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { PropertySchemaManager } from "@/features/manage-properties";
import { datasetApi, Dataset } from "@/shared/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function DatasetSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.datasetId as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        const datasetData = await datasetApi.getDataset(datasetId);
        setDataset(datasetData);
      } catch (error) {
        console.error('Failed to load dataset:', error);
      } finally {
        setLoading(false);
      }
    };

    if (datasetId) {
      fetchDataset();
    }
  }, [datasetId]);

  const handleBack = () => {
    router.push(`/dashboard/datasets/${datasetId}`);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#1A1A1A] px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dataset
            </Button>

            <div className="h-6 w-px bg-[#1A1A1A]" />

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#1A1A1A]" />
                <Skeleton className="h-4 w-48 bg-[#1A1A1A]" />
              </div>
            ) : dataset ? (
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Dataset Settings
                </h1>
                <p className="text-sm text-gray-400">{dataset.name}</p>
              </div>
            ) : null}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 bg-[#1A1A1A]" />
                <Skeleton className="h-32 w-full bg-[#1A1A1A]" />
                <Skeleton className="h-64 w-full bg-[#1A1A1A]" />
              </div>
            ) : dataset ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Dataset Configuration
                  </h2>
                  <p className="text-gray-400">
                    Configure custom metadata properties and settings for your dataset.
                  </p>
                </div>

                <PropertySchemaManager />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Dataset not found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}