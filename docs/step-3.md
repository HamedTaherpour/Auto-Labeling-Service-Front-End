
**Role:** Senior Frontend Architect & Workflow Systems Expert
**Task:** Implement the Quality Assurance (QA) and Annotation Review System.
**Architecture:** Feature-Sliced Design (FSD).

**Context:**
We have the Editor and the Dataset Management. Now we need to implement the "Review Mode" where supervisors can validate annotations. This is the "Human-in-the-Loop" core of AuraVision, inspired by V7 Darwin's multi-stage workflows.

**Requirements:**

1. **Review Mode UI (Feature):**
* Enhance the `annotation-editor` widget to support a `ReviewMode` state.
* **Approval Controls:** Add a floating action bar with "Approve", "Reject", and "Request Changes" buttons.
* **Visual Feedback:** Rejected annotations should be highlighted with a red border or a specific "Rejected" badge.


2. **Annotation Commenting (Feature):**
* Create `src/features/annotation-comments`: Allow reviewers to click on a specific polygon or box and leave a threaded comment.
* Store comments in `src/entities/comment` and link them to `annotation_id`.


3. **Consensus View (Feature):**
* Implement a "Consensus Toggle" that overlays annotations from multiple labelers (or AI vs. Human) on the same canvas to identify discrepancies.




4. **API Integration (Shared Layer):**
* Map the following from the Postman collection:
* `POST /api/v1/reviews/submit`: To send the final decision for a file.
* `GET /api/v1/files/{id}/history`: To show the audit trail of who labeled/reviewed the file.
* `PATCH /api/v1/annotations/{id}`: To update status or metadata of a specific label.




5. **Workflow Logic & Dashboard Sync:**
* Ensure that when a file is rejected, its status in the `DatasetDetails` page updates to "Re-annotation Required" in real-time.
* Use **Zustand** or **React Query** for managing the review state and optimistic UI updates.


6. **UI/UX Styling:**
* Use a "Review Overlay" style: subtle semi-transparent overlays that indicate the file is in read-only review mode unless a "Correction" is initiated.
* Maintain the V7 aesthetic: High contrast, dark mode, and precise typography.



**Instructions:**

* Start by creating the `src/features/annotation-comments` logic.
* Then, update the Editor to handle the `isReviewMode` flag.
* Finally, connect the Approve/Reject actions to the backend services in the Postman collection.

