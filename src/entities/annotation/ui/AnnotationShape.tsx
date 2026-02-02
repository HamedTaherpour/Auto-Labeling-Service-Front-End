import { Rect, Polygon, Object } from "fabric";

export interface AnnotationShapeProps {
  type: "bbox" | "polygon";
  coordinates: number[];
  classColor: string;
  className?: string;
  opacity?: number;
}

export class AnnotationShape {
  static createBbox(
    coordinates: number[],
    classColor: string,
    opacity = 0.3
  ): Rect {
    const [x, y, width, height] = coordinates;

    return new Rect({
      left: x,
      top: y,
      width,
      height,
      fill: classColor,
      opacity,
      stroke: classColor,
      strokeWidth: 2,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: classColor,
      cornerStrokeColor: classColor,
      lockScalingFlip: true,
      padding: 0,
    });
  }

  static createPolygon(
    coordinates: number[],
    classColor: string,
    opacity = 0.3
  ): Polygon {
    // Convert flat coordinates to points array
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < coordinates.length; i += 2) {
      points.push({ x: coordinates[i], y: coordinates[i + 1] });
    }

    return new Polygon(points, {
      fill: classColor,
      opacity,
      stroke: classColor,
      strokeWidth: 2,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: classColor,
      cornerStrokeColor: classColor,
      lockScalingFlip: true,
      padding: 0,
    });
  }

  static createFromAnnotation(
    type: "bbox" | "polygon",
    coordinates: number[],
    classColor: string,
    opacity = 0.3
  ): Object {
    if (type === "bbox") {
      return this.createBbox(coordinates, classColor, opacity);
    } else {
      return this.createPolygon(coordinates, classColor, opacity);
    }
  }
}
