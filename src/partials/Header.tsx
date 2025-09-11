import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import routes from "../routes";

export default function Header() {
  // whether the navbar is expanded or not
  // (we use this to close it after a click/selection)
  const [expanded, setExpanded] = useState(false);

  //set dark theme
  const [isDark, setIsDark] = useState(false);

  // applies theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

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
        <Container>
          <Navbar.Brand as={Link} to="/">
            Recipe vault
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
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

            {/* Search + Theme Toggle */}

            <Form className="d-flex align-items-center">
              <Form.Control
                type="search"
                placeholder="Search recipe"
                className="me-2"
                aria-label="Search"
              />
              <Button size="sm" className="me-2">
                Search
              </Button>

              <Form.Check
                type="switch"
                id="dark-mode-switch"
                label={isDark ? "Light Mode" : "Dark Mode"}
                checked={isDark}
                onClick={() => setIsDark((prev) => !prev)}
                className="d-flex align-items-center"
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
