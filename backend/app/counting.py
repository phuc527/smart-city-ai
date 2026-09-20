VEHICLES = {
    "car",
    "bus",
    "truck",
    "motorcycle"
}


def count_objects(detections):
    person_count = 0
    vehicle_count = 0

    for detection in detections:
        label = detection["label"]

        if label == "person":
            person_count += 1

        if label in VEHICLES:
            vehicle_count += 1

    return {
        "person": person_count,
        "vehicle": vehicle_count
    }