import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { runRexOmniOCR } from '@/shared/api';
import { OCRResult } from '@/entities/vision-task';

export const useOCRScanner = () => {
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);

  const ocrMutation = useMutation({
    mutationFn: async ({
      file,
      outputFormat = 'Box',
      granularity = 'Word Level',
    }: {
      file: File;
      outputFormat?: string;
      granularity?: string;
    }) => {
      return runRexOmniOCR(file, outputFormat, granularity);
    },
    onSuccess: (response) => {
      // Transform the response to match our OCRResult type
      const results: OCRResult[] = response.results.map((result: any) => ({
        text: result.text,
        score: result.score,
        bbox: {
          x: result.bbox[0],
          y: result.bbox[1],
          width: result.bbox[2] - result.bbox[0],
          height: result.bbox[3] - result.bbox[1],
        },
      }));
      setOcrResults(results);
    },
  });

  return {
    ocrResults,
    scanDocument: ocrMutation.mutate,
    scanDocumentAsync: ocrMutation.mutateAsync,
    isScanning: ocrMutation.isPending,
    error: ocrMutation.error,
    clearResults: () => setOcrResults([]),
  };
};