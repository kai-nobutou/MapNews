export interface TweetResponse {
    id: string;
    text: string;
    createdAt: string;
    authorId?: string;
    authorName?: string;
    authorProfile?: string | null;
    mediaUrl?: string | null;
}

export class GetTweetsQuery {
    keywords!: string[];
}