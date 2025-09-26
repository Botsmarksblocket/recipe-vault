import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import type Ingredient from "../interfaces/Ingredient";
import { useState } from "react";

CreateRecipePage.route = {
  path: "/create-recipe",
  menuLabel: "Create recipe",
  requiresAuth: true,
  index: 3,
};

export default function CreateRecipePage() {
  const { user } = useAuth();
  console.log(user);

  const [recipe, setRecipe] = useState({
    createdBy: user?.id,
    recipeName: "",
    description: "",
    imagePath: "",
    instructions: "",
  });

  function setProperty(event: React.ChangeEvent) {
    let { name, value }: { name: string; value: string | number } =
      event.target as HTMLInputElement;

    setRecipe({ ...recipe, [name]: value });
  }

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center">
          <Card className="mt-3" style={{ width: "45rem" }}>
            <Card.Body>
              <Card.Title className="fs-1">Create recipe</Card.Title>

              <Form.Group>
                <Form.Label className="fs-5">Recipe name</Form.Label>
                <Form.Control
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

              <Form.Group controlId="formFile" className="mb-3 mt-4">
                <Form.Label>Upload image for your recipe</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
