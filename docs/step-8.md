Role: Senior Product Engineer & Data Architect Task: Implement the "Dataset Properties" (Custom Metadata) system. Architecture: Feature-Sliced Design (FSD).

Context: We need to implement a sophisticated Metadata system inspired by V7 Darwin's "Properties". This allows users to define a schema of custom fields (e.g., Camera Model, Weather, Location) for their dataset items. These properties are used for advanced filtering and enriching the training data.

Requirements:

Property Schema Manager (Feature - src/features/manage-properties):

Create a UI in the Dataset Settings to define global properties.

Supported Types: Text, Single Select, Multi-select, and Instance ID.

Map to POST /api/v1/properties and GET /api/v1/properties from the Postman collection.

Editor Property Sidebar (Widget - src/widgets/property-editor):

In the Annotation Editor, add a new sidebar panel for "Item Properties".

Dynamically render form fields based on the defined schema for the current dataset.

Allow users to fill or update metadata for the active image/frame.

Use React Hook Form for efficient state management within the canvas environment.

Advanced Filtering (Feature - src/features/item-filters):

Update the Dataset Grid view to allow filtering by these custom properties.

Implement a "Query Builder" style UI where users can say: Weather is 'Sunny' AND Camera is 'Model-X'.

API Integration (Shared Layer):

Map from the Postman collection:

PUT /api/v1/properties/{id}/values: To update metadata for a specific item.

GET /api/v1/datasets/{id}/property-counts: To show statistical distribution of metadata values.

UI & UX:

Use a data-dense, professional style.

Ensure a "Type-safe" implementation for property values (TypeScript Discriminated Unions).

Maintain the V7 aesthetic: Dark mode, sharp borders, and subtle Blaze Orange (#FF6300) for active states.

Instructions:

Start by creating the src/entities/property layer.

Build the Schema Creator feature first to define what properties exist.

Integrate the property fields into the existing Editor sidebar.

Finally, enable the filtering logic on the Dataset Details page.