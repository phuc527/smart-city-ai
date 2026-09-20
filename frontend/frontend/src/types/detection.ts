export type ObjectType = "person" | "car" | "bus" | "truck" | "motorcycle";

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  id: string;
  label: ObjectType;
  confidence: number;
  box: BoundingBox;
}

export interface Camera {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: "online" | "offline";
}

export interface Alert {
  id: string;
  cameraId: string;
  type: "crowded" | "traffic" | "unknown";
  message: string;
  timestamp: string;
}

export interface DetectionMessage {
  type: "detection";
  cameraId: string;
  width: number;
  height: number;
  detections: Detection[];
  counts: {
    person: number;
    vehicle: number;
  };
  alerts: Alert[];
}
