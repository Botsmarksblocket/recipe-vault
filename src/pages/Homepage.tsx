import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";

import "../components/RecipeCard.scss";

import { Row, Col, Card, CardGroup } from "react-bootstrap";
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
          ({ id, rating, recipeName, votes, imagePath }) => (
            <Col key={id} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card>
                <Card.Body>
                  {imagePath && (
                    <div className="card-image-wrapper">
                      <Card.Img
                        src={`/recipe_images/${imagePath}`}
                        alt="Recipe image"
                      />
                    </div>
                  )}
                  <div className="card-overlay">
                    <Card.Title>{recipeName}</Card.Title>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        )}
      </Row>
    </>
  );
}
