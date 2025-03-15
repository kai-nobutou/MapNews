import { JsonController, Get, QueryParam } from "routing-controllers";
import { NewsService } from "../services/news-service";
import { Inject, Service } from "typedi";
import { MapAnnotationData } from "../models/MapAnnotationDataModel";

/**
 * @class NewsController
 * @description ニュース記事に関するAPIコントローラー
 */
@JsonController("/news")
@Service()
export class NewsController {
    constructor(@Inject() private newsService: NewsService) {}

    /**
     * ニュース記事のデータ情報の一覧を取得
     * @param - なし
     * @returns {Promise<{data: MapAnnotationData[]}>} ニュース記事のデータ情報の一覧
     */
    @Get("/")
    async getNews(): Promise<MapAnnotationData[] | { error: string }> {
        const news = await this.newsService.getNews();
        return news ;
    }
}