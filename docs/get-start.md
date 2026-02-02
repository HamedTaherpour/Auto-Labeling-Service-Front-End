
**Role:** Senior Frontend Architect
**Task:** Initialize the Internal Dashboard (Dataset Management) for "AuraVision"
**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Shadcn UI, pnpm.
**Architecture:** Strictly follow Feature-Sliced Design (FSD).

**Context:**
I am building the internal product/dashboard similar to V7 Darwin. We are starting with the **Dataset Management Module**. I have attached a Postman Collection containing the backend services. Your goal is to scaffold the architecture and implement the first feature: **Dataset Listing & Statistics**.

**Requirements:**

1. **FSD Structure Setup:**
* Create the base layers: `src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`.
* Setup `shared/api` with an Axios or Fetch client tailored to the base URL and headers found in the attached Postman collection.


2. **Entity Implementation (Dataset):**
* Create `src/entities/dataset`: Define the TypeScript interface based on the `GET /api/v1/datasets` response from Postman.
* Implement a simple `DatasetCard` and `DatasetStatus` badge component.


3. **Feature Implementation (Dataset List):**
* Create `src/features/dataset-list`: Implement a component that fetches data using the backend service.
* Include a search and filter bar (by status: 'In Progress', 'Completed', 'Annotating').


4. **Widget & Page:**
* Create a `Sidebar` and `Header` widget in `src/widgets`.
* Implement the `src/pages/dashboard` which composes these widgets and the dataset list feature.


5. **Design Language:**
* **Modern Dark UI:** Use a professional, data-dense layout. Dark background (#0A0A0A), subtle borders (#1A1A1A), and V7-inspired accent colors (#FF6300).
* Use **Skeleton Loading** states for the dataset list while fetching.
* Ensure the UI feels like a high-precision engineering tool, not a generic SaaS.



**Instructions:**

* Analyze the attached Postman Collection to map the `baseUrl` and specific endpoints for datasets and stats.
* Start by creating the folder structure and the `shared/api` layer.
* Then, proceed to the `entities` and `features`.
* Finally, build the dashboard page.

**Please provide the implementation step-by-step and explain the folder organization according to FSD.**

