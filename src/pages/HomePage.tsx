import type Recipe from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import { Row, Col } from "react-bootstrap";
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
