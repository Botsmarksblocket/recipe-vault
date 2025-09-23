import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import { DarkModeToggle } from "../parts/DarkModeToggle";
import { useAuth } from "../context/AuthProvider";
import routes from "../routes";

export default function Header() {
  // whether the navbar is expanded or not
  // (we use this to close it after a click/selection)
  const [expanded, setExpanded] = useState(false);
  const { user, logoutUser } = useAuth();

  //  get the current route
  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice()
    .sort((a, b) => (a.path.length > b.path.length ? -1 : 1))
    .find((x) => pathName.indexOf(x.path.split(":")[0]) === 0);
  // function that returns true if a menu item is 'active'
  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  return (
    <header>
      <Navbar expand="lg" expanded={expanded} fixed="top">
        <Container fluid>
          <Navbar.Brand className="fs-2" as={Link} to="/">
            Recipe vault
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto fs-5">
              {routes
                .filter((x) => x.menuLabel)
                .map(({ menuLabel, path }, i) => (
                  <Nav.Link
                    as={Link}
                    key={i}
                    to={path}
                    className={isActive(path) ? "active" : ""}
                    /* close menu after selection*/
                    onClick={() => setTimeout(() => setExpanded(false), 200)}
                  >
                    {menuLabel}
                  </Nav.Link>
                ))}
            </Nav>
            {/* Search */}
            {user && (
              <h3 className="me-4 d-none d-lg-block">
                Welcome {user?.firstName}
              </h3>
            )}
            <Form className="d-flex align-items-center">
              <Form.Control
                type="search"
                placeholder="Search recipe"
                className="me-3"
                aria-label="Search"
              />
              <Button size="sm" className="me-3">
                Search
              </Button>
            </Form>
            <div className="mt-2 mt-lg-0">
              <DarkModeToggle />
              {user ? (
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-3"
                  onClick={logoutUser}
                >
                  Log out
                </Button>
              ) : (
                <Link to={{ pathname: "login" }}>
                  <Button variant="success" size="sm" className="ms-3">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
