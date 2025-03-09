export interface News {
    id: number;
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: Date;
    createdAt: Date;
    source:{name:string, url:string};
}

export interface NewsResponse{
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: Date;
    createdAt: Date;
    source:{name:string, url:string};
    latitude:string;
    longitude:string;
    formattedAddress:string;
    category:string;
    summary:string;
}