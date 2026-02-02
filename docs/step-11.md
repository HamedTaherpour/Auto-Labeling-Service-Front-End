Role: Senior AI Engineering & Frontend Architect Task: Implement the "Vision Services" module and AI Inference integration. Architecture: Feature-Sliced Design (FSD).

Context: We are now implementing the core "Vision" capabilities of AuraVision, inspired by V7 Darwin's automated labeling and model-in-the-loop features. We need to connect the frontend to the vision-specific endpoints in the Postman collection to trigger model inference and handle AI-generated outputs.

Requirements:

Vision Entity (src/entities/vision-task):

Define types for InferenceResult: bounding boxes, polygons, confidence scores, and OCR text.

Create a VisionStatus component to track the state of a backend AI job (e.g., Queued, Processing, Completed, Failed).

Auto-Annotate Feature (src/features/ai-inference):

Implement a "Smart Trigger" in the Editor: When a user clicks a point on an image, call the AI Vision service (e.g., SAM or a custom detector) to generate a segment.

Batch Processing: Implement a feature to select multiple files in the Dataset View and trigger a "Bulk Vision Job" using the POST /api/v1/vision/batch (or equivalent from Postman).

OCR & Document Intelligence (Feature):

If the Postman collection includes Document AI/OCR services, create a src/features/ocr-scanner that allows users to run text extraction on a file and displays the results in a side-panel.

API Integration (Shared Layer):

Map from the Vision folder in the Postman collection:

POST /api/v1/vision/infer: To run real-time inference on the active frame.

GET /api/v1/vision/models: To fetch the capabilities of the vision engine.

POST /api/v1/vision/auto-track: For object tracking across video frames (if available in Postman).

UI & UX Precision:

Overlay Management: Implement a high-performance layer to render AI predictions (Ghost boxes/polygons) before they are "Accepted" by the human annotator.

Confidence Filter: Add a slider to the UI to hide/show AI predictions based on their confidence score (e.g., show only objects with >0.90 confidence).

Instructions:

Analyze the "Vision" or "Model" folders in the attached Postman collection carefully to map the correct request payloads.

Start by building the Inference service in src/shared/api.

Update the Editor Widget to support "AI-assisted" drawing modes.

Ensure the architecture remains strictly FSD-compliant.