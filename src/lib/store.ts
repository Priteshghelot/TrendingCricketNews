// Re-export everything from kv-store for backward compatibility
export {
    getPosts,
    getPublishedPosts,
    getPostById,
    addPost,
    updatePostStatus,
    deletePost,
    getScore,
    saveScore,
    type Post,
    type Score,
    type Batsman,
    type Bowler,
    type MatchPreview,
    type DetailedScore
} from './kv-store';

import { MatchPreview } from './kv-store';

// Alias for backward compatibility if needed
export type UpcomingMatch = MatchPreview;
