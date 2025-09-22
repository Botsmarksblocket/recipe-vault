import { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

LoginPage.route = {
  path: "/login",
};
export default function LoginPage() {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  interface User {
    email: string;
    password: string;
  }

  function setProperty(event: React.ChangeEvent) {
    event.preventDefault();
    let { name, value }: { name: string; value: string } =
      event.target as HTMLInputElement;

    setUser({ ...user, [name]: value });
  }

  async function sendForm(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
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
                    type="text"
                    name="password"
                    className="mt-2"
                    placeholder="Enter password..."
                  ></Form.Control>

                  <div className="d-grid gap-2">
                    <Button className="mt-4" type="submit">
                      Log in
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
