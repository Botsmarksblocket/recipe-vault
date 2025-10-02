import type Recipe from "../interfaces/Recipe";
import type MealType from "../interfaces/MealType";

import RecipeCard from "../components/RecipeCard";
import { Row, Col, Card, Form } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";

HomePage.route = {
  path: "/",
  menuLabel: "Home page",
  index: 1,
  loader: async (): Promise<HomeLoaderData> => ({
    recipes: await (await fetch("/api/recipes")).json(),
    mealType: await (await fetch("/api/mealTypes")).json(),
    user: await (await fetch("/api/publicUserNames")).json(),
  }),
};

interface PublicUserNames {
  id: number;
  firstName: string;
  lastName: string;
}

interface HomeLoaderData {
  recipes: Recipe[];
  mealType: MealType[];
  user: PublicUserNames[];
}

export default function HomePage() {
  const {
    recipes: initialRecipes,
    mealType: initialMealTypes,
    user: initialUser,
  } = useLoaderData<HomeLoaderData>();

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [mealTypes, setMealTypes] = useState<MealType[]>(initialMealTypes);
  const [users, setUsers] = useState<PublicUserNames[]>(initialUser);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  console.log(selectedUser);

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
            <Row className="d-flex justify-content-center mb-3">
              <Col xs={6}>
                <Form.Select>
                  <option>Meal type</option>
                  {mealTypes.map((m) => (
                    <option key={m.id} value={m.type}>
                      {m.type}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Select
                  value={selectedUser ?? ""}
                  onChange={(e) => setSelectedUser(Number(e.target.value))}
                >
                  <option value="">Recipe creator</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <Row>
        {recipes
          .filter((r) => !selectedUser || r.createdBy === selectedUser)

          .map((recipe) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
      </Row>
    </>
  );
}
