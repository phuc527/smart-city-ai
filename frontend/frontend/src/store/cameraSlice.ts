import { createSlice } from "@reduxjs/toolkit";

import type { Camera, Detection, Alert } from "../types/detection";

interface CameraState {
  cameras: Camera[];
  detections: Record<string, Detection[]>;
  alerts: Alert[];
}

const initialState: CameraState = {
  cameras: [],
  detections: {},
  alerts: [],
};

const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {
    setCameras(state, action) {
      state.cameras = action.payload;
    },

    setDetections(state, action) {
      state.detections[action.payload.cameraId] = action.payload.detections;
    },

    addAlerts(state, action) {
      state.alerts = [...action.payload, ...state.alerts].slice(0, 50);
    },

    clearAlerts(state) {
      state.alerts = [];
    },
  },
});

export const { setCameras, setDetections, addAlerts, clearAlerts } =
  cameraSlice.actions;

export default cameraSlice.reducer;
