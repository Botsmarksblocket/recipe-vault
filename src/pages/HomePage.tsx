import type Recipe from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import { Row, Col, Card, Form } from "react-bootstrap";
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
  } = useLoaderData();

  return (
    <>
      <Row>
        <Col>
          <h1 className="mx-sm-0 mt-xs-0 mt-3">Check out these recipes!</h1>
        </Col>
      </Row>

      <Card className="mb-3 mt-3">
        <Card.Title className="fs-3 ms-3 mt-2">Filter recipes</Card.Title>
        <Card.Body>
          <Form>
            <Row className="d-flex justify-content-center">
              <Col xs={6}>
                <Form.Select>
                  <option value="">Filter by meal type</option>
                  <option value="typ1">Typ 1</option>
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Select>
                  <option value="">Filter by creator</option>
                  <option value="typ1">Typ 1</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {recipes.map((recipe) => (
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </>
  );
}
