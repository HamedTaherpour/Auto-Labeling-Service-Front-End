

**Role:** Senior Frontend Engineer & UI/UX Specialist
**Task:** Implement the "Dataset Details" page with Workflow Visualization.
**Architecture:** Feature-Sliced Design (FSD).

**Context:**
Now that we have the Dataset List, we need to build the "Drill-down" view for a specific dataset (e.g., `/dashboard/datasets/[id]`). This page is critical for managing the "Human-in-the-Loop" workflow.

**Requirements:**

1. **API Integration (Shared Layer):**
* Update `src/shared/api` to include `GET /api/v1/datasets/{id}` and `GET /api/v1/datasets/{id}/files` (map these to the corresponding endpoints in the attached Postman collection).
* Use dynamic routing in Next.js for the dataset ID.


2. **Workflow Feature (`src/features/workflow-tracker`):**
* Build a visual "Workflow Pipeline" component. It should show stages like: `Unprocessed` -> `Labeling` -> `Review` -> `Complete`.


* Each stage should show the count of items currently in that state.
* Use a clean, linear progress design with subtle glow effects on the "Active" stage.


3. **File Grid Entity (`src/entities/dataset-file`):**
* Implement a grid view to display thumbnails of images/videos within the dataset.
* Each thumbnail should have a status badge (e.g., 'Annotated', 'In Review').


4. **Stats Widget (`src/widgets/dataset-stats`):**
* Create a summary card showing: "Total Annotations", "Average Precision", and "Review Progress".
* Use realistic mock data from `Faker.js` if the real stats endpoint is slow or not fully populated.




5. **UI/UX Refinement:**
* Maintain the "V7 Darwin" aesthetic: Dark theme (#292929), Blaze Orange accents (#FF6300), and crisp borders.


* Use **Framer Motion** for a "Staggered Fade-in" animation of the file grid.


* Add a "Breadcrumb" navigation in the Header to easily return to the Dataset List.



**Instructions:**

* First, create the `src/entities/dataset-file` folder and its public API.
* Then, implement the `WorkflowTracker` feature.
* Finally, assemble everything into the `DatasetDetailsPage` in `src/pages/dataset-details`.

