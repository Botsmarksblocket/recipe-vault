import { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

LoginPage.route = {
  path: "/login",
};
export default function LoginPage() {
  interface User {
    email: string;
    password: string;
  }
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  async function logOut() {
    await fetch("/api/login", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  }

  let navigate = useNavigate();
  const [error, setError] = useState("");

  function setProperty(event: React.ChangeEvent) {
    const { name, value } = event.target as HTMLInputElement;

    setUser({ ...user, [name]: value });
  }

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      navigate(-1);
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

                  <Form.Text className="text-danger">
                    Incorrect email or password.
                  </Form.Text>

                  <div className="d-grid gap-2">
                    <Button type="submit">Log in</Button>
                  </div>
                </Form.Group>
              </Form>
              <div className="d-grid gap-2 mt-5">
                <Button variant="danger" onClick={logOut}>
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
