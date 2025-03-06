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

        if (!query || !query.keywords || query.keywords.length === 0) {
            console.warn("⚠️ クエリパラメータが undefined または空です！");
            return { error: "クエリパラメータが必要です。" };
        }

        const tweets = await this.twitterService.fetchAndSaveTweets(query.keywords);

        return {
            data: tweets
        };
    }
}