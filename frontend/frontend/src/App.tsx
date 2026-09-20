import { useState } from "react";
import CameraView from "./components/CameraView";
import DetectionList from "./components/DetectionList";
import Stats from "./components/Stats";
import type { Detection } from "./types/detection";
import "./index.css";

function App() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [connected, setConnected] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Smart City AI Dashboard</h1>
          <p>Realtime Object Detection</p>
        </div>

        <div className={`status ${connected ? "online" : "offline"}`}>
          <span />
          {connected ? "AI Online" : "AI Offline"}
        </div>
      </header>

      <main className="dashboard">
        <section className="camera-section">
          <CameraView
            onDetections={setDetections}
            onConnectionChange={setConnected}
          />
        </section>

        <section className="sidebar">
          <Stats detections={detections} />
          <DetectionList detections={detections} />
        </section>
      </main>
    </div>
  );
}

export default App;
