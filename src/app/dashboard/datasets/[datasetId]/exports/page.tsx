"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { ExportsWidget } from "@/widgets/exports";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import { exportApi, type ExportVersion } from "@/entities/export-release";
import { datasetApi, type Dataset } from "@/shared/api";

export default function DatasetExportsPage() {
    const params = useParams();
    const router = useRouter();
    const datasetId = params.datasetId as string;

    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [exports, setExports] = useState<ExportVersion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [datasetData, exportsData] = await Promise.all([
                    datasetApi.getDataset(datasetId),
                    exportApi.getExports(datasetId),
                ]);

                setDataset(datasetData);
                setExports(exportsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Redirect to dataset details if not found
                router.push(`/dashboard/datasets/${datasetId}`);
            } finally {
                setLoading(false);
            }
        };

        if (datasetId) {
            fetchData();
        }
    }, [datasetId, router]);

    const handleRefresh = async () => {
        try {
            const exportsData = await exportApi.getExports(datasetId);
            setExports(exportsData);
        } catch (error) {
            console.error("Failed to refresh exports:", error);
        }
    };

    const breadcrumbItems = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Datasets", href: "/dashboard" },
        {
            label: dataset?.name || "Loading...",
            href: `/dashboard/datasets/${datasetId}`,
        },
        {
            label: "Exports",
            href: `/dashboard/datasets/${datasetId}/exports`,
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
                                onClick={() => router.push(`/dashboard/datasets/${datasetId}`)}
                                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dataset
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
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Page Title and Description */}
                        <div className="mb-8">
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-64 bg-[#1A1A1A]" />
                                    <Skeleton className="h-4 w-96 bg-[#1A1A1A]" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Dataset Exports
                                    </h1>
                                    <p className="text-gray-400 text-lg">
                                        Manage export versions for {dataset?.name}. Create new exports
                                        and download your ground-truth data in various formats.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Exports Widget */}
                        <ExportsWidget
                            datasetId={datasetId}
                            exports={exports}
                            onRefresh={handleRefresh}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}