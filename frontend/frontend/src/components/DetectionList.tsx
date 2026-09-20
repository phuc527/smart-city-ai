import type { Detection } from "../types/detection";

interface DetectionListProps {
  detections: Detection[];
}

function DetectionList({ detections }: DetectionListProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Detected Objects</h2>

        <span>{detections.length}</span>
      </div>

      <div className="detection-list">
        {detections.length === 0 && (
          <p className="empty">No objects detected</p>
        )}

        {detections.map((detection, index) => (
          <div className="detection-item" key={`${detection.label}-${index}`}>
            <div>
              <strong>{detection.label}</strong>

              <small>
                Confidence: {(detection.confidence * 100).toFixed(0)}%
              </small>
            </div>

            <span className="confidence">{detection.confidence}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetectionList;
