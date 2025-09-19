import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";

import "../components/RecipeCard.scss";

import { Row, Col, Image, Card } from "react-bootstrap";
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
              <Card>
                <Card.Body>
                  <Card.Title className="card-title">{recipeName}</Card.Title>
                  {imagePath && (
                    <Image src={`/recipe_images/${imagePath}`} rounded />
                  )}
                  <Card.Text>{description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        )}
      </Row>
    </>
  );
}
