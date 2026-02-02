import { apiClient } from "./client";
import { Comment, CommentThread } from '@/entities/comment';

export interface CreateCommentRequest {
  fileId: string;
  content: string;
  position?: { x: number; y: number };
  parentId?: string;
  mentions?: string[];
}

export interface UpdateCommentRequest {
  content?: string;
  resolved?: boolean;
}

export interface CommentThreadResponse {
  id: string;
  rootComment: Comment;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

class CommentApi {
  // Get comment threads for a file
  async getCommentThreads(fileId: string): Promise<CommentThreadResponse[]> {
    const response = await apiClient.get(`/api/v1/items/${fileId}/comment-threads`);
    return response.data;
  }

  // Create a new comment thread
  async createCommentThread(data: CreateCommentRequest): Promise<CommentThreadResponse> {
    const response = await apiClient.post('/api/v1/comment-threads', data);
    return response.data;
  }

  // Update a comment
  async updateComment(commentId: string, data: UpdateCommentRequest): Promise<Comment> {
    const response = await apiClient.patch(`/api/v1/comments/${commentId}`, data);
    return response.data;
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/api/v1/comments/${commentId}`);
  }

  // Resolve/unresolve a comment thread
  async resolveCommentThread(threadId: string, resolved: boolean): Promise<CommentThreadResponse> {
    const response = await apiClient.patch(`/api/v1/comment-threads/${threadId}/resolve`, { resolved });
    return response.data;
  }

  // Get comments for current user (mentions, etc.)
  async getUserComments(userId: string): Promise<Comment[]> {
    const response = await apiClient.get(`/api/v1/users/${userId}/comments`);
    return response.data;
  }

  // Add reply to comment thread
  async addCommentReply(parentId: string, data: Omit<CreateCommentRequest, 'parentId'>): Promise<Comment> {
    const response = await apiClient.post(`/api/v1/comments/${parentId}/replies`, data);
    return response.data;
  }
}

export const commentApi = new CommentApi();