
**Role:** Senior Full-Stack Frontend Engineer
**Task:** Build the Interactive Annotation Interface (The Editor Lab).
**Architecture:** Feature-Sliced Design (FSD).

**Context:**
We have the Dataset List and Details. Now, we need to build the actual workview where users label data. This is a high-precision tool inspired by V7 Darwin's editor. I have attached the Postman collection for backend integration.

**Requirements:**

1. **Editor Layout (Widget):**
* Create `src/widgets/annotation-editor`: A full-screen workspace.
* **Left Sidebar (Toolbar):** Icons for 'Bounding Box', 'Polygon', 'Auto-Annotate (AI)', and 'Select'.
* **Right Sidebar (Class Manager):** List of annotation classes (e.g., 'Car', 'Pedestrian') with color coding.
* **Main Canvas:** A central area to render the image/video frame with zoom and pan capabilities.


2. **Annotation Logic (Feature):**
* Create `src/features/draw-annotations`: Use a library like `fabric.js` or `Konva.js` (or raw HTML5 Canvas) to allow drawing shapes.
* Implement "Class Selection": Before drawing, the user must select a class from the right sidebar.


3. **Backend Integration (Shared Layer):**
* Use the Postman collection to implement:
* `GET /api/v1/files/{file_id}/annotations`: To load existing labels.
* `POST /api/v1/files/{file_id}/annotations`: To save new labels.


* Implement "Auto-Save" logic: Every time a shape is completed, send a partial update to the backend.


4. **UI/UX & Precision:**
* **Theme:** Ultra-dark professional interface. Use `#000000` for the canvas background to make the image pop.
* **Crosshair:** Implement a global crosshair for pixel-perfect alignment when drawing.
* **Hotkeys:** Add 'B' for Box, 'P' for Polygon, and 'Cmd+Z' for undo.


5. **Entity (Annotation):**
* Define the `Annotation` model in `src/entities/annotation` with fields for `id`, `type`, `coordinates`, and `class_id`.



**Instructions:**

* Focus on the `shared/ui` for the toolbar buttons first.
* Set up the Canvas engine in the `features` layer.
* Integrate the saving API from the Postman collection.

