import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="app-footer">
      <Container fluid>
        <Row>
          <Col className="text-center py-3">
            © Recipe Vault {new Date().getFullYear()}
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
