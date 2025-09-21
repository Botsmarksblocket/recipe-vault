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
          <Card className="mx-3">
            <Card.Body className="pt-0 pe-0 ps-0">
              <Row>
                <Col xs={12} md={6} className="ps-4 pt-3">
                  <Card.Title className="fw-bold fs-3">{recipeName}</Card.Title>
                  <div className="d-flex align-items-center">
                    <StarRating value={averageRating} />
                    <Card.Text className="ms-2">({votes})</Card.Text>
                  </div>
                  <Card.Text>{description}</Card.Text>
                </Col>

                <Col xs={12} md={6}>
                  {imagePath && (
                    <div className="mt-3 mt-md-0">
                      <Card.Img
                        src={`/recipe_images/${imagePath}`}
                        alt="Recipe image"
                        className="p-0"
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
