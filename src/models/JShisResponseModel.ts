export interface JShisApiResponseModel{
    status: string;
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
     * データバージョン
     * 使用されている地震ハザードマップのバージョン。
     * 例: "Y2024"
     */
    version: string;

    /**
     * 30年間で震度5弱以上の地震が発生する確率
     * 例: "0.202410"
     */
    features: features[];
}

export interface features {
    type: string;
    geometry: {
        type: string;
        coordinates: number[][][];
    };
    properties: {
        T30_I45_PS: string;
    };
}