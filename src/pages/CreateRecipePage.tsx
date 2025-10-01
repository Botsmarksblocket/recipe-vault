import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import type Ingredient from "../interfaces/Ingredient";
import type MealType from "../interfaces/MealType";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useState } from "react";

CreateRecipePage.route = {
  path: "/create-recipe",
  menuLabel: "Create recipe",
  requiresAuth: true,
  index: 3,
  loader: async () => ({
    mealType: await (await fetch("/api/mealType")).json(),
  }),
};

export default function CreateRecipePage() {
  const {
    mealType,
  }: {
    mealType: MealType[];
  } = useLoaderData();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const [recipe, setRecipe] = useState({
    createdBy: user?.id,
    recipeName: "",
    description: "",
    imagePath: "",
    instructions: "",
    mealTypeId: "",
  });

  // Starts with one ingredient with empty fields
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 0, name: "", amount: "", recipesId: 0 },
  ]);

  // Updates either name or amount of specific ingredient
  const handleIngredientChange = (
    id: number,
    field: "name" | "amount",
    value: string
  ) => {
    // Maps through preview array of ingredients
    // If current ingredient's id matches, it creates a new object with the same properties but override chosen field with value
    // Otherwise ingredients remains unchanged
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const removeIngredientRow = (id: number) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  };

  const addIngredientRow = () => {
    // New id gets created based on previously highest id
    const newId = ingredients.length
      ? Math.max(...ingredients.map((i) => i.id)) + 1
      : 1;
    // New ingredient object gets added with the new id and empty values
    setIngredients((prev) => [
      ...prev,
      { id: newId, name: "", amount: "", recipesId: 0 },
    ]);
  };

  function setProperty(event: React.ChangeEvent) {
    let { name, value }: { name: string; value: string | number } =
      event.target as HTMLInputElement;

    setRecipe({ ...recipe, [name]: value });
  }

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();

    // Generates a filename
    let fileName;
    const extension = file?.name.split(".").pop();
    fileName = `${uuidv4()}.${extension}`;

    const payload: any = { ...recipe, imagePath: fileName };

    //Uploads the recipe
    const recipeResult = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Takes the recipes insertId and assigns it to recipeId, which will be used to link the ingredients to the recipes
    const recipeData = await recipeResult.json();
    const recipeId = recipeData.insertId;

    //Uploads the image
    if (file) {
      const formData = new FormData();
      // Prepares file and filename to be sent as form data under the key "image"
      formData.append("image", file, fileName);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Uploads the ingredients if there are any
      if (ingredients && ingredients.length > 0) {
        // Updates the recipesId for all ingredients
        const ingredientsWithRecipeId = ingredients.map((ingredient) => ({
          ...ingredient,
          recipesId: recipeId,
        }));

        for (const ingredient of ingredientsWithRecipeId) {
          await fetch("/api/ingredients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ingredient),
          });
        }
      }
    }

    navigate("/my-recipes");
  }

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center">
          <Card className="mt-3" style={{ width: "45rem" }}>
            <Card.Body>
              <Card.Title className="fs-1">Create recipe</Card.Title>

              <Form onSubmit={sendForm}>
                <Form.Group>
                  <Form.Label className="fs-5">Recipe name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    maxLength={80}
                    minLength={5}
                    name="recipeName"
                    onChange={setProperty}
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
                    onChange={setProperty}
                  ></Form.Control>
                  <Form.Text id="instructionsHelpBlock" className="fst-italic">
                    Instructions must be between 50 - 1000 letters.
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fs-5">Meal type</Form.Label>
                  <Form.Select
                    required
                    name="mealTypeId"
                    onChange={setProperty}
                  >
                    {mealType.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mt-4">
                  <Form.Label className="fs-5">Ingredients</Form.Label>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={addIngredientRow}
                      className="mt-2 mb-2"
                    >
                      + Add Ingredient
                    </Button>
                  </div>

                  {ingredients.map((ingredient) => (
                    <Row key={ingredient.id} className="mb-2 g-1 p-0 m-0">
                      <Col xs={4}>
                        <Form.Control
                          type="text"
                          placeholder="Amount"
                          value={ingredient.amount}
                          onChange={(e) =>
                            handleIngredientChange(
                              ingredient.id,
                              "amount",
                              e.target.value
                            )
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
                            handleIngredientChange(
                              ingredient.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col xs={1}>
                        <Button
                          variant="danger"
                          onClick={() => removeIngredientRow(ingredient.id)}
                        >
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3 mt-4">
                  <Form.Label>Upload image for your recipe</Form.Label>
                  <Form.Control
                    required
                    type="file"
                    accept="image/jpeg,image/png"
                    // Takes the first file that the user picks
                    onChange={(e) =>
                      setFile((e.target as HTMLInputElement).files?.[0] ?? null)
                    }
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button type="submit" variant="success" className="fs-4 ">
                    Create recipe!
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
