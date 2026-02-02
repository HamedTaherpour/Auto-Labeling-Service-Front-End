import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOCRScanner } from '../useOCRScanner';
import { FileText, Scan, Copy, Download } from 'lucide-react';
import { OCRResult } from '@/entities/vision-task';

interface OCRScannerProps {
  currentFile?: File;
  imageUrl?: string;
  onResultsHighlight?: (results: OCRResult[]) => void;
  className?: string;
}

export const OCRScanner = ({
  currentFile,
  imageUrl,
  onResultsHighlight,
  className,
}: OCRScannerProps) => {
  const [outputFormat, setOutputFormat] = useState('Box');
  const [granularity, setGranularity] = useState('Word Level');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    ocrResults,
    scanDocument,
    isScanning,
    error,
    clearResults,
  } = useOCRScanner();

  const handleScan = async () => {
    if (!currentFile && !fileInputRef.current?.files?.[0]) return;

    const fileToScan = currentFile || fileInputRef.current!.files![0];

    scanDocument({
      file: fileToScan,
      outputFormat,
      granularity,
    });
  };

  const handleCopyText = () => {
    const allText = ocrResults.map(result => result.text).join(' ');
    navigator.clipboard.writeText(allText);
  };

  const handleDownloadText = () => {
    const allText = ocrResults.map(result => result.text).join('\n');
    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocr-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const allText = ocrResults.map(result => result.text).join(' ');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          OCR Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload (if no current file) */}
        {!currentFile && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Document</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-white text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FF6300] file:text-white"
            />
          </div>
        )}

        {/* OCR Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Format</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-white text-sm"
            >
              <option value="Box">Box</option>
              <option value="Line">Line</option>
              <option value="Word">Word</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Granularity</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-white text-sm"
            >
              <option value="Word Level">Word Level</option>
              <option value="Line Level">Line Level</option>
              <option value="Block Level">Block Level</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleScan}
            disabled={isScanning || (!currentFile && !fileInputRef.current?.files?.[0])}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4 mr-2" />
                Scan Document
              </>
            )}
          </Button>
          {ocrResults.length > 0 && (
            <Button variant="outline" onClick={clearResults}>
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        {ocrResults.length > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {ocrResults.length} text region{ocrResults.length !== 1 ? 's' : ''} detected
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyText}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadText}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        {/* OCR Results */}
        {ocrResults.length > 0 && (
          <div className="space-y-3">
            <Textarea
              value={allText}
              readOnly
              className="min-h-32 bg-[#1A1A1A] border-[#2A2A2A] text-white"
              placeholder="Extracted text will appear here..."
            />

            {/* Individual Text Regions */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-300">Detected Regions:</h4>
              {ocrResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded text-sm"
                >
                  <span className="text-white flex-1 truncate mr-2">
                    {result.text}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {(result.score * 100).toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};