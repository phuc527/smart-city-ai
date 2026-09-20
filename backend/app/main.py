import base64
import cv2
import numpy as np

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.detector import ObjectDetector


app = FastAPI(title="Smart City AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = ObjectDetector()


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "smart-city-ai"
    }


@app.websocket("/ws/detect")
async def detect_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()

            if not data:
                continue

            image_data = data

            if "," in image_data:
                image_data = image_data.split(",", 1)[1]

            image_bytes = base64.b64decode(image_data)

            numpy_array = np.frombuffer(
                image_bytes,
                dtype=np.uint8
            )

            frame = cv2.imdecode(
                numpy_array,
                cv2.IMREAD_COLOR
            )

            if frame is None:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid image"
                })
                continue

            detections = detector.detect(frame)

            await websocket.send_json({
                "type": "detection",
                "width": frame.shape[1],
                "height": frame.shape[0],
                "detections": detections
            })

    except WebSocketDisconnect:
        print("Client disconnected")