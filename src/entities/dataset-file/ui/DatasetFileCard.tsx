import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatasetFile } from "../index";
import { Image, Video, FileText, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatasetFileCardProps {
  file: DatasetFile;
  datasetId: string;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  className?: string;
}

const statusConfig = {
  Unprocessed: {
    variant: "secondary" as const,
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
  Labeling: {
    variant: "secondary" as const,
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  Review: {
    variant: "secondary" as const,
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  Complete: {
    variant: "secondary" as const,
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
};

export function DatasetFileCard({
  file,
  datasetId,
  isSelected = false,
  onSelectionChange,
  className,
}: DatasetFileCardProps) {
  const router = useRouter();
  const statusConfigData = statusConfig[file.status];

  const handleAnnotate = () => {
    router.push(`/dashboard/datasets/${datasetId}/files/${file.id}/annotate`);
  };

  const handleReview = () => {
    router.push(`/dashboard/datasets/${datasetId}/files/${file.id}/review`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    switch (file.type) {
      case "image":
        return <Image className="h-8 w-8 text-gray-400" />;
      case "video":
        return <Video className="h-8 w-8 text-gray-400" />;
      default:
        return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <Card
      className={cn(
        "bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#FF6300]/30 transition-colors",
        className,
      )}
    >
      <CardContent className="p-4">
        {/* Selection Checkbox */}
        {onSelectionChange && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelectionChange}
              className="bg-black/50 border-white/30"
            />
          </div>
        )}

        {/* Thumbnail */}
        <div className="aspect-square bg-[#1A1A1A] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for thumbnail - in real app, use Next.js Image */}
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
            {getFileIcon()}
          </div>

          {/* Status Badge */}
          <Badge
            variant={statusConfigData.variant}
            className={cn(
              "absolute top-2 right-2 text-xs font-medium border",
              statusConfigData.className,
            )}
          >
            {file.status}
          </Badge>
        </div>

        {/* File Info */}
        <div className="space-y-2">
          <h4
            className="text-sm font-medium text-white truncate"
            title={file.name}
          >
            {file.name}
          </h4>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatFileSize(file.size)}</span>
            <span>{file.annotations} annotations</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={handleAnnotate}
            className="flex-1 bg-[#FF6300] hover:bg-[#FF6300]/90 text-white text-xs"
          >
            Annotate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReview}
            className="flex-1 border-[#1A1A1A] text-gray-300 hover:bg-[#1A1A1A] text-xs"
          >
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
