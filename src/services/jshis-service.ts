import axios from "axios";
import { Service } from "typedi";
import { JShisApiResponseModel } from "../models/JShisApiResponseModel";

const JSHIS_API_URL = "https://www.j-shis.bosai.go.jp/map/api/pshm/Y2024/AVR/TTL_MTTL/meshinfo.geojson";

@Service()
export class JshisService {
    /**
     * J-SHIS APIを呼び出して地震リスクデータを取得する関数
     * @param latitude 緯度
     * @param longitude 経度
     * @returns APIレスポンスデータ
     */
    async getEarthquakeRisk(latitude: number, longitude: number) {
        if (!latitude || !longitude) {
            throw new Error("緯度と経度は必須です。");
        }

        try {
            const response = await axios.get<JShisApiResponseModel>(JSHIS_API_URL, {
                params: {
                    position: `${longitude},${latitude}`, // 経度,緯度の順
                    epsg: 4612,
                    attr: "T30_I45_PS", //震度5弱以上の30年間の確率 
                },
            });
                
            // AxiosResponseからdataにアクセス
            const data = response.data;


            if (response.status !== 200) {
                console.error(`⚠️ APIエラー: ステータスコード ${response.status}`);
                throw new Error(`APIリクエスト失敗: ${response.statusText}`);
            }

            console.log("API Response Data:", JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error(" 地震リスクデータの取得に失敗しました:", error.message);
            throw new Error("Failed to fetch earthquake risk data.");
        }
    }
}