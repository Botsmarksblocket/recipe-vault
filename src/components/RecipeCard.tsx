import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import type Recipe from "../interfaces/Recipe";
import StarRating from "../utils/reactStars";
import { createSlug } from "../utils/slug";
import "../components/RecipeCard.scss";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + " ...";
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { id, recipeName, description, votes, sumRating, imagePath } = recipe;
  const averageRating = votes > 0 ? sumRating / votes : 0;

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
      <Link
        to={`/recipe/${id}/${createSlug(recipeName)}`}
        style={{ textDecoration: "none" }}
      >
        <Card role="button" className="h-100 w-100 mx-sm-0">
          <Card.Body>
            {imagePath && (
              <div className="card-image-wrapper">
                <Card.Img
                  src={`/recipe_images/${imagePath}`}
                  alt={recipeName}
                />
              </div>
            )}

            <div className="d-flex align-items-center mt-2">
              <StarRating value={averageRating} />
              <Card.Text className="ms-2">({votes})</Card.Text>
            </div>

            <Card.Title className="fw-bold fs-6">{recipeName}</Card.Title>
            <Card.Text>{truncateText(description, 100)}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}
