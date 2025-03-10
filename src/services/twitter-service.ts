import { Service } from "typedi";
import { readOnlyTwitterClient } from "../config/twitter"; 
import { TweetResponse } from "../models/TweetModel";
import { prisma } from "../config/prisma";

@Service()
export class TwitterService {
    /**
     * キーワードを指定してツイートを取得し、DBに保存
     * @param andGroups 検索するキーワードのANDグループ配列
     * @returns 保存されたツイートのリスト
     */
    async fetchAndSaveTweets(andGroups: string[]): Promise<TweetResponse[]> {
        try {
            if (!andGroups || andGroups.length === 0) {
                throw new Error("検索キーワードが指定されていません");
            }

            // 🔹 各 ANDグループを `"火災" "西区"` のような完全一致検索にする
            const queries = andGroups.map(group => {
                return `(${group.split(",").map(word => `"${word}"`).join(" ")})`; 
            });

            // 🔹 OR で結合 → `("火災" "西区") OR ("火災" "内浜")`
            const query = queries.join(" OR ");

            console.log("🔎 検索クエリ:", query);

            // 🔹 過去に取得したツイートの最新の `createdAt` を取得
            const lastTweet = await prisma.tweet.findFirst({
                where: { text: { contains: andGroups[0].split(",")[0] } }, // 最初のキーワードを含むツイート
                orderBy: { createdAt: "desc" },
            });

            // 🔹 検索時のパラメータ
            const searchParams: any = {
                query: query,
                "tweet.fields": "created_at,public_metrics",
                "media.fields": "url,preview_image_url",
                "expansions": "attachments.media_keys,author_id",
                "user.fields": "username,profile_image_url",
                "max_results": 10,
            };
            if (lastTweet) {
                searchParams.since_id = lastTweet.id; // 最新のツイートID以降を取得
            }

            // 🔹 Twitter API で新しいツイートを取得
            const response = await readOnlyTwitterClient.v2.search(query, searchParams);
            console.log("APIレスポンス:", response);
            if (!response.data || !response.data.data) {
                console.warn("⚠️ 新しいツイートが見つかりませんでした。");
                return [];
            }

            // 🔹 取得したツイートをDBに保存
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
                createdAt: tweet!.createdAt.toISOString(),
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