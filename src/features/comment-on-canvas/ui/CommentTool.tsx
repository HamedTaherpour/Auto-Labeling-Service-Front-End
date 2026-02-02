import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, AtSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentToolProps {
  position: { x: number; y: number };
  onSubmit: (content: string, mentions: string[]) => void;
  onCancel: () => void;
  teamMembers?: Array<{ id: string; name: string; avatar?: string }>;
  className?: string;
}

export function CommentTool({
  position,
  onSubmit,
  onCancel,
  teamMembers = [],
  className
}: CommentToolProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);

    // Check for @ symbol and extract mention query
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      if (!query.includes(' ')) {
        setMentionQuery(query);
        setShowMentions(true);
        setCursorPosition(cursorPos);
        return;
      }
    }

    setShowMentions(false);
  };

  const handleMentionSelect = (member: { id: string; name: string }) => {
    const beforeAt = content.substring(0, cursorPosition - mentionQuery.length - 1);
    const afterCursor = content.substring(cursorPosition);
    const newContent = `${beforeAt}@${member.name} ${afterCursor}`;

    setContent(newContent);
    setShowMentions(false);
    setMentionQuery('');

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeAt.length + member.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  };

  const handleSubmit = () => {
    if (content.trim()) {
      const mentions = extractMentions(content);
      onSubmit(content.trim(), mentions);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className={cn(
          'fixed z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-lg shadow-2xl',
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)', // Position above the click point
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#FF6300]" />
            <span className="text-sm font-medium text-white">Add Comment</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3 min-w-[300px]">
          <Textarea
            ref={textareaRef}
            placeholder="Type your comment here... Use @ to mention team members"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-white resize-none focus:border-[#FF6300] min-h-[80px]"
            rows={3}
          />

          {/* Mention Suggestions */}
          <AnimatePresence>
            {showMentions && filteredMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg max-h-40 overflow-y-auto"
              >
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleMentionSelect(member)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] transition-colors text-left"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-[#FF6300] text-white text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white">{member.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <AtSign className="h-3 w-3" />
            <span>Use @ to mention</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="border-[#2A2A2A] text-gray-400 hover:bg-[#1A1A1A]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="bg-[#FF6300] hover:bg-[#FF6300]/90 disabled:opacity-50"
            >
              <Send className="h-3 w-3 mr-1" />
              Comment
            </Button>
          </div>
        </div>

        {/* Arrow pointing to click position */}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0A0A0A]"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}