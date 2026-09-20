import { useEffect, useRef, useState } from "react";

import type { Camera, Detection } from "../types/detection";

interface CameraCardProps {
  camera: Camera;
  detections: Detection[];
  socket: WebSocket | null;
}

function CameraCard({ camera, detections, socket }: CameraCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | undefined;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          setCameraActive(true);
        }
      } catch (error) {
        console.error("Camera error:", error);

        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function sendFrame() {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !socket ||
      socket.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    const video = videoRef.current;

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg", 0.7);

    socket.send(
      JSON.stringify({
        cameraId: camera.id,
        image,
      }),
    );
  }

  useEffect(() => {
    if (!cameraActive || !socket) {
      return;
    }

    const interval = window.setInterval(sendFrame, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [cameraActive, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
      const { x1, y1, x2, y2 } = detection.box;

      context.strokeStyle = "#00ff66";

      context.lineWidth = 3;

      context.strokeRect(x1, y1, x2 - x1, y2 - y1);

      context.fillStyle = "#00ff66";

      context.font = "16px Arial";

      context.fillText(
        `${detection.label} ${(detection.confidence * 100).toFixed(0)}%`,
        x1,
        Math.max(y1 - 8, 16),
      );
    });
  }, [detections]);

  return (
    <div className="camera-card">
      <div className="camera-card-header">
        <div>
          <h3>{camera.name}</h3>

          <span>{camera.id}</span>
        </div>

        <div
          className={
            camera.status === "online" ? "camera-online" : "camera-offline"
          }
        >
          ● {camera.status}
        </div>
      </div>

      <div className="camera-view">
        <video ref={videoRef} autoPlay playsInline muted />

        <canvas ref={canvasRef} className="camera-overlay" />

        {!cameraActive && (
          <div className="camera-message">Camera unavailable</div>
        )}
      </div>

      <div className="camera-footer">
        <span>
          Objects: <strong>{detections.length}</strong>
        </span>

        <span>
          Person:{" "}
          <strong>
            {detections.filter((item) => item.label === "person").length}
          </strong>
        </span>

        <span>
          Vehicle:{" "}
          <strong>
            {
              detections.filter((item) =>
                ["car", "bus", "truck", "motorcycle"].includes(item.label),
              ).length
            }
          </strong>
        </span>
      </div>
    </div>
  );
}

export default CameraCard;
