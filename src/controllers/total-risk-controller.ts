import { JsonController, Post, Body, Get } from "routing-controllers";
import { OpenAPI, ResponseSchema  } from "routing-controllers-openapi";
import { Service } from "typedi";
import { TotalRiskService } from "../services/total-risk-service";
import { TotalRiskResponseModel } from "../models/TotalRiskResponseModel";
import { CommonRequestModel } from "../models/CommonRequestModel";

@Service()
@JsonController("/total-risk")
export class TotalRiskController {
    constructor(private totalRiskService: TotalRiskService) {}

    @Post("/")
    @OpenAPI({
        summary: "地震と津波のハザード情報を取得するAPI",
        description: "指定された緯度と経度に基づいて、地震や津波などのリスク情報を取得します。",
        operationId: "getTotalRisk",
        requestBody: {
            description: "緯度と経度を含むリクエストデータ",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CommonRequestDTO" },
                },
            },
        },
        responses: {
            "200": {
                description: "リスク情報が正常に取得できた場合",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/TotalRiskResponseDTO" },
                    },
                },
            },
            "400": {
                description: "リクエストパラメータが無効な場合",
                content: {
                    "application/json": {
                        example: { error: "Latitude and longitude are required" },
                    },
                },
            },
            "500": {
                description: "内部サーバーエラーが発生した場合",
                content: {
                    "application/json": {
                        example: { error: "Failed to fetch risk data." },
                    },
                },
            },
        },
    })
    async postRisk(
        @Body() body: CommonRequestModel
    ) {
    //     console.log("Received Request Body:", body); 
    //     const { latitude, longitude } = body;

    //     return {
    //         message: "Risk data retrieved",
    //         latitude,
    //         longitude
    //     };
    // }
        console.log("Received Body:", body);

        const { latitude, longitude } = body;

        if (!latitude || !longitude) {
            return { error: "Latitude and longitude are required" };
        }

        const riskData = await this.totalRiskService.getTotalRisk(latitude, longitude);

        console.log("Risk Data:", riskData);
        // const riskDataDTO = TotalRiskResponseModel.fromEntity(riskData);

        return { message: "Total risk data retrieved", data: null };
    }
}