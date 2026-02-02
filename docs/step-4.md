Role: Senior AI Integration Engineer & Frontend Architect Task: Implement the AI Model Hub and Auto-Annotation trigger system. Architecture: Feature-Sliced Design (FSD).

Context: We have built the manual labeling and QA workflow. Now, we must implement the "Automation Engine" inspired by V7 Darwin's Model Management. This allows users to use AI models to automate the labeling process (Auto-Annotate).

Requirements:

Model Hub Entity (src/entities/model):

Define the Model type: id, name, type (Instance Segmentation, Keypoints, etc.), and status.

Create a ModelCard component to show model versions and accuracy metrics.

AI Control Panel (Widget):

Create src/widgets/model-control-panel to be used inside the Annotation Editor.

Include a dropdown to select an active model (e.g., "Aura-SAM-v2" or "Object-Detector-v1").

Add an "Auto-Annotate All" button with a loading state that reflects the AI processing time.

Auto-Annotation Feature (src/features/auto-annotate):

Implement the logic to trigger the AI stage: When the user clicks "Auto-Annotate", call the backend to run the model on the current image/frame.

Visual Feedback: Show a "Magic Wand" cursor effect and a progress bar while the AI is generating polygon masks.

Automatically render the AI-generated polygons on the canvas once the API returns the coordinates.

API Integration (Shared Layer):

Map these from the Postman collection:

GET /api/v1/models: To fetch available AI models.

POST /api/v1/datasets/{id}/auto-annotate: To trigger bulk labeling on a dataset.

POST /api/v1/files/{id}/infer: To get real-time AI predictions for a single file.

UI/UX Refinement:

Use "Blaze Orange" (#FF6300) for AI-related actions to distinguish them from manual tools.

Implement a "Confidence Score" slider: Allow users to filter AI annotations based on their probability score (e.g., only show labels with >85% confidence).

Instructions:

Analyze the Postman collection for "Model" or "Inference" endpoints.

Scaffolding the src/entities/model layer first.

Integrate the inference trigger into the existing Canvas editor.

Ensure the AI-generated labels are marked as system_generated so they can be reviewed in the QA stage.