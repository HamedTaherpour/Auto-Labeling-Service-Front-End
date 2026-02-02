import { CommentBubble } from './CommentBubble';
import { CommentThread as CommentThreadType } from '../index';

interface CommentThreadProps {
  thread: CommentThreadType;
  onReply?: (content: string, parentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onResolve?: (commentId: string, resolved: boolean) => void;
  currentUserId?: string;
  className?: string;
}

export function CommentThread({
  thread,
  onReply,
  onEdit,
  onDelete,
  onResolve,
  currentUserId,
  className
}: CommentThreadProps) {
  return (
    <div className={className}>
      {/* Root Comment */}
      <CommentBubble
        comment={thread.rootComment}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
        onResolve={onResolve}
        currentUserId={currentUserId}
      />

      {/* Replies */}
      {thread.replies.map((reply) => (
        <CommentBubble
          key={reply.id}
          comment={reply}
          isReply
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onResolve={onResolve}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
