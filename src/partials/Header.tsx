import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import {
  Container,
  Nav,
  Navbar,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import { DarkModeToggle } from "../parts/DarkModeToggle";
import { useAuth } from "../context/AuthProvider";
import type Recipe from "../interfaces/Recipe";
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

  const [searchText, setSearch] = useState("");
  const [searchedRecipes, setSearchedRecipes] = useState<Recipe[]>([]);

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    setSearch(value);

    const response = await fetch(
      `/api/recipes?where=recipeName_LIKE_%${searchText}%&orderby=recipeName&limit=4`,
      {
        method: "GET",
      }
    );
    setSearchedRecipes(await response.json());
  }

  return (
    <header>
      <Navbar expand="xxl" expanded={expanded} fixed="top">
        <Container fluid>
          <Navbar.Brand className="fs-2" as={Link} to="/">
            Recipe vault
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="fs-5">
              {routes
                .filter((x) => x.menuLabel && (!x.requiresAuth || user))
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

            <Form className=" mx-xxl-auto header-search-bar">
              <Dropdown
                show={searchText.length > 0 && searchedRecipes.length > 0}
              >
                <Dropdown.Toggle as="div" bsPrefix="p-0">
                  <Form.Control
                    type="text"
                    value={searchText}
                    placeholder="Search recipe"
                    aria-label="Search"
                    onChange={handleSearch}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%" }}>
                  {searchedRecipes.map((r, i) => (
                    <Dropdown.Item key={i}>{r.recipeName}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form>

            {user && (
              <h3 className="ms-2 me-4 d-none d-lg-block">
                Welcome {user?.firstName}
              </h3>
            )}

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
