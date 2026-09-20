interface StatsCardsProps {
  counts: Record<
    string,
    {
      person: number;
      vehicle: number;
    }
  >;
  cameraCount: number;
  alertCount: number;
}

function StatsCards({ counts, cameraCount, alertCount }: StatsCardsProps) {
  const totalPeople = Object.values(counts).reduce(
    (total, item) => total + item.person,
    0,
  );

  const totalVehicles = Object.values(counts).reduce(
    (total, item) => total + item.vehicle,
    0,
  );

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <span>People Detected</span>

        <strong>{totalPeople}</strong>
      </div>

      <div className="stat-card">
        <span>Vehicles Detected</span>

        <strong>{totalVehicles}</strong>
      </div>

      <div className="stat-card">
        <span>Active Cameras</span>

        <strong>{cameraCount}</strong>
      </div>

      <div className="stat-card">
        <span>Alerts</span>

        <strong>{alertCount}</strong>
      </div>
    </section>
  );
}

export default StatsCards;
