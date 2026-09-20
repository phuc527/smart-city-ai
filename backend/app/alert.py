from datetime import datetime


PERSON_LIMIT = 10
VEHICLE_LIMIT = 15


def create_alerts(
    camera_id,
    counts
):
    alerts = []

    if counts["person"] > PERSON_LIMIT:
        alerts.append({
            "id": f"{camera_id}-crowded",
            "cameraId": camera_id,
            "type": "crowded",
            "message": (
                f"High people density: "
                f"{counts['person']}"
            ),
            "timestamp":
                datetime.utcnow().isoformat()
        })

    if counts["vehicle"] > VEHICLE_LIMIT:
        alerts.append({
            "id": f"{camera_id}-traffic",
            "cameraId": camera_id,
            "type": "traffic",
            "message": (
                f"Heavy traffic: "
                f"{counts['vehicle']} vehicles"
            ),
            "timestamp":
                datetime.utcnow().isoformat()
        })

    return alerts