import type { Camera } from "../types/detection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getCameras(): Promise<Camera[]> {
  const response = await fetch(`${API_URL}/api/cameras`);

  if (!response.ok) {
    throw new Error("Failed to load cameras");
  }

  return response.json();
}
