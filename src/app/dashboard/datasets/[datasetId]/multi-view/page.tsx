"use client";

import { useParams, useRouter } from "next/navigation";
import { MultiViewAnnotationEditor } from "@/widgets/annotation-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid3X3 } from "lucide-react";

export default function MultiViewPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.datasetId as string;

  const handleBack = () => {
    router.push(`/dashboard/datasets/${datasetId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dataset
              </Button>

              <div className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-[#FF6300]" />
                <h1 className="text-xl font-semibold">Multi-View Annotation</h1>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              Dataset: {datasetId}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <MultiViewAnnotationEditor
          datasetId={datasetId}
          className="max-w-none"
        />
      </div>
    </div>
  );
}