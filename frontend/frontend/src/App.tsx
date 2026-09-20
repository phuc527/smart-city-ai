import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getCameras } from "./api/cameraApi";
import { setCameras } from "./store/cameraSlice";
import { useDetectionSocket } from "./hooks/useDetectionSocket";
import CameraGrid from "./components/CameraGrid";
import StatsCards from "./components/StatsCards";
import AlertPanel from "./components/AlertPanel";
import CityMap from "./components/CityMap";

function App() {
  const dispatch = useAppDispatch();

  const { cameras, detections, counts, alerts } = useAppSelector(
    (state) => state.camera,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

  const { socket, connected } = useDetectionSocket();

  useEffect(() => {
    if (data) {
      dispatch(setCameras(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <div className="loading">Loading Smart City...</div>;
  }

  if (isError) {
    return <div className="error-page">Failed to load cameras</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Smart City AI</h1>

          <p>Realtime AI Monitoring Dashboard</p>
        </div>

        <div className="system-status">
          <span
            className={`status-dot ${
              connected ? "status-online" : "status-offline"
            }`}
          />

          <span>{connected ? "AI System Online" : "AI System Offline"}</span>
        </div>
      </header>

      <main>
        <StatsCards
          counts={counts}
          cameraCount={cameras.length}
          alertCount={alerts.length}
        />

        <div className="main-layout">
          <div>
            <CameraGrid
              cameras={cameras}
              detections={detections}
              socket={socket}
            />
          </div>

          <div className="right-column">
            <AlertPanel alerts={alerts} />

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>City Map</h2>

                  <span>Camera locations</span>
                </div>

                <strong>{cameras.length}</strong>
              </div>

              <CityMap cameras={cameras} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
