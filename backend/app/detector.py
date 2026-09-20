from ultralytics import YOLO
import cv2


class ObjectDetector:
    def __init__(self):
        self.model = YOLO("yolo11n.pt")

    def detect(self, frame):
        results = self.model(frame, verbose=False)

        detections = []

        for result in results:
            boxes = result.boxes

            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                confidence = float(box.conf[0])
                class_id = int(box.cls[0])

                label = self.model.names[class_id]

                detections.append({
                    "label": label,
                    "confidence": round(confidence, 2),
                    "box": {
                        "x1": round(x1),
                        "y1": round(y1),
                        "x2": round(x2),
                        "y2": round(y2)
                    }
                })

        return detections

    def draw_detections(self, frame, detections):
        for detection in detections:
            box = detection["box"]

            x1 = box["x1"]
            y1 = box["y1"]
            x2 = box["x2"]
            y2 = box["y2"]

            label = detection["label"]
            confidence = detection["confidence"]

            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            text = f"{label} {confidence:.2f}"

            cv2.putText(
                frame,
                text,
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

        return frame