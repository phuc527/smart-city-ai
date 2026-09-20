import type { Alert } from "../types/detection";

interface AlertPanelProps {
  alerts: Alert[];
}

function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Alerts</h2>

          <span>Realtime events</span>
        </div>

        <strong>{alerts.length}</strong>
      </div>

      <div className="alert-list">
        {alerts.length === 0 && <div className="empty">No alerts</div>}

        {alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            <div>
              <strong>{alert.type}</strong>

              <p>{alert.message}</p>
            </div>

            <small>{new Date(alert.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AlertPanel;
