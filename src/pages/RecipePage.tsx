import { useLoaderData } from "react-router-dom";
import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import ReactStars from "react-stars";

RecipePage.route = {
  path: "/recipe/:id/:slug",
  loader: async ({ params }: { params: any }) => {
    const { id } = params!;
    const recipe = await (await fetch(`/api/recipes/${id}`)).json();
    const ingredients = await (
      await fetch(`/api/ingredients/?where=recipesId=${id}`)
    ).json();
    return { recipe, ingredients };
  },
};

export default function RecipePage() {
  const {
    recipe,
    ingredients,
  }: {
    recipe: Recipe;
    ingredients: Ingredient[];
  } = useLoaderData();

  const recipeWithIngredients = {
    ...recipe,
    ingredients,
    averageRating: recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0,
  };

  return <></>;
}
