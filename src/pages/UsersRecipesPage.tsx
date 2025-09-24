import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import RecipeCard from "../components/RecipeCard";
import { Row, Col } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";

UsersRecipesPage.route = {
  path: "/my-recipes",
  menuLabel: "My recipes",
  index: 1,
  requiresAuth: true,
  loader: async () => ({
    recipes: await (await fetch("/api/recipes")).json(),
  }),
};

export default function UsersRecipesPage() {
  const {
    recipes,
  }: {
    recipes: Recipe[];
    ingredients: Ingredient[];
  } = useLoaderData();

  const recipesWithRating = recipes.map((recipe) => ({
    ...recipe,
    averageRating: recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0,
  }));

  return (
    <>
      <Row>
        <Col>
          <h1 className="mx-sm-0 mt-xs-0 mt-3">Check out these recipes!</h1>
        </Col>
      </Row>
      <Row>
        {recipesWithRating.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Row>
    </>
  );
}
