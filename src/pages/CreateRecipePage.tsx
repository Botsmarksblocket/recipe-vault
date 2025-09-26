import { Row, Col } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";

CreateRecipePage.route = {
  path: "/create-recipe",
  menuLabel: "Create recipe",
  requiresAuth: true,
  index: 3,
};
export default function CreateRecipePage() {
  return (
    <>
      <Row>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <h1></h1>

          <h2></h2>
          <h2></h2>
        </Col>
      </Row>
    </>
  );
}
