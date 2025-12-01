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
    type Score
} from './kv-store';

// Keep other interfaces that are used elsewhere
export interface Batsman {
    name: string;
    runs: string;
    balls: string;
    fours: string;
    sixes: string;
    sr: string;
}

export interface Bowler {
    name: string;
    overs: string;
    maidens: string;
    runs: string;
    wickets: string;
    economy: string;
    extras?: string;
}

export interface UpcomingMatch {
    title: string;
    status: string;
    isLive: boolean;
    id?: string;
    startTime?: string;
}
