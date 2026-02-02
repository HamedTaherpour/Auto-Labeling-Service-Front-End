Role: Senior Full-Stack Frontend Engineer & Real-time Systems Expert Task: Implement the Interactive Commenting System and Real-time Notification Center. Architecture: Feature-Sliced Design (FSD).

Context: AuraVision is now a complex multi-user platform. We need to implement a collaborative layer inspired by V7 Darwin's "Comment Tool". This allows annotators and reviewers to communicate directly within the image/video canvas using threaded comments and @mentions.

Requirements:

Comment Tool feature (src/features/comment-on-canvas):

Add a "Comment" tool (Shortcut 'C') to the editor toolbar.

Interaction: Users can click or draw a bounding box on the canvas to start a comment thread linked to a specific coordinate or object.

UI: A floating comment card with a text area and "@mention" autocomplete support for team members.

Notification Center widget (src/widgets/notification-center):

Implement a bell icon in the main header with a red dot for unread alerts.

Alert Types: "Mentioned in comment", "Assignment updated", "Dataset export ready", "Workflow stage changed".

Map to GET /api/v1/notifications from the Postman collection.

Real-time Engine (src/shared/lib/realtime):

Setup a WebSocket or Server-Sent Events (SSE) listener (e.g., using Socket.io or Supabase Realtime).

Ensure that when a comment is added, the notification bell updates instantly for the tagged user without a page refresh.

Comment Entity (src/entities/comment):

Define the CommentThread type: id, author_id, body, coordinates, status (Open/Resolved), and replies.

Implement "Resolve" logic: Clicking "Resolve" should hide the comment from the active view but keep it in the history.

API Integration (Shared Layer):

Map these from the Postman collection:

GET /api/v1/items/{id}/comment-threads: To load comments for the current file.

POST /api/v1/comment-threads: To create a new thread with initial coordinates.

PATCH /api/v1/comments/{id}: To edit or resolve a comment.

UI/UX & Polish:

Visuals: Use a "Glassmorphic" style for comment bubbles.

Animations: Use Framer Motion for smooth opening/closing of comment threads and notification popups.

Themes: High-contrast Dark Mode with Blaze Orange (#FF6300) for unread states.

Instructions:

Analyze the Postman collection for "Comments" and "Notifications" folders.

Start by building the src/entities/notification model and the NotificationCenter widget.

Integrate the canvas-based comment trigger in the editor lab features.

Connect everything to the real-time listener in the shared layer.