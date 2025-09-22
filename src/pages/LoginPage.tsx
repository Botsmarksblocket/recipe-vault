import { Row, Col, Card, Form } from "react-bootstrap";

LoginPage.route = {
  path: "/login",
};

export default function LoginPage() {
  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="fs-1">Log in</Card.Title>
              <Form>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control placeholder="username"></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control placeholder="password"></Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
