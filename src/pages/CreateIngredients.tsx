import { Row, Col, Form, Button } from "react-bootstrap";
import type Ingredient from "../interfaces/Ingredient";
import { useState } from "react";

// Work in progress. Allows user to add more ingredients by pressing +Add ingredients button. Will continue working on this after getting create function for recipe to work.

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

<Form.Group className="mt-4">
  <Form.Label className="fs-5">Ingredients</Form.Label>

  {ingredients.map((ingredient) => (
    <Row key={ingredient.id} className="mb-2">
      <Col xs={4}>
        <Form.Control
          type="text"
          placeholder="Amount"
          value={ingredient.amount}
          onChange={(e) =>
            handleIngredientChange(ingredient.id, "amount", e.target.value)
          }
        />
      </Col>
      <Col xs={8}>
        <Form.Control
          type="text"
          placeholder="Ingredient"
          value={ingredient.name}
          onChange={(e) =>
            handleIngredientChange(ingredient.id, "name", e.target.value)
          }
        />
      </Col>
    </Row>
  ))}

  <Button variant="primary" onClick={addIngredientRow} className="mt-2">
    + Add Ingredient
  </Button>
</Form.Group>;
