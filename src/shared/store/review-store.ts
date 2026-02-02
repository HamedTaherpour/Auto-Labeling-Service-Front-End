import { create } from 'zustand';
import type { Comment } from '../../entities/comment';
import type { Annotation } from '../../entities/annotation';

interface ReviewState {
  // Current file and dataset context
  currentFileId: string | null;
  currentDatasetId: string | null;

  // Review mode state
  isReviewMode: boolean;
  reviewMode: 'view' | 'correction';
  showConsensus: boolean;

  // Annotations and comments
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  comments: Comment[];

  // Review decision state
  reviewDecision: 'approve' | 'reject' | 'request_changes' | null;
  reviewComments: string;
  isLoading: boolean;

  // Consensus data
  consensusAnnotations: Annotation[][];

  // Actions
  setCurrentFile: (fileId: string, datasetId: string) => void;
  setReviewMode: (enabled: boolean, mode?: 'view' | 'correction') => void;
  loadFileData: (fileId: string, datasetId: string) => Promise<void>;
  selectAnnotation: (annotationId: string | null) => void;
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  setAnnotations: (annotations: Annotation[]) => void;

  // Comment actions
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  resolveComment: (commentId: string, resolved: boolean) => void;

  // Review actions
  setReviewDecision: (decision: ReviewState['reviewDecision'], comments?: string) => void;
  submitReview: () => Promise<void>;

  // Consensus actions
  toggleConsensus: () => void;
  setConsensusAnnotations: (annotations: Annotation[][]) => void;
}

export const useReviewStore = create<ReviewState>()((set, get) => ({
  // Initial state
  currentFileId: null,
  currentDatasetId: null,
  isReviewMode: false,
  reviewMode: 'view',
  showConsensus: false,
  annotations: [],
  selectedAnnotationId: null,
  comments: [],
  reviewDecision: null,
  reviewComments: '',
  isLoading: false,
  consensusAnnotations: [],

  // Actions
  setCurrentFile: (fileId: string, datasetId: string) => {
    set({ currentFileId: fileId, currentDatasetId: datasetId });
  },

  setReviewMode: (enabled: boolean, mode = 'view') => {
    set({ isReviewMode: enabled, reviewMode: mode });
  },

  loadFileData: async (fileId: string, datasetId: string) => {
    set({ isLoading: true });

    try {
      // Load annotations and comments would happen here
      // For now, we'll set mock data
      const mockAnnotations: Annotation[] = [
        {
          id: 'ann-1',
          fileId,
          type: 'bbox',
          classId: '1',
          coordinates: [100, 150, 80, 60],
          confidence: 0.95,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        },
      ];

      const mockComments: Comment[] = [
        {
          id: 'comment-1',
          annotationId: 'ann-1',
          fileId,
          authorId: 'user-1',
          authorName: 'John Doe',
          content: 'This bounding box seems slightly off-center',
          createdAt: '2024-01-20T11:00:00Z',
          updatedAt: '2024-01-20T11:00:00Z',
          position: { x: 120, y: 170 },
        },
      ];

      set({
        annotations: mockAnnotations,
        comments: mockComments,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load file data:', error);
      set({ isLoading: false });
    }
  },

  selectAnnotation: (annotationId: string | null) => {
    set({ selectedAnnotationId: annotationId });
  },

  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => {
    const { annotations } = get();
    const updatedAnnotations = annotations.map((ann) =>
      ann.id === annotationId
        ? { ...ann, ...updates, updatedAt: new Date().toISOString() }
        : ann
    );
    set({ annotations: updatedAnnotations });
  },

  setAnnotations: (annotations: Annotation[]) => {
    set({ annotations });
  },

  // Comment actions
  addComment: (commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { comments } = get();
    set({ comments: [...comments, newComment] });
  },

  updateComment: (commentId: string, content: string) => {
    const { comments } = get();
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, content, updatedAt: new Date().toISOString() }
        : comment
    );
    set({ comments: updatedComments });
  },

  deleteComment: (commentId: string) => {
    const { comments } = get();
    set({ comments: comments.filter((c) => c.id !== commentId) });
  },

  resolveComment: (commentId: string, resolved: boolean) => {
    const { comments } = get();
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, resolved, updatedAt: new Date().toISOString() }
        : comment
    );
    set({ comments: updatedComments });
  },

  // Review actions
  setReviewDecision: (decision, comments = '') => {
    set({ reviewDecision: decision, reviewComments: comments });
  },

  submitReview: async () => {
    const { currentFileId, reviewDecision, reviewComments } = get();
    if (!currentFileId || !reviewDecision) return;

    set({ isLoading: true });

    try {
      // Here we would call the API to submit the review
      console.log('Submitting review:', {
        fileId: currentFileId,
        decision: reviewDecision,
        comments: reviewComments,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset state after successful submission
      set({
        reviewDecision: null,
        reviewComments: '',
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Consensus actions
  toggleConsensus: () => {
    const { showConsensus } = get();
    set({ showConsensus: !showConsensus });
  },

  setConsensusAnnotations: (annotations: Annotation[][]) => {
    set({ consensusAnnotations: annotations });
  },
}));