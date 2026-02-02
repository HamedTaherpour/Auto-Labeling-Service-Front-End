// Comment entity types and interfaces
export interface Comment {
  id: string;
  annotationId: string;
  fileId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string; // For threaded comments
  position?: { x: number; y: number }; // Position on canvas
  resolved?: boolean;
}

export interface CommentThread {
  rootComment: Comment;
  replies: Comment[];
}

// Re-export components
export { CommentBubble } from './ui/CommentBubble';
export { CommentThread } from './ui/CommentThread';
