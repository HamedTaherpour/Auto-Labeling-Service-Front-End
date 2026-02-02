"use client";

import { useEffect, useState } from "react";
import { CommentBubble, CommentThread } from "../../../entities/comment";
import {
  Comment as CommentType,
  CommentThread as CommentThreadType,
} from "../../../entities/comment";
import { useReviewStore } from "../../../shared/store/review-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnotationCommentsProps {
  className?: string;
}

export function AnnotationComments({ className }: AnnotationCommentsProps) {
  const {
    comments,
    selectedAnnotationId,
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
  } = useReviewStore();

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Filter comments for the selected annotation
  const annotationComments = comments.filter(
    (comment) => comment.annotationId === selectedAnnotationId
  );

  // Group comments into threads
  const commentThreads: CommentThreadType[] = annotationComments
    .filter((comment) => !comment.parentId) // Root comments
    .map((rootComment) => ({
      rootComment,
      replies: annotationComments.filter(
        (comment) => comment.parentId === rootComment.id
      ),
    }));

  const handleAddComment = () => {
    if (!selectedAnnotationId || !newCommentContent.trim()) return;

    addComment({
      annotationId: selectedAnnotationId,
      fileId: "", // This would come from the current file
      authorId: "current-user", // This would come from auth
      authorName: "Current User",
      content: newCommentContent.trim(),
      position: { x: 0, y: 0 }, // This would be the click position on canvas
    });

    setNewCommentContent("");
    setIsAddingComment(false);
  };

  const handleReply = (content: string, parentId: string) => {
    if (!selectedAnnotationId) return;

    addComment({
      annotationId: selectedAnnotationId,
      fileId: "", // This would come from the current file
      authorId: "current-user", // This would come from auth
      authorName: "Current User",
      content,
      parentId,
    });
  };

  if (!selectedAnnotationId) {
    return (
      <div
        className={cn(
          "bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4",
          className
        )}
      >
        <div className="text-center text-gray-400 py-8">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an annotation to view comments</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#FF6300]" />
            <h3 className="text-lg font-semibold text-white">Comments</h3>
            <span className="text-sm text-gray-400">
              {/* ({annotationComments.length}) */}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingComment(!isAddingComment)}
            className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Add Comment Form */}
      {isAddingComment && (
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="bg-[#1A1A1A] border-[#2A2A2A] text-white resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newCommentContent.trim()}
                className="bg-[#FF6300] hover:bg-[#FF6300]/90 disabled:opacity-50"
              >
                Add Comment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingComment(false);
                  setNewCommentContent("");
                }}
                className="border-[#2A2A2A] text-gray-400 hover:bg-[#1A1A1A]"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {commentThreads.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Click "Add Comment" to start a discussion
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {commentThreads.map((thread) => (
                <CommentThread
                  key={thread.rootComment.id}
                  thread={thread}
                  onReply={handleReply}
                  onEdit={updateComment}
                  onDelete={deleteComment}
                  onResolve={resolveComment}
                  currentUserId="current-user"
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
