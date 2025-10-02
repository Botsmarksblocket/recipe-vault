import type Recipe from "../interfaces/Recipe";
import type MealType from "../interfaces/MealType";
import type Ingredient from "../interfaces/Ingredient";
import RecipeCard from "../components/RecipeCard";
import { Row, Col, Card, Form, Dropdown } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [selectedMealType, setSelectedMealType] = useState<number | null>(null);

  const [searchText, setSearch] = useState("");
  const [searchedIngredients, setSearchedIngredients] = useState<Ingredient[]>(
    []
  );

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  useEffect(() => {
    if (!searchText) return;
    async function fetchData() {
      const response = await fetch(
        `/api/ingredients?where=nameLIKE%${searchText}%&orderby=name&limit=4`
      );
      setSearchedIngredients(await response.json());
    }
    fetchData();
  }, [searchText]);

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
                <Form.Select
                  onChange={(e) =>
                    setSelectedMealType(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">-- Meal type --</option>

                  {mealTypes.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.type} {}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Select
                  onChange={(e) =>
                    setSelectedUser(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">-- Recipe creator --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Col>
              <Dropdown
                show={searchText.length > 0 && searchedIngredients.length > 0}
              >
                <Dropdown.Toggle as="div" bsPrefix="p-0">
                  <Form.Control
                    type="text"
                    value={searchText}
                    placeholder="Search ingredient"
                    aria-label="Search"
                    onChange={handleSearch}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%" }}>
                  {searchedIngredients.map((r, i) => (
                    <Dropdown.Item key={i} className="fw-bold">
                      <Form.Text className="text-wrap">{r.name}</Form.Text>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Form>
        </Card.Body>
      </Card>
      <Row>
        {recipes
          .filter((r) => !selectedUser || r.createdBy === selectedUser)
          .filter((r) => !selectedMealType || r.mealTypeId === selectedMealType)

          .map((recipe) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
      </Row>
    </>
  );
}
