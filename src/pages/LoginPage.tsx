import { Row, Col, Card, Form, Button } from "react-bootstrap";

LoginPage.route = {
  path: "/login",
};

export default function LoginPage() {
  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center mt-5">
          <Card className="mt-5" style={{ width: "30rem" }}>
            <Card.Body>
              <Card.Title className="fs-1">Log in</Card.Title>
              <Form>
                <Form.Group>
                  <Form.Label className="d-block mt-3">Username</Form.Label>
                  <Form.Control
                    placeholder="Enter username..."
                    className="d-block mt-2"
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="d-block mt-2">Password</Form.Label>
                  <Form.Control
                    className="mt-2"
                    placeholder="Enter password..."
                  ></Form.Control>

                  <div className="d-grid gap-2">
                    <Button className="mt-4">Log in</Button>
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
