import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { VisionJobStatus } from "../index";

interface VisionStatusProps {
  status: VisionJobStatus;
  progress?: number;
  className?: string;
}

const statusConfig = {
  queued: {
    variant: "secondary" as const,
    label: "Queued",
    icon: null,
  },
  processing: {
    variant: "default" as const,
    label: "Processing",
    icon: <Spinner className="w-3 h-3 mr-1" />,
  },
  completed: {
    variant: "default" as const,
    label: "Completed",
    icon: null,
  },
  failed: {
    variant: "destructive" as const,
    label: "Failed",
    icon: null,
  },
};

export const VisionStatus = ({ status, progress, className }: VisionStatusProps) => {
  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {config.label}
      </Badge>
      {status === 'processing' && progress !== undefined && (
        <span className="text-sm text-muted-foreground">
          {progress}%
        </span>
      )}
    </div>
  );
};