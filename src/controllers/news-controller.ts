// import { JsonController, Get, QueryParam } from "routing-controllers";
// import { OpenAPI } from "routing-controllers-openapi";
// import { NewsService } from "../services/news-service";
// import { Service } from "typedi";
// import { NewsResponse } from "../models/news-model";


// @Service()
// @JsonController("/news")
// export class NewsController {
//     constructor(private newsService: NewsService) {}

//     @Get("/")
//     @OpenAPI({
//         summary: "Get news",
//         description: "Get news from News API by keywords",
//         responses: {
//             "200": {
//                 description: "Success",
//             },
//             "400": {
//                 description: "Invalid Query",
//             }
//         }
//     })
//     async getNews(@QueryParam("keywords") keywords: string): Promise<{ data: NewsResponse[] } | { error: string }> {
//         if (!keywords) {
//             console.warn("⚠️ クエリパラメータが undefined です！");
//             return { error: "クエリパラメータが必要です。" };
//         }
//         const news = await this.newsService.fetchNews(keywords);
//         return {
//             data: news
//         };
//     }
// }