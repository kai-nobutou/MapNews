import { JsonController, Get, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { NewsService } from "../services/news-service";
import { Service } from "typedi";
import { NewsResponse } from "../models/NewsModel";


@Service()
@JsonController("/news")
export class NewsController {
    constructor(private newsService: NewsService) {}




    /**
     * ニュース記事のデータ情報の一覧を取得
     * @param - なし
     * @returns {Promise<NewsResponse[]>} ニュース記事のデータ情報の一覧
     */
    @Get("/")
    async getNews(): Promise<NewsResponse[]> {
        const news = await this.newsService.getNews();
        return news;
    }

        
        
    
}