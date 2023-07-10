import { Photo } from "./commonTypes";

export interface TireMark {
    id: number | null,
    value: string | null,
    logo?: any,
    tyre_models?: TireModel[],
    updated_at?: string,
    created_at?: string,
}
export interface TireModel {
    value: string | null,
    id: number | null,
    tyre_brand_id?: number,
    updated_at?: string,
    created_at?: string,
}
export interface Tire {
    mark: TireMark,
    model: TireModel,
    profile: number | null,
    radius: number | null,
    remainder: number | null,
    width: number | null,
    photos: Photo[],
    id?: number | null,
}

export interface TiresOwn {
    leftTop: {
        id: number,
        tire: Tire,
    },
    rightTop: {
        id: number,
        tire: Tire,
    },
    leftDown: {
        id: number,
        tire: Tire,
    },
    rightDown: {
        id: number,
        tire: Tire,
    }
}

export interface TiresProcessed {
    leftTop: Tire,
    rightTop: Tire,
    leftDown: Tire,
    rightDown: Tire
}

export interface TiresState {
    tiresOwn: TiresOwn,
    tiresProcessed: TiresProcessed, 
    mode: string
}