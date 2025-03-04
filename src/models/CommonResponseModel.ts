
export class CommonResponsetModel {
    id: string;
    latitude: number;
    longitude: number;
    text: string;
    timestamp: Date;

    constructor(id: string, latitude: number, longitude: number, text: string, userId: string) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.text = text;
        this.timestamp = new Date();
    }
}

