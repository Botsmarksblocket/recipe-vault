import { useLoaderData } from "react-router-dom";
import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import StarRating from "../utils/reactStars";

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

  const { recipeName, description, imagePath, votes, sumRating } = recipe;
  const averageRating = recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0;

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center">
                    <StarRating value={averageRating} />
                    <Card.Text className="ms-2">({votes})</Card.Text>
                  </div>

                  <Card.Title className="fw-bold fs-3">
                    {recipe.recipeName}
                  </Card.Title>
                  <Card.Text>{description}</Card.Text>
                </Col>

                <Col xs={12} md={6}>
                  {recipe.imagePath && (
                    <div className="card-image-wrapper">
                      <Card.Img
                        src={`/recipe_images/${imagePath}`}
                        alt="Recipe image"
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
