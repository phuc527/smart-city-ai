from ultralytics import YOLO


class ObjectDetector:
    def __init__(self):
        self.model = YOLO("yolo11n.pt")

    def detect(self, frame):
        results = self.model(
            frame,
            verbose=False
        )

        detections = []

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = (
                    box.xyxy[0].tolist()
                )

                confidence = float(
                    box.conf[0]
                )

                class_id = int(
                    box.cls[0]
                )

                label = self.model.names[
                    class_id
                ]

                if confidence < 0.5:
                    continue

                detections.append({
                    "label": label,
                    "confidence": round(
                        confidence,
                        2
                    ),
                    "box": {
                        "x1": int(x1),
                        "y1": int(y1),
                        "x2": int(x2),
                        "y2": int(y2)
                    }
                })

        return detections