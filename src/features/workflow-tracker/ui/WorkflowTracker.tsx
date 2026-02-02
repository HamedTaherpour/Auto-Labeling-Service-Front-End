import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatasetWorkflowStats } from "../../../shared/api/dataset-api";
import { CheckCircle, Clock, AlertCircle, PlayCircle } from "lucide-react";

interface WorkflowTrackerProps {
  stats: DatasetWorkflowStats;
  className?: string;
}

interface WorkflowStage {
  key: keyof DatasetWorkflowStats;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}

const workflowStages: WorkflowStage[] = [
  {
    key: "unprocessed",
    label: "Unprocessed",
    icon: Clock,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    glowColor: "shadow-gray-500/20",
  },
  {
    key: "labeling",
    label: "Labeling",
    icon: PlayCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/20",
  },
  {
    key: "review",
    label: "Review",
    icon: AlertCircle,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    glowColor: "shadow-orange-500/20",
  },
  {
    key: "complete",
    label: "Complete",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    glowColor: "shadow-green-500/20",
  },
];

export function WorkflowTracker({ stats, className }: WorkflowTrackerProps) {
  // Find the active stage (stage with the most items, or the first non-zero stage)
  const getActiveStageIndex = () => {
    const stagesWithItems = workflowStages
      .map((stage, index) => ({ index, count: stats[stage.key] }))
      .filter((stage) => stage.count > 0);

    if (stagesWithItems.length === 0) return 0;
    return stagesWithItems[stagesWithItems.length - 1].index;
  };

  const activeStageIndex = getActiveStageIndex();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Card className={`bg-[#0A0A0A] border-[#1A1A1A] ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-[#FF6300]" />
          Workflow Pipeline
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          className="flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {workflowStages.map((stage, index) => {
            const Icon = stage.icon;
            const count = stats[stage.key];
            const isActive = index === activeStageIndex;
            const isCompleted = index < activeStageIndex;

            return (
              <motion.div
                key={stage.key}
                className="flex flex-col items-center flex-1 relative"
                variants={stageVariants}
              >
                {/* Stage Circle */}
                <motion.div
                  className={`
                    relative w-16 h-16 rounded-full border-2 flex items-center justify-center
                    ${stage.bgColor} ${stage.borderColor} ${
                    isActive ? `shadow-lg ${stage.glowColor}` : ""
                  }
                    transition-all duration-300
                  `}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.05, 1],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                      : {}
                  }
                >
                  <Icon className={`h-6 w-6 ${stage.color}`} />

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6300] rounded-full border-2 border-[#0A0A0A]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    />
                  )}

                  {/* Completed checkmark */}
                  {isCompleted && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="h-2 w-2 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Stage Label */}
                <div className="text-center mt-3">
                  <h4 className={`text-sm font-medium ${stage.color}`}>
                    {stage.label}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="mt-1 text-xs bg-[#1A1A1A] border-[#2A2A2A] text-gray-300"
                  >
                    {count}
                  </Badge>
                </div>

                {/* Connection Line (except for last item) */}
                {index < workflowStages.length - 1 && (
                  <motion.div
                    className="absolute top-8 left-full -translate-x-1/2 w-full h-0.5 bg-[#1A1A1A] z-0"
                    style={{ width: "calc(100% - 4rem)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.div
                      className={`h-full ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-[#FF6300]"
                          : "bg-[#1A1A1A]"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : isActive ? 0.6 : 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress Summary */}
        <div className="mt-6 pt-4 border-t border-[#1A1A1A]">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Total Files: {stats.totalFiles}</span>
            <span>
              Progress:{" "}
              {Math.round(
                ((stats.labeling + stats.review + stats.complete) /
                  stats.totalFiles) *
                  100
              )}
              %
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
