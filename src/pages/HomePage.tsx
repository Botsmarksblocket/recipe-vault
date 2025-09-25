import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import RecipeCard from "../components/RecipeCard";
import { Row, Col } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";

HomePage.route = {
  path: "/",
  menuLabel: "Home page",
  index: 1,
  loader: async () => ({
    recipes: await (await fetch("/api/recipes")).json(),
  }),
};

export default function HomePage() {
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
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <RecipeCard key={recipe.id} recipe={recipe} />
          </Col>
        ))}
      </Row>
    </>
  );
}
