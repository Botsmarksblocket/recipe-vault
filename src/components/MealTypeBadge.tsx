import { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import type MealType from "../interfaces/MealType";

export default function MealTypeBadge({ mealTypeId }: { mealTypeId: number }) {
  const [mealType, setMealType] = useState<MealType>();

  useEffect(() => {
    fetch(`/api/mealType/${mealTypeId}`)
      .then((res) => res.json())
      .then((data) => setMealType(data));
  }, [mealTypeId]);

  return <Badge className="fs-6">{mealType?.type}</Badge>;
}
