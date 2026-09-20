import { useEffect, useRef } from "react";

import { useDispatch } from "react-redux";

import { setDetections, addAlerts } from "../store/cameraSlice";

import type { DetectionMessage } from "../types/detection";

const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/detection";

export function useDetectionSocket() {
  const socketRef = useRef<WebSocket | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("Detection WebSocket connected");
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      const message: DetectionMessage = JSON.parse(event.data);

      if (message.type !== "detection") {
        return;
      }

      dispatch(
        setDetections({
          cameraId: message.cameraId,
          detections: message.detections,
        }),
      );

      if (message.alerts.length > 0) {
        dispatch(addAlerts(message.alerts));
      }
    };

    socket.onclose = () => {
      console.log("Detection WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return socketRef;
}
