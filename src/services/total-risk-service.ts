import { Service } from "typedi";
import { prisma } from "../config/prisma";

@Service()
export class TotalRiskService {
  async getTotalRisk(latitude: number, longitude: number) {
    const point = `POINT(${longitude} ${latitude})`;

    // Tsunami Hazard Zones
    const tsunamiData = await prisma.$queryRaw`
      SELECT * FROM tsunami_hazard_zones
      WHERE ST_Intersects(geom, ST_GeomFromText(${point}, 4326));
    `;

    // Flood Hazard Zones
    const floodData = await prisma.$queryRaw`
      SELECT * FROM flood_hazard_zones
      WHERE ST_Intersects(geometry, ST_GeomFromText(${point}, 4326));
    `;

    // Landslide Zones
    const landslideData = await prisma.$queryRaw`
      SELECT * FROM landslide_zones
      WHERE ST_Intersects(geometry, ST_GeomFromText(${point}, 4326));
    `;

    return {
      tsunamiData,
      floodData,
      landslideData,
    };
  }
}