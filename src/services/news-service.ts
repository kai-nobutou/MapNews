import { Service } from "typedi";
import { NewsResponse } from "../models/NewsModel";
import { prisma } from "../config/prisma";

@Service()
export class NewsService {
    /**
     * ニュース記事のデータ情報の一覧を取得
     * publishedAtが一週間以内のニュース記事を取得
     * @returns ニュース記事のデータ情報の一覧
     */
    async getNews(): Promise<NewsResponse[]> {
        const news = await prisma.news.findMany({
            where: {
                // 7日以内の記事を取得
                publishedAt: {
                    gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) // 7日前以降
                },
                // categoryがなしと空は除外
                category: {
                    notIn: ["", "なし"]
                }
            },
            orderBy: {
                publishedAt: 'desc'
            }
        });

        // 取得したnewsをレスポンスに変換して返す
        const response:NewsResponse[] = news.map((n) => {
            return {
                title: n.title,
                description: n.description,
                content: n.content,
                url: n.url,
                image: n.image ?? "", // null の場合は空文字にする
                publishedAt: n.publishedAt,
                createdAt: n.createdAt,
                source: { name: n.sourceName, url: n.sourceUrl },
                latitude: n.latitude ?? "", // null の場合は空文字にする
                longitude: n.longitude ?? "", // null の場合は空文字にする
                formattedAddress: n.formattedAddress ?? "", // null の場合は空文字にする
                category: n.category,
                summary: n.summary,
            };
        });

        return response;
    }
}