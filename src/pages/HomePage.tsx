import type Recipe from "../interfaces/Recipe";
import type MealType from "../interfaces/MealType";
import type Ingredient from "../interfaces/Ingredient";
import RecipeCard from "../components/RecipeCard";
import { Row, Col, Card, Form, Dropdown, Badge } from "react-bootstrap";
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

  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [mealTypes] = useState<MealType[]>(initialMealTypes);
  const [users] = useState<PublicUserNames[]>(initialUser);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<number | null>(null);

  // Ingredients search

  const [searchText, setSearch] = useState("");
  const [searchedIngredients, setSearchedIngredients] = useState<Ingredient[]>(
    []
  );
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  useEffect(() => {
    async function fetchIngredients() {
      const response = await fetch("/api/ingredients");
      const ingredients = await response.json();

      const seen = new Set<string>();
      const uniqueIngredients = ingredients.filter((ing: Ingredient) => {
        const lower = ing.name.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      setAllIngredients(uniqueIngredients);
    }
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (!searchText) return;
    setSearchedIngredients([]);

    async function fetchData() {
      const response = await fetch(
        `/api/ingredients?where=nameLIKE%${searchText}%&orderby=name&limit=4`
      );
      setSearchedIngredients(await response.json());
    }
    fetchData();
  }, [searchText]);

  function handleIngredientClick(ingredient: Ingredient) {
    // Check if ingredient is already selected
    if (!selectedIngredients.some((ing) => ing.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }

    setSearch("");
    setSearchedIngredients([]);
  }

  function removeIngredient(ingredientId: number) {
    setSelectedIngredients(
      selectedIngredients.filter((ing) => ing.id !== ingredientId)
    );
  }

  // Filter recipes based on selected ingredients
  const filteredRecipes = recipes
    .filter((r) => !selectedUser || r.createdBy === selectedUser)
    .filter((r) => !selectedMealType || r.mealTypeId === selectedMealType)
    .filter((recipe) => {
      if (selectedIngredients.length === 0) return true;

      // Get all ingredients that belong to this recipe
      const recipeIngredients = allIngredients.filter(
        (ing) => ing.recipesId === recipe.id
      );

      // Check if any selected ingredient is in this recipe
      return selectedIngredients.some((selectedIng) =>
        recipeIngredients.some((recipeIng) => recipeIng.id === selectedIng.id)
      );
    });

  function clearFilters() {
    setSelectedUser(null);
    setSelectedMealType(null);
    setSelectedIngredients([]);
  }

  return (
    <>
      <Card className="mb-3 mt-3">
        <Card.Title className="fs-3 ms-3 mt-2 d-flex justify-content-between align-items-center">
          <span>Filter recipes</span>
          {(selectedUser ||
            selectedMealType ||
            selectedIngredients.length > 0) && (
            <button
              className="btn btn-outline-secondary btn-sm me-3"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          )}
        </Card.Title>{" "}
        <Card.Body>
          <Form>
            <Row className="d-flex justify-content-center mb-3">
              <Col xs={6}>
                <Form.Select
                  value={selectedMealType ?? ""}
                  onChange={(e) =>
                    setSelectedMealType(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Meal type</option>

                  {mealTypes.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.type} {}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Select
                  value={selectedUser ?? ""}
                  onChange={(e) =>
                    setSelectedUser(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
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
                  {searchedIngredients.map((ingredient) => (
                    <Dropdown.Item
                      key={ingredient.id}
                      className="fw-bold"
                      onClick={() => handleIngredientClick(ingredient)}
                    >
                      <Form.Text className="text-wrap">
                        {ingredient.name}
                      </Form.Text>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {selectedIngredients.length > 0 && (
                <div className="mt-3">
                  <Form.Label className="fw-bold">
                    Recipes which contains at least one of these ingredients:
                  </Form.Label>
                  <div className="d-flex flex-wrap ">
                    {selectedIngredients.map((ingredient) => (
                      <Badge
                        key={ingredient.id}
                        bg="primary"
                        className="d-flex align-items-center gap-2 px-3 py-2 mx-1 mt-2 text-wrap fs-6"
                      >
                        {ingredient.name}
                        <span
                          onClick={() => removeIngredient(ingredient.id)}
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                          role="button"
                          aria-label={`Remove ${ingredient.name}`}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Col>
          </Form>
        </Card.Body>
      </Card>
      <Row>
        {filteredRecipes.map((recipe) => (
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </>
  );
}
