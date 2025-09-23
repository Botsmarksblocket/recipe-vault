import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";

// Route metadata
LoginPage.route = {
  path: "/login",
};

export default function LoginPage() {
  // --- Types ---
  interface UserForm {
    email: string;
    password: string;
  }

  // --- Hooks (state, navigation) ---
  const [formUser, setUser] = useState<UserForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser, logoutUser, loading } = useAuth();
  const navigate = useNavigate();

  // --- Handlers ---
  function setProperty(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUser({ ...formUser, [name]: value });
  }

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();

    const success = await loginUser(formUser.email, formUser.password);

    if (success) {
      navigate(-1); // go back to previous page
    } else {
      setError("Incorrect email or password.");
    }
  }

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center mt-5">
          <Card className="mt-5" style={{ width: "30rem" }}>
            <Card.Body>
              <Card.Title className="fs-1">Log in</Card.Title>
              <Form onSubmit={sendForm}>
                <Form.Group>
                  <Form.Label className="d-block mt-3">Username</Form.Label>
                  <Form.Control
                    onChange={setProperty}
                    type="text"
                    name="email"
                    placeholder="Enter email..."
                    className="d-block mt-2"
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="d-block mt-2">Password</Form.Label>
                  <Form.Control
                    onChange={setProperty}
                    type="password"
                    name="password"
                    className="mt-2"
                    placeholder="Enter password..."
                  ></Form.Control>

                  <div className="mt-2 mb-2">
                    <Form.Text className="text-danger">{error}</Form.Text>
                  </div>

                  <div className="d-grid gap-2">
                    <Button type="submit" disabled={loading}>
                      Log in
                    </Button>
                  </div>
                </Form.Group>
              </Form>
              <div className="d-grid gap-2 mt-5">
                <Button variant="danger" onClick={logoutUser}>
                  Log out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
