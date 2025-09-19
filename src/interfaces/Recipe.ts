import type Ingredient from "./Ingredient";

export default interface Recipe {
  id: number;
  createdBy: number;
  rating: number;
  recipeName: string;
  description: string;
  votes: number;
  imagePath: number;
  instructions: string;
  ingredients?: Ingredient[];
}
