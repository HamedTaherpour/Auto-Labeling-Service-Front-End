import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore } from "../../../shared/store/review-store";
import { CheckCircle, XCircle, MessageSquare, Eye, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewControlsProps {
  className?: string;
}

export function ReviewControls({ className }: ReviewControlsProps) {
  const {
    reviewDecision,
    reviewComments,
    isLoading,
    setReviewDecision,
    submitReview,
    setReviewMode,
    reviewMode,
  } = useReviewStore();

  const [showComments, setShowComments] = useState(false);

  const handleDecision = (
    decision: "approve" | "reject" | "request_changes",
  ) => {
    setReviewDecision(decision);
    setShowComments(true);
  };

  const handleSubmit = async () => {
    await submitReview();
    setShowComments(false);
  };

  const handleCancel = () => {
    setReviewDecision(null);
    setShowComments(false);
  };

  const toggleCorrectionMode = () => {
    setReviewMode(true, reviewMode === "correction" ? "view" : "correction");
  };

  return (
    <div
      className={cn(
        "bg-[#0A0A0A]/95 backdrop-blur-sm border border-[#1A1A1A] rounded-lg p-4 min-w-80",
        className,
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Review Controls</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCorrectionMode}
            className={cn(
              "text-xs",
              reviewMode === "correction"
                ? "text-[#FF6300] hover:text-[#FF6300]/90"
                : "text-gray-400 hover:text-white",
            )}
          >
            {reviewMode === "correction" ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                View Mode
              </>
            ) : (
              <>
                <Edit className="h-3 w-3 mr-1" />
                Correction Mode
              </>
            )}
          </Button>
        </div>

        {/* Decision Buttons */}
        {!reviewDecision && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleDecision("approve")}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>

            <Button
              onClick={() => handleDecision("reject")}
              variant="destructive"
              disabled={isLoading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>

            <Button
              onClick={() => handleDecision("request_changes")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Changes
            </Button>
          </div>
        )}

        {/* Comments Section */}
        {reviewDecision && showComments && (
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <span className="font-medium capitalize">
                {reviewDecision.replace("_", " ")}
              </span>{" "}
              Comments:
            </div>

            <Textarea
              placeholder="Add review comments..."
              value={reviewComments}
              onChange={(e) =>
                setReviewDecision(reviewDecision, e.target.value)
              }
              className="bg-[#1A1A1A] border-[#2A2A2A] text-white resize-none"
              rows={3}
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#FF6300] hover:bg-[#FF6300]/90 flex-1"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>

              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-[#2A2A2A] text-gray-400 hover:bg-[#1A1A1A]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {reviewDecision && !showComments && (
          <div className="text-center py-2">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                {
                  "bg-green-500/20 text-green-400":
                    reviewDecision === "approve",
                  "bg-red-500/20 text-red-400": reviewDecision === "reject",
                  "bg-orange-500/20 text-orange-400":
                    reviewDecision === "request_changes",
                },
              )}
            >
              {reviewDecision === "approve" && (
                <CheckCircle className="h-4 w-4" />
              )}
              {reviewDecision === "reject" && <XCircle className="h-4 w-4" />}
              {reviewDecision === "request_changes" && (
                <MessageSquare className="h-4 w-4" />
              )}
              {reviewDecision.replace("_", " ").toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
