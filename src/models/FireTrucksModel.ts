export interface FireTruck {
    id: number;
    from: string;
    subject: string;
    body: string;
    disasterType: string;
    address: string;
    receivedAt: Date;
    latitude?: number | null;
    longitude?: number | null;
}

export interface GetFireTrucksByTypeParams {
    type: string;
}

export interface GetFireTrucksByPeriodParams {
    start: string;
    end: string;
}

export interface FireTrucksResponse {
    data: FireTruck[];
}