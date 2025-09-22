import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import { createSlug } from "../utils/slug";
import StarRating from "../utils/reactStars";

import "../components/RecipeCard.scss";

import { Row, Col, Card } from "react-bootstrap";
import { Link, useLoaderData } from "react-router-dom";

HomePage.route = {
  path: "/",
  menuLabel: "HomePage",
  index: 1,
  loader: async () => ({
    recipes: await (await fetch("/api/recipes")).json(),
    ingredients: await (await fetch("/api/ingredients")).json(),
  }),
};

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  truncated = truncated.substring(0, truncated.lastIndexOf(" "));
  return truncated + " ...";
}

export default function HomePage() {
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
    averageRating: recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0,
  }));

  return (
    <>
      <Row>
        <Col>
          <h1 className="mx-sm-0 mt-xs-0 mt-3">
            Check out these recipes!
          </h1>
        </Col>
      </Row>
      <Row>
        {recipesWithIngredients.map(
          ({
            id,
            averageRating,
            recipeName,
            description,
            votes,
            imagePath,
          }) => (
            <Col key={id} xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
              <Link
                style={{ textDecoration: "none" }}
                to={`/recipe/${id}/${createSlug(recipeName)}`}
              >
                <Card role="button" className="h-100 w-100 mx-sm-0">
                  <Card.Body>
                    {imagePath && (
                      <div className="card-image-wrapper">
                        <Card.Img
                          src={`/recipe_images/${imagePath}`}
                          alt="Recipe image"
                        />
                      </div>
                    )}
                    <Col className="d-flex align-items-center mt-2">
                      <StarRating value={averageRating} />

                      <Card.Text className="ms-2">({votes})</Card.Text>
                    </Col>
                    <Card.Title className="fw-bold fs-6">
                      {recipeName}
                    </Card.Title>

                    <Card.Text>{truncateText(description, 100)}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          )
        )}
      </Row>
    </>
  );
}
