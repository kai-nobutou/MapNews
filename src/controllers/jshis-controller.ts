import { JsonController, Get, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { JshisService } from "../services/jshis-service";
import { CommonRequestModel } from "../models/CommonRequestModel"; 

@Service()
@JsonController("/earthquake")
export class EarthquakeController {
  constructor(private jshisService: JshisService) {}

  @Get("/")
  @OpenAPI({ summary: "地震のハザード情報を取得するAPI" })
  async getRisk(
    @QueryParams() query: CommonRequestModel
  ) {
    const { latitude, longitude } = query;

    if (!latitude || !longitude) {
      return { error: "Latitude and longitude are required" };
    }

    const riskData = await this.jshisService.getEarthquakeRisk(latitude, longitude);
  
    return { message: "Earthquake risk data retrieved", data: riskData };
  }
}