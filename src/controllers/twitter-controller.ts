import { JsonController, Get, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { TwitterService } from "../services/twitter-service";
import { Service } from "typedi";
import { TweetResponse, GetTweetsQuery} from "../models/ TweetModel";

@Service()
@JsonController("/twitter")
export class TwitterController {
    constructor(private twitterService: TwitterService) {}


    @Get("/tweets")
    @OpenAPI({
        summary: "Get tweets",
        description: "Get tweets from Twitter by keywords",
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

        if (!query || !query.keywords) {
            console.warn("⚠️ クエリパラメータが undefined です！");
            return { error: "クエリパラメータが必要です。" };
        }
    
        // `keywords` が `string` の場合、配列に変換する
        const keywords: string[] = Array.isArray(query.keywords)
        ? query.keywords
        : typeof query.keywords === "string"
            ? query.keywords.split(",")
            : [];
            if (keywords.length === 0) {
                return { error: "クエリパラメータが空です。" };
        }

        const tweets = await this.twitterService.fetchAndSaveTweets(query.keywords);

        return {
            data: tweets
        };
    }
}