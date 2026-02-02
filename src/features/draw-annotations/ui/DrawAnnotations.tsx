"use client";

import { useEffect, useRef } from "react";
import type { AnnotationCanvasRef } from "../../../entities/annotation/ui/AnnotationCanvas";
import { AnnotationClass } from "../../../entities/annotation";
import { Rect, Polygon, Point } from "fabric";

interface DrawAnnotationsProps {
  canvasRef: React.RefObject<AnnotationCanvasRef>;
  selectedTool: "select" | "bbox" | "polygon" | "ai";
  selectedClass: AnnotationClass | null;
  onShapeCreated?: (shape: any) => void;
}

export function DrawAnnotations({
  canvasRef,
  selectedTool,
  selectedClass,
  onShapeCreated,
}: DrawAnnotationsProps) {
  const isDrawingRef = useRef(false);
  const currentShapeRef = useRef<any>(null);
  const polygonPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current?.canvas;
    if (!canvas) return;

    // Disable default selection when drawing
    if (selectedTool !== "select") {
      canvas.selection = false;
      canvas.defaultCursor = "crosshair";
    } else {
      canvas.selection = true;
      canvas.defaultCursor = "default";
    }

    // Handle mouse events based on selected tool
    const handleMouseDown = (e: any) => {
      if (selectedTool === "select" || !selectedClass) return;

      const pointer = e.absolutePointer;
      isDrawingRef.current = true;

      if (selectedTool === "bbox") {
        handleBboxStart(pointer);
      } else if (selectedTool === "polygon") {
        handlePolygonStart(pointer);
      }
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawingRef.current || selectedTool === "select" || !selectedClass)
        return;

      const pointer = e.absolutePointer;

      if (selectedTool === "bbox") {
        handleBboxMove(pointer);
      } else if (selectedTool === "polygon") {
        handlePolygonMove(pointer);
      }
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;

      if (selectedTool === "bbox") {
        handleBboxEnd();
      } else if (selectedTool === "polygon") {
        handlePolygonEnd();
      }

      isDrawingRef.current = false;
    };

    const handleDoubleClick = () => {
      if (selectedTool === "polygon" && polygonPointsRef.current.length >= 3) {
        completePolygon();
      }
    };

    // Attach event listeners
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:dblclick", handleDoubleClick);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("mouse:dblclick", handleDoubleClick);
    };
  }, [selectedTool, selectedClass]);

  const handleBboxStart = (pointer: { x: number; y: number }) => {
    const canvas = canvasRef.current?.canvas;
    if (!canvas || !selectedClass) return;

    // Create a rectangle
    const rect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: selectedClass.color,
      opacity: 0.3,
      stroke: selectedClass.color,
      strokeWidth: 2,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: selectedClass.color,
      cornerStrokeColor: selectedClass.color,
      lockScalingFlip: true,
    });

    canvas.add(rect);
    currentShapeRef.current = rect;
  };

  const handleBboxMove = (pointer: { x: number; y: number }) => {
    const shape = currentShapeRef.current;
    if (!shape) return;

    const startX = shape.left;
    const startY = shape.top;

    shape.set({
      width: Math.abs(pointer.x - startX),
      height: Math.abs(pointer.y - startY),
      left: pointer.x < startX ? pointer.x : startX,
      top: pointer.y < startY ? pointer.y : startY,
    });

    shape.canvas?.renderAll();
  };

  const handleBboxEnd = () => {
    const shape = currentShapeRef.current;
    if (!shape) return;

    // Remove if too small (likely accidental click)
    if (shape.width < 10 || shape.height < 10) {
      shape.canvas?.remove(shape);
    } else {
      // Mark as selectable after creation
      shape.set({ selectable: true });
      onShapeCreated?.(shape);
    }

    currentShapeRef.current = null;
  };

  const handlePolygonStart = (pointer: { x: number; y: number }) => {
    polygonPointsRef.current.push(pointer);
  };

  const handlePolygonMove = (pointer: { x: number; y: number }) => {
    // Update the temporary line showing the current drawing
    // This is simplified - a full implementation would show a preview line
  };

  const handlePolygonEnd = () => {
    // Polygon drawing continues until double-click or enough points
  };

  const completePolygon = () => {
    const canvas = canvasRef.current?.canvas;
    if (!canvas || !selectedClass || polygonPointsRef.current.length < 3)
      return;

    // Create polygon
    const polygon = new Polygon(polygonPointsRef.current, {
      fill: selectedClass.color,
      opacity: 0.3,
      stroke: selectedClass.color,
      strokeWidth: 2,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: selectedClass.color,
      cornerStrokeColor: selectedClass.color,
      lockScalingFlip: true,
    });

    canvas.add(polygon);
    onShapeCreated?.(polygon);

    // Reset for next polygon
    polygonPointsRef.current = [];
  };

  // Handle AI annotation (mock implementation)
  useEffect(() => {
    if (selectedTool === "ai" && selectedClass) {
      // Mock AI annotation - in real app, this would call an API
      const canvas = canvasRef.current?.canvas;
      if (!canvas) return;

      // Simulate AI detection delay
      setTimeout(() => {
        const mockDetections = [
          { x: 100, y: 150, width: 80, height: 60 },
          { x: 300, y: 200, width: 90, height: 70 },
        ];

        mockDetections.forEach((detection) => {
          const rect = new Rect({
            left: detection.x,
            top: detection.y,
            width: detection.width,
            height: detection.height,
            fill: selectedClass.color,
            opacity: 0.3,
            stroke: selectedClass.color,
            strokeWidth: 2,
            strokeUniform: true,
            selectable: true,
          });

          canvas.add(rect);
          onShapeCreated?.(rect);
        });
      }, 1000);
    }
  }, [selectedTool, selectedClass, onShapeCreated]);

  return null; // This component only handles logic, no UI
}
