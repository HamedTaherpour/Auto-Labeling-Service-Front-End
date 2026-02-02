Role: Senior UX Engineer & Workspace Architect Task: Implement the "Multi-view Layouts" and "Item Slots" system for the Annotation Editor. Architecture: Feature-Sliced Design (FSD).

Context: We need to evolve the editor from a single-canvas view to a professional multi-window workspace inspired by V7 Darwin's "Layouts". This allows users to view and annotate multiple files (Slots) within a single screen simultaneously.

Requirements:

Layout Selector Widget (src/widgets/layout-manager):

Implement a grid-style selector (e.g., 1x1, 1x2, 2x2, up to 4x4) to define the workview structure.

Use a visual grid-picker UI where users can hover and select the number of rows and columns.

Slot Entity (src/entities/slot):

Define the Slot model: slot_name, file_id, and layout_position.

Create a SlotContainer component that acts as a mini-canvas wrapper for each grid cell.

Drag-and-Drop Interaction (Feature - src/features/organize-slots):

Implement logic to drag images/videos from the bottom carousel and drop them into specific grid slots.

If a file is dragged to an occupied slot, it should swap positions automatically.

Use @dnd-kit or Pragmatic Drag-and-Drop for high-performance interactions.

API Integration (Shared Layer):

Map from the Postman collection:

POST /api/v1/layouts/set-default: To save the user's preferred grid configuration.

GET /api/v1/items/{id}/slots: To fetch the multi-file structure of a complex item.

PUT /api/v1/items/{id}/slots/assign: To register a file into a specific slot.

UI & UX Precision:

Full-screen Toggle: Each slot should have a button to expand it to fill the entire editor temporarily.

Synchronized Zoom: Add a toggle to "Sync Views," so zooming/panning in one slot mirrors the action in all other active slots.

Maintain the "Black Onyx" theme with subtle Blaze Orange (#FF6300) indicators for the active slot.

Instructions:

Setup the src/entities/slot and the layout state management (Zustand) first.

Build the LayoutSelector to dynamically update the CSS Grid of the editor lab.

Implement the Drag-and-Drop feature to link files from the dataset gallery to the slots.