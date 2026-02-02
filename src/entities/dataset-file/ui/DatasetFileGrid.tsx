"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DatasetFileCard } from "./DatasetFileCard";
import { DatasetFile } from "../index";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIInference } from "@/features/ai-inference";
import { VisionTaskType } from "@/entities/vision-task";
import { Brain, Zap } from "lucide-react";

interface DatasetFileGridProps {
  files: DatasetFile[];
  datasetId: string;
  isLoading?: boolean;
  className?: string;
}

export function DatasetFileGrid({
  files,
  datasetId,
  isLoading = false,
  className,
}: DatasetFileGridProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [batchTask, setBatchTask] = useState<VisionTaskType>('detection');
  const [showBatchPanel, setShowBatchPanel] = useState(false);

  const { runBatchProcessing, isLoading: isBatchProcessing } = useAIInference({
    onSuccess: () => {
      setSelectedFiles(new Set());
      setShowBatchPanel(false);
    },
  });

  const handleFileSelect = (fileId: string, selected: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (selected) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(new Set(files.map(f => f.id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const handleBatchProcess = async () => {
    const selectedFileObjects = files.filter(f => selectedFiles.has(f.id));
    const fileObjects = selectedFileObjects.map(f => {
      // Convert file URL to File object (simplified - in real app you'd fetch the blob)
      return new File([], f.name, { type: 'image/jpeg' });
    });

    await runBatchProcessing(fileObjects, batchTask, 'rexomni');
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const skeletonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const DatasetFileSkeleton = () => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
      {/* Thumbnail skeleton */}
      <div className="aspect-square bg-[#1A1A1A] rounded-lg mb-3 animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
        <div className="flex justify-between">
          <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-12" />
          <div className="h-3 bg-[#1A1A1A] rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <motion.div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div key={index} variants={skeletonVariants}>
            <DatasetFileSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Batch Processing Panel */}
      {selectedFiles.size > 0 && (
        <Card className="bg-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-5 h-5" />
              Batch AI Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
              </span>
              <select
                value={batchTask}
                onChange={(e) => setBatchTask(e.target.value as VisionTaskType)}
                className="px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-white text-sm"
              >
                <option value="detection">Object Detection</option>
                <option value="ocr">OCR</option>
                <option value="keypoint">Pose Estimation</option>
                <option value="caption">Image Caption</option>
                <option value="caption_grounding">Text Grounding</option>
              </select>
              <Button
                onClick={handleBatchProcess}
                disabled={isBatchProcessing}
                size="sm"
              >
                {isBatchProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Run Batch AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Controls */}
      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedFiles.size === files.length && files.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm text-gray-400 cursor-pointer"
            >
              Select All
            </label>
          </div>
        </div>
      )}

      {/* Files Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {files.map((file) => (
          <motion.div
            key={file.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <DatasetFileCard
              file={file}
              datasetId={datasetId}
              isSelected={selectedFiles.has(file.id)}
              onSelectionChange={(selected) => handleFileSelect(file.id, selected)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
