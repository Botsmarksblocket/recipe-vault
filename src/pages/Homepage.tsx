import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";

import "../components/RecipeCard.scss";

import { Row, Col, Image, Card, Container } from "react-bootstrap";
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
            <Col key={id} xs={12} sm={6} md={4} className="mb-3">
              <Card>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  {imagePath && (
                    <div className="card-image-wrapper">
                      <Image
                        className="card-image p-0"
                        src={`/recipe_images/${imagePath}`}
                        rounded
                      />
                    </div>
                  )}
                  <Card.Title>{recipeName}</Card.Title>

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
