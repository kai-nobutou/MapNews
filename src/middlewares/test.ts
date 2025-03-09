import { extractLocation } from "./gemini_ai";
import { fetchNews } from "./gnews";

async function main() {
    // 🔹 複数のキーワードで検索する場合は配列で渡す
    const keywords = ["福岡", "殺人"
    ]; // 例: 福岡に関する事件ニュースを検索

    // 🔹 ニュースを取得
    const newsArticles = await fetchNews(keywords);
    
    console.log("📰 ニュース:", newsArticles);

    if (newsArticles.length === 0) {
        console.log("⚠️ ニュースが見つかりませんでした。");
        return;
    }

}
main();