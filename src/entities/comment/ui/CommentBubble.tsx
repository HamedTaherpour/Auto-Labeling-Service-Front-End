import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Reply, Edit, Trash, Check, X } from 'lucide-react';
import { Comment } from '../index';
import { cn } from '@/lib/utils';

interface CommentBubbleProps {
    comment: Comment;
    isReply?: boolean;
    onReply?: (content: string, parentId: string) => void;
    onEdit?: (commentId: string, content: string) => void;
    onDelete?: (commentId: string) => void;
    onResolve?: (commentId: string, resolved: boolean) => void;
    currentUserId?: string;
    className?: string;
}

export function CommentBubble({
    comment,
    isReply = false,
    onReply,
    onEdit,
    onDelete,
    onResolve,
    currentUserId,
    className
}: CommentBubbleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');

    const isAuthor = currentUserId === comment.authorId;
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    const handleEdit = () => {
        if (onEdit && editContent.trim() !== comment.content) {
            onEdit(comment.id, editContent.trim());
        }
        setIsEditing(false);
    };

    const handleReply = () => {
        if (onReply && replyContent.trim()) {
            onReply(replyContent.trim(), comment.id);
            setReplyContent('');
            setIsReplying(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsReplying(false);
        setEditContent(comment.content);
        setReplyContent('');
    };

    return (
        <div className={cn(
            'bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 mb-2',
            isReply && 'ml-8 border-l-4 border-l-[#FF6300]',
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`/avatars/${comment.authorId}.jpg`} />
                        <AvatarFallback className="bg-[#FF6300] text-white text-xs">
                            {comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white">{comment.authorName}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1">
                    {comment.resolved && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Resolved
                        </span>
                    )}

                    {isAuthor && !isEditing && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete?.(comment.id)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </>
                    )}

                    {onResolve && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onResolve(comment.id, !comment.resolved)}
                            className={cn(
                                "h-6 w-6 p-0",
                                comment.resolved
                                    ? "text-green-400 hover:text-green-300"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Check className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="space-y-2">
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-[#0A0A0A] border-[#2A2A2A] text-white text-sm resize-none"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleEdit}
                            className="bg-[#FF6300] hover:bg-[#FF6300]/90"
                        >
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="border-[#2A2A2A] text-gray-400 hover:bg-[#1A1A1A]"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
            )}

            {/* Actions */}
            {!isEditing && (
                <div className="flex items-center gap-2 mt-3">
                    {!isReply && onReply && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReplying(!isReplying)}
                            className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                        </Button>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageCircle className="h-3 w-3" />
                        <span>Thread</span>
                    </div>
                </div>
            )}

            {/* Reply Form */}
            {isReplying && (
                <div className="mt-3 space-y-2">
                    <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-[#0A0A0A] border-[#2A2A2A] text-white text-sm resize-none"
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleReply}
                            disabled={!replyContent.trim()}
                            className="bg-[#FF6300] hover:bg-[#FF6300]/90 disabled:opacity-50"
                        >
                            Reply
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="border-[#2A2A2A] text-gray-400 hover:bg-[#1A1A1A]"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
