# utils/yolo_number_detector.py

from ultralytics import YOLO
import easyocr
import cv2
import os

# Load YOLOv8 model and OCR reader once
MODEL_PATH = os.path.join("modelbest", "best.pt")  # adjust if needed
yolo_model = YOLO(MODEL_PATH)
ocr_reader = easyocr.Reader(['en'], gpu=False)

def detect_shapes_and_numbers_yolo(image_path):
    results = yolo_model.predict(image_path, conf=0.3)
    img = cv2.imread(image_path)
    width, height = None, None

    for box in results[0].boxes:
        cls = int(box.cls[0])  # 0 = width (w###), 1 = height (h###)
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cropped = img[y1:y2, x1:x2]
        texts = ocr_reader.readtext(cropped, detail=0)

        for text in texts:
            cleaned = text.lower().replace(" ", "")
            if cls == 0 and cleaned.startswith("w") and cleaned[1:].isdigit():
                width = int(cleaned[1:])
            elif cls == 1 and cleaned.startswith("h") and cleaned[1:].isdigit():
                height = int(cleaned[1:])

    return {"width": width, "height": height}
