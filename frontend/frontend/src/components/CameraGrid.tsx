import CameraCard from "./CameraCard";

import type { Camera, Detection } from "../types/detection";

interface CameraGridProps {
  cameras: Camera[];
  detections: Record<string, Detection[]>;
  socket: WebSocket | null;
}

function CameraGrid({ cameras, detections, socket }: CameraGridProps) {
  return (
    <section className="section">
      <div className="section-title">
        <div>
          <h2>Live Cameras</h2>

          <span>{cameras.length} cameras</span>
        </div>
      </div>

      <div className="camera-grid">
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            detections={detections[camera.id] || []}
            socket={socket}
          />
        ))}
      </div>
    </section>
  );
}

export default CameraGrid;
