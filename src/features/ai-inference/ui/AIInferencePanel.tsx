import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { VisionStatus } from '@/entities/vision-task';
import { useAIInference } from '../model/useAIInference';
import { VisionTaskType } from '@/entities/vision-task';
import { Brain, Zap, FileText, Target, Eye, EyeOff } from 'lucide-react';

interface AIInferencePanelProps {
  currentFile?: File;
  onResults?: (results: any[]) => void;
  className?: string;
}

const taskIcons = {
  detection: Target,
  ocr: FileText,
  keypoint: Brain,
  caption: FileText,
  caption_grounding: Target,
};

const taskLabels = {
  detection: 'Object Detection',
  ocr: 'OCR',
  keypoint: 'Pose Estimation',
  caption: 'Image Caption',
  caption_grounding: 'Text Grounding',
};

export const AIInferencePanel = ({
  currentFile,
  onResults,
  className,
}: AIInferencePanelProps) => {
  const [selectedTask, setSelectedTask] = useState<VisionTaskType>('detection');
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [showOverlays, setShowOverlays] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState([0.7]);
  const [textInput, setTextInput] = useState('');

  const {
    currentJob,
    inferenceResults,
    isLoading,
    runInferenceAsync,
    runSmartTrigger,
    error,
  } = useAIInference({
    onSuccess: (results) => {
      // Filter results by confidence threshold
      const filteredResults = results.filter(
        (result) => (result as any).score >= confidenceThreshold[0]
      );
      onResults?.(filteredResults);
    },
  });

  const handleRunInference = async () => {
    if (!currentFile) return;

    try {
      await runInferenceAsync({
        file: currentFile,
        task: selectedTask,
        model: selectedTask === 'caption' || selectedTask === 'caption_grounding' ? 'florence' : 'rexomni',
        options: {
          text_input: selectedTask === 'caption_grounding' ? textInput : undefined,
        },
      });
    } catch (err) {
      console.error('Inference failed:', err);
    }
  };

  const handleSmartTrigger = async (point: { x: number; y: number }) => {
    if (!currentFile) return;

    try {
      await runSmartTrigger(currentFile, point);
    } catch (err) {
      console.error('Smart trigger failed:', err);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Inference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Task Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(taskLabels) as VisionTaskType[]).map((task) => {
              const Icon = taskIcons[task];
              return (
                <Button
                  key={task}
                  variant={selectedTask === task ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center gap-2 justify-start"
                >
                  <Icon className="w-4 h-4" />
                  {taskLabels[task]}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Text Input for Caption Grounding */}
        {selectedTask === 'caption_grounding' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Query</label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g., 'Where is the dog?'"
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            />
          </div>
        )}

        {/* Confidence Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Confidence Threshold: {confidenceThreshold[0].toFixed(2)}
          </label>
          <Slider
            value={confidenceThreshold}
            onValueChange={setConfidenceThreshold}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Overlay Controls */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {showOverlays ? (
              <Eye className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <Label htmlFor="show-overlays" className="text-sm font-medium">
              Show AI Overlays
            </Label>
            <Switch
              id="show-overlays"
              checked={showOverlays}
              onCheckedChange={setShowOverlays}
            />
          </div>

          {showOverlays && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Overlay Opacity: {overlayOpacity[0].toFixed(2)}
              </label>
              <Slider
                value={overlayOpacity}
                onValueChange={setOverlayOpacity}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        {inferenceResults.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {inferenceResults.length} result{inferenceResults.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        {/* Job Status */}
        {currentJob && (
          <VisionStatus status={currentJob.status} progress={currentJob.progress} />
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleRunInference}
            disabled={!currentFile || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Inference
              </>
            )}
          </Button>
        </div>

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