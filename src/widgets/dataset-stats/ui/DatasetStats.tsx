import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DatasetDetailedStats } from "../../../shared/api/dataset-api";
import { Target, BarChart3, CheckCircle, TrendingUp } from "lucide-react";

interface DatasetStatsProps {
  stats: DatasetDetailedStats;
  className?: string;
}

export function DatasetStats({ stats, className }: DatasetStatsProps) {
  const statItems = [
    {
      title: "Total Annotations",
      value: stats.totalAnnotations.toLocaleString(),
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      progress: Math.min((stats.totalAnnotations / 1000) * 100, 100), // Mock progress based on annotations
    },
    {
      title: "Average Precision",
      value: `${(stats.averagePrecision * 100).toFixed(1)}%`,
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      progress: stats.averagePrecision * 100,
    },
    {
      title: "Review Progress",
      value: `${stats.reviewProgress.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      progress: stats.reviewProgress,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className={`bg-[#0A0A0A] border-[#1A1A1A] ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#FF6300]" />
          Dataset Statistics
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="space-y-3"
              >
                {/* Icon and Title */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`size-6 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-400">
                      {item.title}
                    </h4>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress
                    value={item.progress}
                    className="h-2 bg-[#1A1A1A]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{item.progress.toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Summary */}
        <motion.div
          className="mt-6 pt-4 border-t border-[#1A1A1A]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Files:</span>
              <span className="text-white font-medium">{stats.totalFiles}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Processed:</span>
              <span className="text-white font-medium">
                {stats.processedFiles}
              </span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
