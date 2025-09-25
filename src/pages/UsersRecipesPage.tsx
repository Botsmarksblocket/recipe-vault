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
          <h1 className="mx-sm-0 mt-xs-0 mt-3">Your recipes</h1>
        </Col>
      </Row>
      <Row>
        {recipesWithRating.map((recipe) => (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={recipe.id}
            className="d-flex flex-column mb-3"
          >
            {/* Only the card stretches */}
            <div className="flex-grow-1">
              <RecipeCard recipe={recipe} />
            </div>

            {/* Button sits below, full width */}
            <Button className="mt-2 w-100">Edit</Button>
          </Col>
        ))}
      </Row>
    </>
  );
}
