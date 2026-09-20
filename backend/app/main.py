import base64

import cv2
import numpy as np

from fastapi import (
    FastAPI,
    WebSocket
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.detector import ObjectDetector
from app.counting import count_objects
from app.alert import create_alerts


app = FastAPI(
    title="Smart City AI API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

detector = ObjectDetector()


CAMERAS = [
    {
        "id": "cam-001",
        "name": "Nguyen Hue",
        "location": {
            "lat": 10.774,
            "lng": 106.704
        },
        "status": "online"
    },
    {
        "id": "cam-002",
        "name": "Le Loi",
        "location": {
            "lat": 10.773,
            "lng": 106.701
        },
        "status": "online"
    },
    {
        "id": "cam-003",
        "name": "District 1",
        "location": {
            "lat": 10.776,
            "lng": 106.703
        },
        "status": "online"
    }
]


@app.get("/")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/cameras")
def cameras():
    return CAMERAS


@app.websocket("/ws/detection")
async def detection_socket(
    websocket: WebSocket
):
    await websocket.accept()

    try:
        while True:
            message = (
                await websocket.receive_json()
            )

            camera_id = message[
                "cameraId"
            ]

            image_data = message[
                "image"
            ]

            if "," in image_data:
                image_data = (
                    image_data.split(
                        ",",
                        1
                    )[1]
                )

            image_bytes = (
                base64.b64decode(
                    image_data
                )
            )

            array = np.frombuffer(
                image_bytes,
                dtype=np.uint8
            )

            frame = cv2.imdecode(
                array,
                cv2.IMREAD_COLOR
            )

            detections = detector.detect(
                frame
            )

            counts = count_objects(
                detections
            )

            alerts = create_alerts(
                camera_id,
                counts
            )

            await websocket.send_json({
                "type": "detection",
                "cameraId": camera_id,
                "width": frame.shape[1],
                "height": frame.shape[0],
                "detections": detections,
                "counts": counts,
                "alerts": alerts
            })

    except Exception as error:
        print(
            "WebSocket error:",
            error
        )