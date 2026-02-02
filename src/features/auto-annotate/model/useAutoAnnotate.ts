import { useState, useCallback } from 'react';
import { Model } from '@/entities/model';
import { modelApi } from '@/shared/api/model-api';

export interface AutoAnnotateResult {
  success: boolean;
  annotations: any[];
  error?: string;
}

export function useAutoAnnotate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');

  const processFile = useCallback(async (
    fileId: string,
    model: Model,
    confidenceThreshold: number
  ): Promise<AutoAnnotateResult> => {
    try {
      setCurrentFile(fileId);

      // Call the inference API based on model type
      const result = await modelApi.inferFile(fileId, model, confidenceThreshold);

      return {
        success: true,
        annotations: result.annotations || [],
      };
    } catch (error) {
      console.error('Auto-annotation failed for file:', fileId, error);
      return {
        success: false,
        annotations: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }, []);

  const autoAnnotateFiles = useCallback(async (
    fileIds: string[],
    model: Model,
    confidenceThreshold: number,
    onProgress?: (completed: number, total: number, currentFile: string) => void
  ): Promise<AutoAnnotateResult[]> => {
    if (!model || fileIds.length === 0) {
      return [];
    }

    setIsProcessing(true);
    setProgress(0);

    const results: AutoAnnotateResult[] = [];
    const total = fileIds.length;

    for (let i = 0; i < total; i++) {
      const fileId = fileIds[i];
      const result = await processFile(fileId, model, confidenceThreshold);
      results.push(result);

      const completed = i + 1;
      const progressPercent = (completed / total) * 100;
      setProgress(progressPercent);

      onProgress?.(completed, total, fileId);
    }

    setIsProcessing(false);
    setProgress(0);
    setCurrentFile('');

    return results;
  }, [processFile]);

  const autoAnnotateDataset = useCallback(async (
    datasetId: string,
    model: Model,
    confidenceThreshold: number,
    onProgress?: (completed: number, total: number) => void
  ): Promise<AutoAnnotateResult> => {
    try {
      setIsProcessing(true);
      setProgress(0);

      // Call the bulk auto-annotate API
      const result = await modelApi.autoAnnotateDataset(datasetId, model, confidenceThreshold);

      setIsProcessing(false);
      return {
        success: true,
        annotations: result.annotations || [],
      };
    } catch (error) {
      setIsProcessing(false);
      console.error('Dataset auto-annotation failed:', error);
      return {
        success: false,
        annotations: [],
        error: error instanceof Error ? error.message : 'Dataset annotation failed',
      };
    }
  }, []);

  return {
    autoAnnotateFiles,
    autoAnnotateDataset,
    isProcessing,
    progress,
    currentFile,
  };
}