import { useState, useEffect, useCallback } from 'react';
import { CommentTool } from './CommentTool';
import { CommentBubble, CommentThread } from '@/entities/comment';
import { CommentThread as CommentThreadType } from '@/entities/comment';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommentOnCanvasProps {
  isActive: boolean;
  canvasRef: React.RefObject<HTMLElement>;
  onCommentAdd: (position: { x: number; y: number }, content: string, mentions: string[]) => void;
  commentThreads: CommentThreadType[];
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
  onCommentResolve?: (commentId: string, resolved: boolean) => void;
  currentUserId?: string;
  teamMembers?: Array<{ id: string; name: string; avatar?: string }>;
  className?: string;
}

export function CommentOnCanvas({
  isActive,
  canvasRef,
  onCommentAdd,
  commentThreads,
  onCommentEdit,
  onCommentDelete,
  onCommentResolve,
  currentUserId,
  teamMembers = [],
  className
}: CommentOnCanvasProps) {
  const [isCommentToolOpen, setIsCommentToolOpen] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);

  // Update canvas rect when canvas changes
  useEffect(() => {
    const updateCanvasRect = () => {
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    };

    updateCanvasRect();
    window.addEventListener('resize', updateCanvasRect);
    return () => window.removeEventListener('resize', updateCanvasRect);
  }, [canvasRef]);

  // Handle canvas click for comment tool
  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!isActive || !canvasRect) return;

    // Check if click is within canvas bounds
    const rect = canvasRect;
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      // Convert screen coordinates to canvas-relative coordinates
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      setCommentPosition({
        x: event.clientX,
        y: event.clientY
      });
      setIsCommentToolOpen(true);
    }
  }, [isActive, canvasRect]);

  // Add click listener when comment tool is active
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [canvasRef, isActive, handleCanvasClick]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 'C' key to activate comment tool
      if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        // This would be handled by the parent component to switch to comment tool
      }

      // Escape to cancel comment tool
      if (event.key === 'Escape' && isCommentToolOpen) {
        setIsCommentToolOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommentToolOpen]);

  const handleCommentSubmit = (content: string, mentions: string[]) => {
    if (canvasRect) {
      // Convert screen coordinates back to canvas coordinates for storage
      const canvasX = commentPosition.x - canvasRect.left;
      const canvasY = commentPosition.y - canvasRect.top;

      onCommentAdd({ x: canvasX, y: canvasY }, content, mentions);
    }
    setIsCommentToolOpen(false);
  };

  const handleCommentCancel = () => {
    setIsCommentToolOpen(false);
  };

  return (
    <>
      {/* Comment Tool Overlay */}
      <AnimatePresence>
        {isCommentToolOpen && (
          <CommentTool
            position={commentPosition}
            onSubmit={handleCommentSubmit}
            onCancel={handleCommentCancel}
            teamMembers={teamMembers}
          />
        )}
      </AnimatePresence>

      {/* Existing Comment Threads on Canvas */}
      <AnimatePresence>
        {commentThreads.map((thread) => (
          <motion.div
            key={thread.rootComment.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn('absolute z-40', className)}
            style={{
              left: thread.rootComment.position?.x || 0,
              top: thread.rootComment.position?.y || 0,
              transform: 'translate(-50%, -100%)', // Position above the comment point
            }}
          >
            <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-lg shadow-lg max-w-xs">
              <CommentThread
                thread={thread}
                onReply={(content, parentId) => {
                  // Handle reply - would need to be passed from parent
                  console.log('Reply to comment:', parentId, content);
                }}
                onEdit={onCommentEdit}
                onDelete={onCommentDelete}
                onResolve={onCommentResolve}
                currentUserId={currentUserId}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comment markers on canvas (small dots/pins) */}
      {commentThreads.map((thread) => (
        <motion.div
          key={`marker-${thread.rootComment.id}`}
          className={cn(
            'absolute w-3 h-3 rounded-full border-2 border-white shadow-lg z-30 cursor-pointer',
            thread.rootComment.resolved
              ? 'bg-green-500'
              : 'bg-[#FF6300] animate-pulse'
          )}
          style={{
            left: thread.rootComment.position?.x || 0,
            top: thread.rootComment.position?.y || 0,
            transform: 'translate(-50%, -50%)',
          }}
          whileHover={{ scale: 1.2 }}
          onClick={() => {
            // Could scroll to or highlight the comment
            console.log('Clicked comment marker:', thread.rootComment.id);
          }}
        />
      ))}
    </>
  );
}