# Multi-View Annotation System Guide

## Overview

The Multi-View Annotation System allows users to work with multiple images/videos simultaneously in a professional grid-based workspace, inspired by V7 Darwin's layout system. This system provides enhanced productivity for complex annotation tasks involving multiple related files.

## Architecture

### Feature-Sliced Design (FSD) Structure

```
src/
├── entities/slot/                    # Slot entity layer
│   ├── index.ts                      # Slot types and exports
│   └── ui/
│       └── SlotContainer.tsx         # Mini-canvas wrapper component
├── features/organize-slots/          # Drag-and-drop feature
│   ├── index.ts
│   └── ui/
│       ├── OrganizeSlots.tsx         # Main drag-drop coordinator
│       └── DraggableFileItem.tsx     # Draggable file component
├── widgets/layout-manager/           # Layout configuration widget
│   ├── index.ts
│   └── ui/
│       └── LayoutSelector.tsx        # Visual grid picker
├── widgets/annotation-editor/
│   ├── index.ts
│   └── ui/
│       └── MultiViewAnnotationEditor.tsx # Main integration component
├── shared/store/layout-store.ts      # Layout state management
└── shared/api/layout-api.ts          # Layout API integration
```

## Key Components

### 1. Slot Entity (`src/entities/slot/`)

The fundamental building block of the multi-view system.

```typescript
interface Slot {
  id: string;
  slotName: string;
  fileId?: string; // Optional - slot can be empty
  layoutPosition: {
    row: number;
    col: number;
  };
  isActive: boolean; // For full-screen mode
}

interface Layout {
  id: string;
  name: string; // e.g., "1x1", "2x2", "3x3"
  rows: number;
  columns: number;
  isDefault?: boolean;
}
```

### 2. Layout State Management (`src/shared/store/layout-store.ts`)

Centralized state management using Zustand for layout configuration and slot management.

**Key Features:**
- Dynamic layout switching (1x1 to 4x4 grids)
- File assignment to slots
- Slot swapping via drag-and-drop
- Full-screen mode management
- Synchronized zoom controls

### 3. Layout Selector Widget (`src/widgets/layout-manager/`)

Visual grid picker for choosing workspace layouts.

**Features:**
- Interactive grid previews
- Default layout management
- Real-time layout updates

### 4. Organize Slots Feature (`src/features/organize-slots/`)

Drag-and-drop functionality using @dnd-kit.

**Supported Interactions:**
- Drag files from gallery to empty slots
- Drag files between occupied slots (auto-swap)
- Visual feedback during drag operations

### 5. Multi-View Annotation Editor (`src/widgets/annotation-editor/ui/MultiViewAnnotationEditor.tsx`)

Main integration component with tabbed interface.

**Tabs:**
- **Workspace**: Main annotation area with slots
- **Layout**: Layout configuration panel
- **Files**: Dataset file management

## API Integration

The system integrates with the following API endpoints:

```typescript
// Save user's preferred layout
POST /api/v1/layouts/set-default

// Get slot configuration for an item
GET /api/v1/items/{id}/slots

// Assign files to slots
PUT /api/v1/items/{id}/slots/assign
```

## Usage Examples

### Basic Integration

```tsx
import { MultiViewAnnotationEditor } from '@/widgets/annotation-editor';

function DatasetPage({ datasetId }: { datasetId: string }) {
  return (
    <MultiViewAnnotationEditor
      datasetId={datasetId}
      className="max-w-none"
    />
  );
}
```

### Advanced Usage with Item Context

```tsx
function ComplexItemAnnotation({ datasetId, itemId }: { datasetId: string; itemId: string }) {
  return (
    <MultiViewAnnotationEditor
      datasetId={datasetId}
      itemId={itemId} // Loads existing slot configuration
      className="h-screen"
    />
  );
}
```

### Custom Layout Management

```tsx
import { useLayoutStore } from '@/shared/store/layout-store';

function CustomLayoutControls() {
  const { currentLayout, setLayout, saveDefaultLayout } = useLayoutStore();

  const handleLayoutChange = async (layoutId: string) => {
    // Find layout by ID and apply it
    const layouts = useLayoutStore.getState().availableLayouts;
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setLayout(layout);
      await saveDefaultLayout(layout);
    }
  };

  return (
    <select
      value={currentLayout.id}
      onChange={(e) => handleLayoutChange(e.target.value)}
    >
      {/* Layout options */}
    </select>
  );
}
```

## UI/UX Features

### Visual Design
- **Black Onyx Theme**: Consistent with existing design system (`#0A0A0A`, `#1A1A1A`)
- **Blaze Orange Accents**: Active states and indicators (`#FF6300`)
- **Responsive Grid**: Adapts to container size

### Interaction Features

1. **Full-Screen Toggle**
   - Each slot has a maximize button
   - Temporarily expands slot to fill entire editor
   - Click again or press Escape to return

2. **Synchronized Zoom**
   - Master zoom toggle in workspace controls
   - When enabled, zoom/pan actions sync across all active slots
   - Maintains consistent view across multiple files

3. **Drag-and-Drop**
   - Visual feedback during drag operations
   - Auto-swap when dropping on occupied slots
   - File gallery with thumbnails and metadata

4. **Layout Persistence**
   - User's default layout saved to backend
   - Layout configurations persist across sessions
   - Star indicator for default layouts

## File Structure and Navigation

### Accessing Multi-View Mode

```
http://localhost:3000/dashboard/datasets/{datasetId}/multi-view
```

### Integration Points

The multi-view system integrates with existing features:
- **Dataset Management**: Loads files from existing datasets
- **Annotation System**: Each slot can contain full annotation canvas
- **Review Workflow**: Supports review mode for multi-file items
- **Export System**: Multi-file exports with slot assignments

## Development Notes

### Dependencies Added

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

### Type Safety

All components are fully typed with TypeScript, ensuring:
- Type-safe slot management
- Proper API integration
- Component prop validation

### Performance Considerations

- Efficient re-rendering with Zustand state management
- Optimized drag-and-drop with @dnd-kit
- Lazy loading of file thumbnails
- Minimal DOM updates during layout changes

## Troubleshooting

### Common Issues

1. **Slots not updating**: Check if `useLayoutStore` is properly initialized
2. **Drag-and-drop not working**: Ensure @dnd-kit packages are installed
3. **Layout not persisting**: Verify API endpoints are accessible
4. **Full-screen mode issues**: Check for z-index conflicts

### Debug Information

Enable debug mode by setting:
```typescript
localStorage.setItem('debug:layout-store', 'true');
```

This will log all layout state changes to the console.

## Future Enhancements

### Planned Features

1. **Advanced Layouts**: Custom grid configurations beyond 4x4
2. **Slot Templates**: Pre-configured layouts for specific use cases
3. **Collaboration**: Real-time synchronization across users
4. **Bulk Operations**: Multi-file annotation actions
5. **Keyboard Shortcuts**: Full keyboard navigation support

### API Extensions

Additional endpoints for advanced features:
- `POST /api/v1/layouts/templates` - Save custom layouts
- `GET /api/v1/items/{id}/slots/history` - Slot assignment history
- `POST /api/v1/layouts/bulk-assign` - Bulk file assignment

---

## Quick Start

1. Navigate to a dataset page
2. Click "Multi-View Annotation" or visit `/dashboard/datasets/{id}/multi-view`
3. Choose a layout using the Layout Selector
4. Drag files from the Files tab to empty slots
5. Start annotating across multiple files simultaneously
6. Use full-screen toggle and synchronized zoom for detailed work

The system is designed to scale from simple 1x1 layouts to complex 4x4 workspaces, providing professional annotation capabilities for diverse use cases.