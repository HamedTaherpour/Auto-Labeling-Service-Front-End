"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnnotationEditor } from "@/widgets/annotation-editor";
import { AnnotationComments } from "@/features/annotation-comments";
import { useReviewStore } from "@/shared/store/review-store";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.datasetId as string;
  const fileId = params.fileId as string;

  const {
    isReviewMode,
    setCurrentFile,
    setReviewMode,
    loadFileData,
    toggleConsensus,
    showConsensus,
  } = useReviewStore();

  useEffect(() => {
    // Initialize review mode
    setCurrentFile(fileId, datasetId);
    setReviewMode(true, "view");
    // Load file data
    loadFileData(fileId, datasetId);
  }, [fileId, datasetId, setCurrentFile, setReviewMode, loadFileData]);

  const handleBack = () => {
    router.push(`/dashboard/datasets/${datasetId}`);
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] text-white hover:bg-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dataset
        </Button>
      </div>

      {/* Consensus Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          onClick={toggleConsensus}
          className={cn(
            "bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] text-white",

            showConsensus && "bg-[#FF6300]/20 border-[#FF6300]/50",
          )}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showConsensus ? "Hide Consensus" : "Show Consensus"}
        </Button>
      </div>

      {/* Main Editor */}
      <AnnotationEditor
        fileId={fileId}
        imageUrl={`/api/files/${fileId}`} // This would be the actual image URL
        datasetId={datasetId}
        reviewMode={isReviewMode}
      />

      {/* Comments Panel */}
      <div className="absolute right-4 top-20 bottom-4 w-80 z-40">
        <AnnotationComments />
      </div>
    </div>
  );
}
