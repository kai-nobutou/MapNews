import { JsonController, Get, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { TwitterService } from "../services/twitter-service";
import { Service } from "typedi";
import { TweetResponse, GetTweetsQuery } from "../models/TweetModel";

@Service()
@JsonController("/twitter")
export class TwitterController {
    constructor(private twitterService: TwitterService) {}

    @Get("/tweets")
    @OpenAPI({
        summary: "Get tweets",
        description: "Get tweets from Twitter by keywords (AND / OR support)",
        responses: {
            "200": {
                description: "Success",
            },
            "400": {
                description: "Invalid Query",
            }
        }
    })
    async getTweets(@QueryParams() query: GetTweetsQuery): Promise<{ data: TweetResponse[] } | { error: string }> {
        console.log("🚀 受け取ったクエリパラメータ:", query);
    
        if (!query || !query.andGroups || (Array.isArray(query.andGroups) && query.andGroups.length === 0)) {
            console.warn("⚠️ クエリパラメータが undefined または空です！");
            return { error: "クエリパラメータが必要です。" };
        }
    
        try {
            // `andGroups` が文字列の場合、配列に変換
            const andGroups = Array.isArray(query.andGroups) 
                ? query.andGroups 
                : typeof query.andGroups === "string"
                ? [query.andGroups]  // 文字列なら配列にする
                : [];
    
            console.log("📝 検索キーワード:", andGroups);
    
            // TwitterService に渡してツイート取得
            const tweets = await this.twitterService.fetchAndSaveTweets(andGroups as string[]);
            return { data: tweets };
        } catch (error) {
            console.error("❌ Twitter API の取得エラー:", error);
            return { error: "ツイートの取得に失敗しました。" };
        }
    }

    @Get("/tweet")
    async getTweet(@QueryParams() query: GetTweetsQuery): Promise<{ data: TweetResponse[] }> {
        console.log("🚀 [Debug] 受け取ったクエリパラメータ:", query);
        return { 
            data: [
                { id: "1", text: "テストツイート1", createdAt: new Date().toISOString() },
                { id: "2", text: "テストツイート2", createdAt: new Date().toISOString() }
            ] 
        };
    }
}