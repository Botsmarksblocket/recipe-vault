import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type Recipe from "../interfaces/Recipe";
import { createSlug } from "../utils/slug";
import "../components/RecipeCard.scss";
import MealTypeBadge from "./MealTypeBadge";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + " ...";
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { id, recipeName, description, imagePath } = recipe;

  return (
    <Link
      to={`/recipe/${id}/${createSlug(recipeName)}`}
      style={{ textDecoration: "none" }}
    >
      <Card role="button" className="h-100 w-100">
        <Card.Body>
          {imagePath && (
            <div className="card-image-wrapper">
              {/* TODO: Update for production */}
              <Card.Img
                src={`/backend/wwwroot/uploads/${imagePath}`}
                alt={recipeName}
              />
            </div>
          )}
          <Card.Title className="fw-bold fs-5 mt-2">{recipeName}</Card.Title>
          <MealTypeBadge mealTypeId={recipe.mealTypeId} />
          <Card.Text>{truncateText(description, 100)}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
