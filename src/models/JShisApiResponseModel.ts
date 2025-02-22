/**
 * J-SHIS APIの地震ハザード情報のレスポンスDTO
 * APIから取得した地震リスクデータを表す。
 */
export interface JShisApiResponseModel {
    /**
     * レスポンスのステータス
     * - "Success"：リクエスト成功
     * - "Error"：リクエスト失敗
     */
    status: string;

    /**
     * フィーチャーコレクションのタイプ
     * 常に"FeatureCollection"
     */
    type: "FeatureCollection";

    /**
     * 座標参照系 (CRS: Coordinate Reference System)
     * データの座標系に関する情報を提供。
     */
    crs: {
        /**
         * 座標参照系のタイプ
         * 例: "name"
         */
        type: string;

        /**
         * 座標系の詳細プロパティ
         * 例: { name: "urn:ogc:def:crs:EPSG:4612" }
         */
        properties: { 
            /**
             * 座標系の名称
             * EPSGコードなどを含む。
             */
            name: string;
        };
    };

    /**
     * メタデータ情報
     * APIリクエストに関連する地震リスク情報のメタ情報を提供。
     */
    metaData: {
        /**
         * データバージョン
         * 使用されている地震ハザードマップのバージョン。
         * 例: "Y2024"
         */
        version: string;

        /**
         * メッシュコード
         * 250m四方のメッシュを識別するコード。
         * 例: "4930400011"
         */
        meshcode: string;

        /**
         * 確率計算ケース
         * - "AVR": 平均ケース
         * - "MAX": 最大ケース
         */
        case: string;

        /**
         * 地震コード
         * 対象とする地震シナリオを表す識別子。
         * 例: "TTL_MTTL"
         */
        eqcode: string;

        /**
         * 属性情報
         */
        attr: {
            /**
             * 属性名
             * 例: "T30_I45_PS"
             */
            name: string;

            /**
             * 単位
             * 例: ""
             */
            unit: string;
        }[];
    };

    /**
     * 地震ハザード情報を含むフィーチャーリスト
     * 各フィーチャーは位置とリスクレベルに関する情報を含む。
     */
    features: {
        /**
         * フィーチャーのタイプ
         * 例: "Feature"
         */
        type: string;

        /**
         * ジオメトリ情報
         * ポリゴン形式で位置を表す。
         */
        geometry: {
            /**
             * ジオメトリのタイプ
             * 常に"Polygon"
             */
            type: string;

            /**
             * 座標配列
             * 地震リスクが適用されるポリゴンの頂点座標。
             */
            coordinates: number[][][];
        };

        /**
         * 地震ハザードに関するプロパティ情報
         */
        properties: {
            /**
             * メッシュコード
             * 例: "4930400011"
             */
            meshcode: string;

            /**
             * 30年間で震度5弱以上の地震が発生する確率
             * 例: "0.202410"
             */
            T30_I45_PS: string;
        };
    }[];
}