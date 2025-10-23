export type PlaceType = "church" | "main_square" | "sport_hall" | "other";
export type RestaurationType = "food" | "drink" | "both" | "none";

export interface ChristmasMarket {
  id: number;
  name: string;
  location: { x: number; y: number };
  address: string;
  number_of_exponents: number;
  number_of_craftsmen: number;
  place_type: PlaceType;
  animation_type: string[];
  animals_forbidden: boolean;
  exposition: boolean;
  santa_present: boolean;
  restauration: RestaurationType;
  usual_days: string[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ChristmasMarketCreate {
  name: string;
  location: { x: number; y: number };
  address: string;
  number_of_exponents: number;
  number_of_craftsmen: number;
  place_type: PlaceType;
  animation_type: string[];
  animals_forbidden: boolean;
  exposition: boolean;
  santa_present: boolean;
  restauration: RestaurationType;
  usual_days: string[];
  user_id: number;
}

export interface ChristmasMarketUpdate {
  name?: string;
  location?: { x: number; y: number };
  address?: string;
  number_of_exponents?: number;
  number_of_craftsmen?: number;
  place_type?: PlaceType;
  animation_type?: string[];
  animals_forbidden?: boolean;
  exposition?: boolean;
  santa_present?: boolean;
  restauration?: RestaurationType;
  usual_days?: string[];
}
