import type { Detection } from "../types/detection";

interface StatsProps {
  detections: Detection[];
}

function Stats({ detections }: StatsProps) {
  const counts = detections.reduce<Record<string, number>>(
    (result, detection) => {
      result[detection.label] = (result[detection.label] || 0) + 1;

      return result;
    },
    {},
  );

  const people = counts.person || 0;

  const vehicles =
    (counts.car || 0) +
    (counts.bus || 0) +
    (counts.truck || 0) +
    (counts.motorcycle || 0);

  return (
    <div className="stats">
      <div className="stat-card">
        <span>Total Objects</span>

        <strong>{detections.length}</strong>
      </div>

      <div className="stat-card">
        <span>People</span>

        <strong>{people}</strong>
      </div>

      <div className="stat-card">
        <span>Vehicles</span>

        <strong>{vehicles}</strong>
      </div>
    </div>
  );
}

export default Stats;
