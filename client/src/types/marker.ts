export interface ChristmasMarket {
  id: number;
  name: string;
  location: {
    x: number;
    y: number;
  };
  address: string;
  number_of_exponents: number;
  number_of_craftsmen: number;
  place_type: string;
  animation_type: string[];
  animals_forbidden: boolean;
  exposition: boolean;
  santa_present: boolean;
  restauration: "food" | "drink" | "both" | "none";
  usual_days: string[];
  user_id: number;
  created_at: string;
  updated_at: string;
}
