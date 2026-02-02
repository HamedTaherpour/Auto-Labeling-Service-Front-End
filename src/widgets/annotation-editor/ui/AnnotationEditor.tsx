"use client";

import { useState, useEffect, useRef } from "react";
import { AnnotationCanvas } from "../../../entities/annotation";
import type { AnnotationCanvasRef } from "../../../entities/annotation/ui/AnnotationCanvas";
import { AnnotationToolbar } from "./AnnotationToolbar";
import { ClassManager } from "./ClassManager";
import { Crosshair } from "./Crosshair";
import { ReviewControls } from "./ReviewControls";
import { ConsensusOverlay } from "./ConsensusOverlay";
import { CommentOnCanvas } from "../../../features/comment-on-canvas";
import { useReviewStore } from "../../../shared/store/review-store";
import { AnnotationClass } from "../../../entities/annotation";
import { AIInferencePanel } from "../../../features/ai-inference";
import { OCRScanner } from "../../../features/ocr-scanner";
import { PropertyEditor } from "../../property-editor";
import { modelApi } from "../../../shared/api";
import { Model } from "../../../entities/model";
import { CommentThread } from "../../../entities/comment";
import { useAIInference } from "../../../features/ai-inference";

interface AnnotationEditorProps {
  fileId: string;
  imageUrl: string;
  datasetId: string;
  initialAnnotations?: any[];
  onSave?: (annotations: any[]) => void;
  reviewMode?: boolean;
  className?: string;
}

export function AnnotationEditor({
  fileId,
  imageUrl,
  datasetId,
  initialAnnotations = [],
  onSave,
  reviewMode = false,
  className,
}: AnnotationEditorProps) {
  const canvasRef = useRef<AnnotationCanvasRef>(null);
  const canvasElementRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<
    "select" | "bbox" | "polygon" | "ai" | "comment"
  >("select");
  const [selectedClass, setSelectedClass] = useState<AnnotationClass | null>(
    null,
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 0, y: 0 });
  const [showCrosshair, setShowCrosshair] = useState(false);

  // AI-related state
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | undefined>();

  // Smart trigger AI inference
  const { runSmartTrigger, inferenceResults } = useAIInference({
    onSuccess: (results) => {
      // Display AI predictions as overlays
      if (canvasRef.current) {
        canvasRef.current.addAIPredictions(results);
      }
    },
  });

  // Review store integration
  const {
    isReviewMode,
    reviewMode: reviewState,
    showConsensus,
    annotations,
    selectedAnnotationId,
    setAnnotations,
    selectAnnotation,
    updateAnnotation,
    toggleConsensus,
    setConsensusAnnotations,
    comments,
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
  } = useReviewStore();

  // Comment threads for canvas display
  const commentThreads: CommentThread[] = comments
    .filter(comment => !comment.parentId)
    .map(rootComment => ({
      rootComment,
      replies: comments.filter(comment => comment.parentId === rootComment.id),
    }));

  // Mock annotation classes - in real app, this would come from API
  const [annotationClasses] = useState<AnnotationClass[]>([
    { id: "1", name: "Car", color: "#FF6B6B", shortcut: "C" },
    { id: "2", name: "Pedestrian", color: "#4ECDC4", shortcut: "P" },
    { id: "3", name: "Bike", color: "#45B7D1", shortcut: "B" },
    { id: "4", name: "Truck", color: "#FFA07A", shortcut: "T" },
    { id: "5", name: "Bus", color: "#98D8C8", shortcut: "U" },
    { id: "6", name: "Traffic Light", color: "#F7DC6F", shortcut: "L" },
  ]);

  // Set first class as selected by default
  useEffect(() => {
    if (annotationClasses.length > 0 && !selectedClass) {
      setSelectedClass(annotationClasses[0]);
    }
  }, [annotationClasses, selectedClass]);

  // Fetch available AI models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await modelApi.getModels();
        setModels(availableModels);

        // Auto-select the first active model
        const firstActiveModel = availableModels.find(model => model.status === 'active');
        if (firstActiveModel) {
          setSelectedModel(firstActiveModel);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    fetchModels();
  }, []);


  // Handle mouse movement for crosshair
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCrosshairPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setShowCrosshair(true);
    const handleMouseLeave = () => setShowCrosshair(false);

    document.addEventListener("mousemove", handleMouseMove);

    // Add listeners to canvas area
    const canvasElement = document.querySelector("[data-canvas-area]");
    if (canvasElement) {
      canvasElement.addEventListener("mouseenter", handleMouseEnter);
      canvasElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (canvasElement) {
        canvasElement.removeEventListener("mouseenter", handleMouseEnter);
        canvasElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tool shortcuts
      if (e.key.toLowerCase() === "b" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSelectedTool("bbox");
      } else if (e.key.toLowerCase() === "p" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSelectedTool("polygon");
      } else if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSelectedTool("select");
      } else if (e.key.toLowerCase() === "a" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSelectedTool("ai");
      }

      // Undo shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        // handleUndo();
      }

      // Class shortcuts
      annotationClasses.forEach((cls) => {
        if (
          cls.shortcut &&
          e.key.toLowerCase() === cls.shortcut.toLowerCase()
        ) {
          e.preventDefault();
          setSelectedClass(cls);
        }
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [annotationClasses]);

  const handleToolChange = (tool: "select" | "bbox" | "polygon" | "ai") => {
    setSelectedTool(tool);
    setIsDrawing(false);

    // If AI tool is selected, trigger auto-annotation
    if (tool === "ai") {
      handleAIAutoAnnotate();
    }
  };

  const handleClassChange = (cls: AnnotationClass) => {
    setSelectedClass(cls);
  };

  const handleShapeCreated = (shape: any) => {
    // Auto-save logic would go here
    console.log("Shape created:", shape);
    if (onSave) {
      // Convert shape to annotation format and save
      const annotations =
        canvasRef.current?.getObjects().map((obj) => ({
          id: (obj as any).id || Math.random().toString(),
          type: "bbox", // This would be determined by the tool used
          coordinates: [obj.left, obj.top, obj.width, obj.height],
          classId: selectedClass?.id || "",
          confidence: 1.0,
        })) || [];
      onSave(annotations);
    }
  };


  const handleUndo = () => {
    const objects = canvasRef.current?.getObjects();
    if (objects && objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      canvasRef.current?.removeShape(lastObject);
    }
  };

  const handleCanvasClick = async (point: { x: number; y: number }) => {
    if (selectedTool === 'ai' && imageUrl) {
      // Convert image URL to File for AI inference
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'current-image.jpg', { type: 'image/jpeg' });

        await runSmartTrigger(file, point);
      } catch (error) {
        console.error('Failed to run smart trigger:', error);
      }
    }
  };

  const handleCommentAdd = (position: { x: number; y: number }, content: string, mentions: string[]) => {
    addComment({
      fileId,
      authorId: "current-user",
      authorName: "Current User",
      content,
      position,
    });

    // Here you would also send notification to mentioned users
    mentions.forEach(mention => {
      console.log('Notify user:', mention);
      // This would trigger real-time notifications
    });
  };

  return (
    <div className={`fixed inset-0 bg-black flex ${className}`}>
      {/* Left Toolbar */}
      <AnnotationToolbar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        className="w-16 bg-[#0A0A0A] border-r border-[#1A1A1A]"
      />

      {/* Main Canvas Area */}
      <div ref={canvasElementRef} className="flex-1 relative overflow-hidden" data-canvas-area>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <AnnotationCanvas
            ref={canvasRef}
            width={1200}
            height={800}
            imageUrl={imageUrl}
            onShapeCreated={handleShapeCreated}
            onCanvasClick={selectedTool === 'ai' ? handleCanvasClick : undefined}
            showAIPredictions={true}
            predictionOpacity={0.7}
            className="shadow-2xl"
          />

          {/* Comment on Canvas */}
          <CommentOnCanvas
            isActive={selectedTool === 'comment'}
            canvasRef={canvasElementRef}
            onCommentAdd={handleCommentAdd}
            commentThreads={commentThreads}
            onCommentEdit={updateComment}
            onCommentDelete={deleteComment}
            onCommentResolve={resolveComment}
            currentUserId="current-user"
            teamMembers={[
              { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
              { id: '2', name: 'Sarah Smith', avatar: '/avatars/sarah.jpg' },
              { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
            ]}
          />
        </div>

        {/* Tool Status Indicator */}
        <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] rounded-lg px-3 py-2">
          <div className="text-sm text-gray-300">
            Tool:{" "}
            <span className="text-[#FF6300] font-medium capitalize">
              {selectedTool}
            </span>
          </div>
          {selectedClass && (
            <div className="text-sm text-gray-300">
              Class:{" "}
              <span
                style={{ color: selectedClass.color }}
                className="font-medium"
              >
                {selectedClass.name}
              </span>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] rounded-lg px-3 py-2">
          <div className="text-xs text-gray-400 space-y-1">
            <div>
              <kbd className="bg-[#1A1A1A] px-1 rounded">B</kbd> Box •{" "}
              <kbd className="bg-[#1A1A1A] px-1 rounded">P</kbd> Polygon •{" "}
              <kbd className="bg-[#1A1A1A] px-1 rounded">C</kbd> Comment •{" "}
              <kbd className="bg-[#1A1A1A] px-1 rounded">S</kbd> Select
            </div>
            <div>
              <kbd className="bg-[#1A1A1A] px-1 rounded">⌘Z</kbd> Undo
            </div>
          </div>
        </div>

        {/* Consensus Overlay */}
        {showConsensus && (
          <ConsensusOverlay
            annotations={[]} // This would come from the store
            className="absolute inset-0 pointer-events-none"
          />
        )}

        {/* Review Mode Overlay */}
        {isReviewMode && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none">
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] rounded-lg px-3 py-2">
              <div className="text-sm text-gray-300">
                Review Mode:{" "}
                <span className="text-[#FF6300] font-medium capitalize">
                  {reviewState}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Controls */}
      {isReviewMode && <ReviewControls className="absolute bottom-4 right-4" />}

      {/* Right Panel */}
      <div className="flex flex-col">
        {/* AI Inference Panel */}
        <AIInferencePanel
          currentFile={imageUrl ? new File([], 'current-image.jpg', { type: 'image/jpeg' }) : undefined}
          onResults={(results) => {
            // Handle AI results - could be used to accept/reject predictions
            console.log('AI results:', results);
          }}
          className="w-80 bg-[#0A0A0A] border-l border-[#1A1A1A] rounded-none"
        />

        {/* OCR Scanner */}
        <OCRScanner
          currentFile={imageUrl ? new File([], 'current-image.jpg', { type: 'image/jpeg' }) : undefined}
          imageUrl={imageUrl}
          onResultsHighlight={(results) => {
            // Highlight OCR results on canvas
            if (canvasRef.current) {
              canvasRef.current.addAIPredictions(results.map(result => ({
                bbox: result.bbox,
                text: result.text,
                score: result.score,
              })));
            }
          }}
          className="w-80 bg-[#0A0A0A] border-l border-[#1A1A1A] border-t-0 rounded-none"
        />

        {/* Class Manager */}
        <ClassManager
          classes={annotationClasses}
          selectedClass={selectedClass}
          onClassChange={handleClassChange}
          className="w-80 bg-[#0A0A0A] border-l border-[#1A1A1A] border-t-0"
        />

        {/* Property Editor */}
        <PropertyEditor
          datasetId={datasetId}
          itemId={fileId}
          className="w-80 bg-[#0A0A0A] border-l border-[#1A1A1A] border-t-0"
        />
      </div>

      {/* Global Crosshair */}
      <Crosshair
        position={crosshairPosition}
        visible={showCrosshair && selectedTool !== "select"}
      />
    </div>
  );
}
