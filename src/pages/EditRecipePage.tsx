import { Row, Col, Form, Card, Button } from "react-bootstrap";
// import { useAuth } from "../context/AuthProvider";
import type Recipe from "../interfaces/Recipe";
import type Ingredient from "../interfaces/Ingredient";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useState, useReducer, useEffect } from "react";

EditRecipePage.route = {
  path: "/edit-recipe/:id/:slug",
  requiresAuth: true,
  index: 3,
  loader: async ({ params }: { params: any }) => {
    const { id } = params!;
    const recipe = await (await fetch(`/api/recipes/${id}`)).json();
    const ingredients = await (
      await fetch(`/api/ingredients/?where=recipesId=${id}`)
    ).json();
    return { recipe, ingredients };
  },
};

export default function EditRecipePage() {
  const {
    recipe: initialRecipe,
    ingredients: initialIngredients,
  }: {
    recipe: Recipe;
    ingredients: Ingredient[];
  } = useLoaderData();

  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(initialRecipe);

  function setProperty(event: React.ChangeEvent) {
    let { name, value }: { name: string; value: string | number } =
      event.target as HTMLInputElement;

    setRecipe({ ...recipe, [name]: value });
  }

  // Tracks the status of each ingredient in the form
  type IngredientStatus =
    | "existing" //already exists in DB and unchanged
    | "new" //just added in the form
    | "updated" //existing ingredient which is modified
    | "deleted"; //marked for removal

  // Extends the Ingredient type to include a status for UI and DB operations
  type IngredientWithStatus = Ingredient & {
    status: IngredientStatus;
  };

  // Actions that can be dispatched to the ingredient reducer
  type Action =
    | { type: "add" }
    | { type: "remove"; id: number }
    | { type: "update"; id: number; field: "name" | "amount"; value: string }
    | { type: "hydrate"; payload: Ingredient[] };

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);

  //Reducer which manages the ingredient list in the form
  function ingredientReducer(
    state: IngredientWithStatus[],
    action: Action
  ): IngredientWithStatus[] {
    switch (action.type) {
      case "hydrate":
        // Initializes ingriedients from the db and marks them as existing
        return action.payload.map((i) => ({ ...i, status: "existing" }));

      case "add":
        // Generates a temporary ID (not db id) for new ingredient rows
        const newId = state.length
          ? Math.max(...state.map((i) => i.id)) + 1
          : 1;
        return [
          ...state,
          { id: newId, name: "", amount: "", recipesId: 0, status: "new" },
        ];

      case "remove":
        //Marks a ingredient as deleted (gets removed from UI, may be deleted from the db)
        return state.map((i) =>
          i.id === action.id ? { ...i, status: "deleted" } : i
        );

      case "update":
        //Updates a field of an ingredient
        //If the ingredient already exists, mark it as updated
        return state.map((i) =>
          i.id === action.id
            ? {
                ...i,
                [action.field]: action.value,
                status: i.status === "existing" ? "updated" : i.status,
              }
            : i
        );

      default:
        return state;
    }
  }

  // when loader runs:
  useEffect(() => {
    dispatch({ type: "hydrate", payload: initialIngredients });
  }, [initialIngredients]);

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();

    // Uploads the recipe
    await fetch(`/api/recipes/${recipe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });

    //Helper to get payload for DB
    const getIngredientPayload = (ingredient: IngredientWithStatus) => ({
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredient.amount,
      recipesId: initialRecipe.id,
    });

    for (const ingredient of ingredients) {
      // Don't want to send the status of the ingredient to the db
      const payload = getIngredientPayload(ingredient);

      if (ingredient.status === "new")
        await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      else if (ingredient.status === "updated")
        await fetch(`/api/ingredients/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      // Only delete if ingredient actually exists in database
      else if (ingredient.status === "deleted" && payload.id > 0)
        await fetch(`/api/ingredients/${payload.id}`, {
          method: "DELETE",
        });
    }
    navigate("/my-recipes");
  }

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center">
          <Card className="mt-3" style={{ width: "45rem" }}>
            <Card.Body>
              <Card.Title className="fs-1 ">Edit recipe</Card.Title>
              <Form onSubmit={sendForm}>
                {recipe.imagePath && (
                  <div className="mt-3 mt-md-0 ">
                    {/* TODO Update src for production */}
                    <Card.Img
                      src={`/backend/wwwroot/uploads/${recipe.imagePath}`}
                      alt="Recipe image"
                      className="w-50"
                    />
                  </div>
                )}{" "}
                <Form.Group>
                  <Form.Label className="fs-5">Recipe name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    maxLength={80}
                    minLength={5}
                    name="recipeName"
                    onChange={setProperty}
                    value={recipe.recipeName}
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-5">Description</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    as="textarea"
                    rows={3}
                    minLength={30}
                    maxLength={600}
                    aria-describedby="descriptionHelpBlock"
                    name="description"
                    value={recipe.description}
                    onChange={setProperty}
                  ></Form.Control>
                  <Form.Text id="descriptionHelpBlock" className="fst-italic">
                    Description must be between 30 - 600 letters.
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-5">Recipe instructions</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    as="textarea"
                    rows={6}
                    minLength={30}
                    maxLength={1000}
                    aria-describedby="instructionsHelpBlock"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={setProperty}
                  ></Form.Control>
                  <Form.Text id="instructionsHelpBlock" className="fst-italic">
                    Instructions must be between 50 - 1000 letters.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label className="fs-5">Ingredients</Form.Label>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={() => dispatch({ type: "add" })}
                      className="mt-2 mb-2"
                    >
                      + Add Ingredient
                    </Button>
                  </div>

                  {ingredients
                    .filter((i) => i.status !== "deleted")
                    .map((ingredient) => (
                      <Row key={ingredient.id} className="mb-2 g-1 p-0 m-0">
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            placeholder="Amount"
                            value={ingredient.amount}
                            onChange={(e) =>
                              dispatch({
                                type: "update",
                                id: ingredient.id,
                                field: "amount",
                                value: e.target.value,
                              })
                            }
                          />
                        </Col>
                        <Col xs={7}>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Ingredient"
                            value={ingredient.name}
                            onChange={(e) =>
                              dispatch({
                                type: "update",
                                id: ingredient.id,
                                field: "name",
                                value: e.target.value,
                              })
                            }
                          />
                        </Col>
                        <Col xs={1}>
                          <Button
                            variant="danger"
                            onClick={() =>
                              dispatch({ type: "remove", id: ingredient.id })
                            }
                          >
                            X
                          </Button>
                        </Col>
                      </Row>
                    ))}
                </Form.Group>
                <Row className="d-flex mt-5">
                  <Col xs={6}>
                    <Button
                      type="submit"
                      variant="success"
                      className="fs-4 w-100"
                    >
                      Update recipe
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <ConfirmModal></ConfirmModal>

                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
