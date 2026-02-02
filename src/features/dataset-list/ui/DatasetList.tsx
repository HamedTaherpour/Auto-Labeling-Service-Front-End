"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DatasetCard } from "../../../entities/dataset";
import { datasetApi, Dataset } from "../../../shared/api";
import { Search, Filter } from "lucide-react";

export function DatasetList() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const data = await datasetApi.getDatasets();
        setDatasets(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
        // For demo purposes, we'll keep the mock data
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch =
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dataset.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);
      const matchesStatus =
        statusFilter === "all" || dataset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [datasets, searchQuery, statusFilter]);

  const DatasetSkeleton = () => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-full bg-[#1A1A1A]" />
        </div>
        <Skeleton className="h-6 w-20 bg-[#1A1A1A]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-[#1A1A1A]" />
        <Skeleton className="h-2 w-full bg-[#1A1A1A]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-8 w-full bg-[#1A1A1A]" />
        <Skeleton className="h-8 w-full bg-[#1A1A1A]" />
      </div>
      <div className="flex justify-between pt-2 border-t border-[#1A1A1A]">
        <Skeleton className="h-6 w-24 bg-[#1A1A1A]" />
        <Skeleton className="h-6 w-24 bg-[#1A1A1A]" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0A0A0A] border-[#1A1A1A] text-white placeholder-gray-400 focus:border-[#FF6300]/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-[#0A0A0A] border-[#1A1A1A] text-white focus:border-[#FF6300]/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A]">
              <SelectItem
                value="all"
                className="text-white hover:bg-[#1A1A1A] focus:bg-[#1A1A1A]"
              >
                All Status
              </SelectItem>
              <SelectItem
                value="In Progress"
                className="text-white hover:bg-[#1A1A1A] focus:bg-[#1A1A1A]"
              >
                In Progress
              </SelectItem>
              <SelectItem
                value="Completed"
                className="text-white hover:bg-[#1A1A1A] focus:bg-[#1A1A1A]"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="Annotating"
                className="text-white hover:bg-[#1A1A1A] focus:bg-[#1A1A1A]"
              >
                Annotating
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        {loading
          ? "Loading datasets..."
          : `Showing ${filteredDatasets.length} of ${datasets.length} datasets`}
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeleton loading states
          Array.from({ length: 6 }).map((_, index) => (
            <DatasetSkeleton key={index} />
          ))
        ) : filteredDatasets.length > 0 ? (
          filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              onClick={() => router.push(`/dashboard/datasets/${dataset.id}`)}
              className="cursor-pointer"
            >
              <DatasetCard dataset={dataset} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-1">
                No datasets found
              </h3>
              <p className="text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No datasets are available at the moment."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
