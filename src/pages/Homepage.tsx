import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";

import { Row, Col, Image } from "react-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
// import NotFoundPage from "./NotFoundPage";

Homepage.route = {
  path: "/",
  menuLabel: "Homepage",
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
      <Row>
        {recipesWithIngredients.map(
          ({
            id,
            createdBy,
            rating,
            recipeName,
            description,
            votes,
            imagePath,
            instructions,
          }) => (
            <Col key={id}>
              {imagePath && <Image src={`/recipe_images/${imagePath}`} />}
              <h3>{recipeName}</h3>
              <p>{description}</p>
            </Col>
          )
        )}
      </Row>
    </>
  );
}
