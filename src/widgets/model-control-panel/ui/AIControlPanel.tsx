import { useState } from 'react';
import { Model } from '@/entities/model';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Zap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIControlPanelProps {
  models: Model[];
  selectedModel?: Model;
  onModelSelect: (model: Model) => void;
  onAutoAnnotate: () => Promise<void>;
  isProcessing: boolean;
  progress?: number;
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  className?: string;
}

export function AIControlPanel({
  models,
  selectedModel,
  onModelSelect,
  onAutoAnnotate,
  isProcessing,
  progress = 0,
  confidenceThreshold,
  onConfidenceChange,
  className,
}: AIControlPanelProps) {
  const activeModels = models.filter(model => model.status === 'active');

  const handleAutoAnnotate = async () => {
    if (!selectedModel || isProcessing) return;
    await onAutoAnnotate();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-orange-500" />
          AI Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Select AI Model
          </label>
          <Select
            value={selectedModel?.id || ''}
            onValueChange={(value) => {
              const model = models.find(m => m.id === value);
              if (model) onModelSelect(model);
            }}
            disabled={isProcessing}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Choose a model..." />
            </SelectTrigger>
            <SelectContent>
              {activeModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {model.task}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
              {activeModels.length === 0 && (
                <SelectItem value="no-models-available" disabled>
                  No active models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Confidence Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Confidence Threshold
            </label>
            <span className="text-xs text-muted-foreground">
              {Math.round(confidenceThreshold * 100)}%
            </span>
          </div>
          <Slider
            value={[confidenceThreshold * 100]}
            onValueChange={(value) => onConfidenceChange(value[0] / 100)}
            max={100}
            min={0}
            step={5}
            className="w-full"
            disabled={isProcessing}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Auto-Annotate Button */}
        <div className="space-y-2">
          <Button
            onClick={handleAutoAnnotate}
            disabled={!selectedModel || isProcessing}
            className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Auto-Annotate All
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Generating annotations...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Model Info */}
        {selectedModel && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Selected Model:</span>
              <Badge variant="outline" className="text-xs">
                {selectedModel.type}
              </Badge>
            </div>
            {selectedModel.accuracy && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Accuracy:</span>
                <span>{Math.round(selectedModel.accuracy * 100)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}