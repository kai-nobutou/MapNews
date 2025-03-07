export interface TweetResponse {
    id: string;
    text: string;
    createdAt: string;
    authorId?: string| null;
    authorName?: string | null;
    authorProfile?: string | null;
    mediaUrl?: string | null;
}

export class GetTweetsQuery {
    keywords!: string | string[] ;
}