import type Recipe from "../interfaces/Recipe";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
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
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Row>
    </>
  );
}
