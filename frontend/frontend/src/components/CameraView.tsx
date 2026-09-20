import { useEffect, useRef, useState } from "react";

import type { Detection, DetectionResponse } from "../types/detection";

interface CameraViewProps {
  onDetections: (detections: Detection[]) => void;
  onConnectionChange: (connected: boolean) => void;
}

const WS_URL = "ws://localhost:8000/ws/detect";

function CameraView({ onDetections, onConnectionChange }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [streaming, setStreaming] = useState(false);

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
        }
      } catch (error) {
        console.error("Camera error:", error);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  function connectSocket() {
    if (socketRef.current) {
      return;
    }

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket connected");

      onConnectionChange(true);
      setStreaming(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");

      onConnectionChange(false);
      setStreaming(false);

      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      const data: DetectionResponse = JSON.parse(event.data);

      if (
        data.type === "detection" &&
        data.detections &&
        data.width &&
        data.height
      ) {
        onDetections(data.detections);

        drawBoxes(data.detections, data.width, data.height);
      }
    };

    socketRef.current = socket;
  }

  function disconnectSocket() {
    socketRef.current?.close();

    socketRef.current = null;

    setStreaming(false);
  }

  function captureFrame(): string | null {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return null;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.7);
  }

  function drawBoxes(
    detections: Detection[],
    imageWidth: number,
    imageHeight: number,
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / imageWidth;

    const scaleY = canvas.height / imageHeight;

    detections.forEach((detection) => {
      const { x1, y1, x2, y2 } = detection.box;

      const width = x2 - x1;
      const height = y2 - y1;

      context.strokeStyle = "#00ff66";
      context.lineWidth = 3;

      context.strokeRect(
        x1 * scaleX,
        y1 * scaleY,
        width * scaleX,
        height * scaleY,
      );

      context.fillStyle = "#00ff66";
      context.font = "16px Arial";

      context.fillText(
        `${detection.label} ${detection.confidence}`,
        x1 * scaleX,
        Math.max(y1 * scaleY - 8, 16),
      );
    });
  }

  useEffect(() => {
    if (!streaming) {
      return;
    }

    const interval = window.setInterval(() => {
      const socket = socketRef.current;

      if (socket && socket.readyState === WebSocket.OPEN) {
        const frame = captureFrame();

        if (frame) {
          socket.send(frame);
        }
      }
    }, 300);

    return () => {
      window.clearInterval(interval);
    };
  }, [streaming]);

  return (
    <div className="camera-card">
      <div className="camera-header">
        <div>
          <h2>Live Camera</h2>
          <span>Realtime AI detection</span>
        </div>

        <div className="camera-actions">
          {!streaming ? (
            <button onClick={connectSocket}>Start AI</button>
          ) : (
            <button onClick={disconnectSocket}>Stop AI</button>
          )}
        </div>
      </div>

      <div className="camera-container">
        <video ref={videoRef} autoPlay playsInline muted />

        <canvas ref={canvasRef} className="overlay" />

        {!streaming && (
          <div className="camera-placeholder">
            <span>AI Detection is stopped</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraView;
