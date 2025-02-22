export class TotalRiskResponseModel {
    readonly totalRisk: number;
    readonly evaluationDate: Date;
    readonly riskLevel: string;
    readonly details: RiskDetail[];

    constructor(totalRisk: number, evaluationDate: Date, riskLevel: string, details: RiskDetail[]) {
        this.totalRisk = totalRisk;
        this.evaluationDate = evaluationDate;
        this.riskLevel = riskLevel;
        this.details = details;
    }
}

interface RiskDetail {
    category: string;
    score: number;
    weight: number;
}