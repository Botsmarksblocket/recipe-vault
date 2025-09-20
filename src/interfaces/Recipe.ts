import type Ingredient from "./Ingredient";

export default interface Recipe {
  id: number;
  createdBy: number;
  sumRating: number;
  recipeName: string;
  description: string;
  votes: number;
  imagePath: number;
  instructions: string;
  ingredients?: Ingredient[];
}
