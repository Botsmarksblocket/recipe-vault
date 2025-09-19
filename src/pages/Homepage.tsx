import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";

import { Row, Col } from "react-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
// import NotFoundPage from "./NotFoundPage";

Homepage.route = {
  path: "/",
  menuLabel: "About",
  index: 1,
  loader: async () => ({
    recipes: await (await fetch("/api/recipes")).json(),
    ingredients: await (await fetch("/api/ingredients")).json(),
  }),
};

export default function Homepage() {
  const {
    recipes,
    ingredients,
  }: {
    recipes: Recipe[];
    ingredients: Ingredient[];
  } = useLoaderData();

  const recipesWithIngredients = recipes.map((recipe) => ({
    ...recipe,
    ingredients: ingredients.filter(({ recipesId }) => recipesId === recipe.id),
  }));

  return (
    <>
      <Row>
        <Col>
          <h2>Check out these recipes!</h2>
        </Col>
      </Row>
    </>
  );
}
