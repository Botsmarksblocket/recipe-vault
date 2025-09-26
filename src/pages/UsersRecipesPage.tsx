import type Recipe from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";

UsersRecipesPage.route = {
  path: "/my-recipes",
  menuLabel: "My recipes",
  index: 1,
  requiresAuth: true,
};

export default function UsersRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/recipes/?where=createdBy=${user.id}`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, [user]);

  const recipesWithRating = recipes.map((recipe) => ({
    ...recipe,
    averageRating: recipe.votes > 0 ? recipe.sumRating / recipe.votes : 0,
  }));

  return (
    <>
      <Row>
        <Col>
          <h1 className="text-center mx-sm-0 mt-xs-0 mt-3">My recipes</h1>
        </Col>
      </Row>
      <Row>
        {recipesWithRating.length > 0 ? (
          recipesWithRating.map((recipe) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={recipe.id}
              className="d-flex flex-column mb-3"
            >
              <div className="flex-grow-1">
                <RecipeCard recipe={recipe} />
              </div>

              <Button className="mt-1 mb-3 w-100">Edit recipe</Button>
            </Col>
          ))
        ) : (
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h4 className="mt-3">You haven't created any recipes yet...</h4>
            <Button size="lg" variant="success" className="mt-3">
              Click here to start creating!
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}
