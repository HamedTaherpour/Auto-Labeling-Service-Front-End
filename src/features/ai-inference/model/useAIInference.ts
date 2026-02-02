import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  runVisionInference,
  createVisionJob,
  getVisionJobStatus,
  getVisionJobResult,
} from '@/shared/api';
import {
  InferenceResult,
  VisionTaskType,
  VisionJob,
  VisionJobResult,
} from '@/entities/vision-task';

interface UseAIInferenceOptions {
  onSuccess?: (results: InferenceResult[]) => void;
  onError?: (error: Error) => void;
}

export const useAIInference = (options?: UseAIInferenceOptions) => {
  const [currentJob, setCurrentJob] = useState<VisionJob | null>(null);
  const [inferenceResults, setInferenceResults] = useState<InferenceResult[]>([]);

  // Direct inference mutation (for real-time results)
  const directInferenceMutation = useMutation({
    mutationFn: async ({
      file,
      task,
      model,
      options: inferenceOptions,
    }: {
      file: File;
      task: VisionTaskType;
      model: 'rexomni' | 'florence';
      options?: Parameters<typeof runVisionInference>[3];
    }) => {
      return runVisionInference(file, task, model, inferenceOptions);
    },
    onSuccess: (results) => {
      setInferenceResults(results);
      options?.onSuccess?.(results);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  // Async job creation mutation
  const createJobMutation = useMutation({
    mutationFn: createVisionJob,
    onSuccess: (jobData) => {
      // Start polling for job status
      pollJobStatus(jobData.job_id);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  // Poll job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const job = await getVisionJobStatus(jobId);
      setCurrentJob(job);

      if (job.status === 'completed' && job.has_result) {
        // Job is done, get results
        const result = await getVisionJobResult(jobId);
        setInferenceResults(result.annotations);
        options?.onSuccess?.(result.annotations);
      } else if (job.status === 'failed') {
        options?.onError?.(new Error(job.error || 'Job failed'));
      } else if (job.status === 'processing' || job.status === 'queued') {
        // Continue polling
        setTimeout(() => pollJobStatus(jobId), 2000);
      }
    } catch (error) {
      options?.onError?.(error as Error);
    }
  }, [options]);

  // Smart trigger for point-to-segment (using detection or keypoint)
  const runSmartTrigger = useCallback(
    async (
      file: File,
      point: { x: number; y: number },
      model: 'rexomni' | 'florence' = 'rexomni'
    ) => {
      // For point-to-segment, we'll use detection with a small region around the point
      // In a real implementation, this might use SAM (Segment Anything Model)
      await directInferenceMutation.mutateAsync({
        file,
        task: 'detection',
        model,
        options: {
          // Could add point coordinates as parameters if the API supports it
        },
      });
    },
    [directInferenceMutation]
  );

  // Batch processing for multiple files
  const runBatchProcessing = useCallback(
    async (
      files: File[],
      task: VisionTaskType,
      model: 'rexomni' | 'florence',
      options?: Parameters<typeof runVisionInference>[3]
    ) => {
      const jobs = files.map((file) =>
        createJobMutation.mutateAsync({
          file,
          task,
          model,
          text_input: options?.text_input,
        })
      );

      // Wait for all jobs to be created
      const jobResults = await Promise.all(jobs);
      return jobResults;
    },
    [createJobMutation]
  );

  return {
    // State
    currentJob,
    inferenceResults,
    isLoading: directInferenceMutation.isPending || createJobMutation.isPending,

    // Direct inference
    runInference: directInferenceMutation.mutate,
    runInferenceAsync: directInferenceMutation.mutateAsync,

    // Async jobs
    createJob: createJobMutation.mutate,
    createJobAsync: createJobMutation.mutateAsync,

    // Specialized methods
    runSmartTrigger,
    runBatchProcessing,

    // Error handling
    error: directInferenceMutation.error || createJobMutation.error,
  };
};