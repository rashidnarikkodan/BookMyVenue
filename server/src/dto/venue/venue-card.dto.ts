import { Types } from "mongoose";   

export interface VenueCardDto {
    _id: Types.ObjectId;
    name: string;
    images: string[];
    address: {
        city: string;
    };
    capacity: number;
    pricing: {
        amount: number;
        unit: 'hour' | 'day';
    };
    isFeatured: boolean;
    isElite: boolean;
}