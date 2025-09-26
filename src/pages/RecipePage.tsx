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

  const { recipeName, description, imagePath, votes, instructions } = recipe;
  const averageRating = recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0;

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body className="pt-0 px-0">
              <Row>
                <Col xs={12} md={6} className="ps-4 pt-3">
                  <Card.Title className="fw-bold fs-2 mt-0 mt-md-3">
                    {recipeName}
                  </Card.Title>
                  <div className="d-flex align-items-center">
                    <StarRating value={averageRating} />
                    <Card.Text className="ms-2">({votes})</Card.Text>
                  </div>
                  <Card.Text className="mt-2 mb-3">{description}</Card.Text>
                </Col>

                <Col xs={12} md={6}>
                  {imagePath && (
                    <div className="mt-3 mt-md-0">
                      {/* TODO Update src for production */}
                      <Card.Img
                        src={`/backend/wwwroot/uploads/${imagePath}`}
                        alt="Recipe image"
                      />
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6} className="ps-4 pe-4">
                  <Card.Text className="fs-2 mt-2">Ingredienser</Card.Text>
                  <ListGroup variant="flush">
                    {ingredients.map((ingredient) => (
                      <ListGroup.Item
                        key={ingredient.id}
                        className="mt-1 border-0 d-flex align-items-center"
                      >
                        <span className="me-2 fw-bold">
                          {ingredient.amount}
                        </span>
                        <span> {ingredient.name}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col xs={12} md={6} className="d-flex flex-column ps-4 pe-4 ">
                  <Card.Text className="fs-2 mt-2">Instruktioner</Card.Text>

                  <Card.Text>{instructions}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
