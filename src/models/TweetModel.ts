export interface TweetResponse {
    id: string;
    text: string;
    createdAt: string;
    authorId?: string | null;
    authorName?: string | null;
    authorProfile?: string | null;
    mediaUrl?: string | null;
}

export class GetTweetsQuery {
    andGroups!: string | string[];// 🔹 変更: AND検索のグループ
}