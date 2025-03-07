import { Service } from "typedi";
import { readOnlyTwitterClient } from "../config/twitter"; 
import { TweetResponse } from "../models/ TweetModel";
import { prisma } from "../config/prisma";



@Service()
export class TwitterService {
    /**
     * キーワードを指定してツイートを取得し、DBに保存
     * @param keywords 検索するキーワードの配列
     * @returns 保存されたツイートのリスト
     */
    async fetchAndSaveTweets(keywords:string |string[]): Promise<TweetResponse[]> {
        try {
        
            // AND検索（スペース区切り）に変換
            const query = Array.isArray(keywords) ? keywords.join(" ") : keywords;

            // 🔹 過去に取得したツイートの最新の createdAt を取得
            const lastTweet = await prisma.tweet.findFirst({
                where: { text: { contains: keywords[0] } }, // 最初のキーワードを含むツイート
                orderBy: { createdAt: "desc" }, // 最新のツイート
            });

            // 🔹 検索時に「since_id」を指定
            const searchParams: any = {
                "tweet.fields": "created_at,public_metrics",
                "media.fields": "url,preview_image_url",
                "expansions": "attachments.media_keys,author_id",
                "user.fields": "username,profile_image_url",
                "max_results": 10,
            };
            if (lastTweet) {
                searchParams.since_id = lastTweet.id; // 最新のツイートID以降のものだけ取得
            }

            // Twitter API で新しいツイートを取得
            console.log("検索キーワード:", keywords);
            const response = await readOnlyTwitterClient.v2.search(query, searchParams);
            console.log("APIレスポンス:", response);
            if (!response.data || !response.data.data) {
                console.warn("⚠️ 新しいツイートが見つかりませんでした。");
                return [];
            }

            // 取得したツイートデータをDBに保存
            const savedTweets = await Promise.all(
                response.data.data.map(async (tweet) => {
                    if (!tweet.id || !tweet.text) {
                        console.warn(`⚠️ 不完全なツイートデータ: ${JSON.stringify(tweet)}`);
                        return null;
                    }

                    // 既にDBにあるツイートはスキップ
                    const existingTweet = await prisma.tweet.findUnique({
                        where: { id: tweet.id },
                    });
                    if (existingTweet) return null;

                    const user = response.includes?.users?.find(u => u.id === tweet.author_id);
                    const media = response.includes?.media?.find(m => m.media_key === tweet.attachments?.media_keys?.[0]);

                    return prisma.tweet.create({
                        data: {
                            id: tweet.id,
                            text: tweet.text,
                            createdAt: new Date(tweet.created_at!),
                            authorId: tweet.author_id ?? null,
                            authorName: user?.username || "Unknown",
                            authorProfile: user?.profile_image_url || null,
                            mediaUrl: media?.url || null
                        }
                    });
                })
            );

            return savedTweets.filter(tweet => tweet !== null)
            .map(tweet => ({
                id: tweet!.id,
                text: tweet!.text,
                createdAt: tweet!.createdAt.toISOString(), // 明示的に文字列へ変換
                authorId: tweet!.authorId || null,
                authorName: tweet!.authorName || null,
                authorProfile: tweet!.authorProfile || null,
                mediaUrl: tweet!.mediaUrl || null
            }));
        } catch (error) {
            console.error("❌ ツイート取得 & DB保存エラー:", error);
            throw new Error("ツイートの取得または保存に失敗しました");
        }
    }
}