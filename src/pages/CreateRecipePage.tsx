import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { v4 as uuidv4 } from "uuid";
// import type Ingredient from "../interfaces/Ingredient";
// import { createSlug } from "../utils/slug";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

CreateRecipePage.route = {
  path: "/create-recipe",
  menuLabel: "Create recipe",
  requiresAuth: true,
  index: 3,
};

export default function CreateRecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

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

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();

    // Generates a filename
    let fileName;
    const extension = file?.name.split(".").pop();
    fileName = `${uuidv4()}.${extension}`;

    const payload: any = { ...recipe, imagePath: fileName };

    await fetch("api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });


    if (file) {      
      const formData = new FormData();
      // Prepares file and filename to be sent as form data under the key "image"
      formData.append("image", file, fileName);

      await fetch("api/upload", {
        method: "POST",
        body: formData,
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
