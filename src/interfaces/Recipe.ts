import type Ingredient from "./Ingredient";

export default interface Recipe {
  id: number;
  createdBy: number;
  recipeName: string;
  description: string;
  imagePath: number;
  instructions: string;
  mealTypeId: number;
  ingredients?: Ingredient[];
}
