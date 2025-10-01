import { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import type MealType from "../interfaces/MealType";

type Props = {
  mealTypeId: number;
  fontSizeClass?: string;
};

export default function MealTypeBadge({
  mealTypeId,
  fontSizeClass = "fs-6",
}: Props) {
  const [mealType, setMealType] = useState<MealType>();

  useEffect(() => {
    fetch(`/api/mealType/${mealTypeId}`)
      .then((res) => res.json())
      .then((data) => setMealType(data));
  }, [mealTypeId]);

  return <Badge className={fontSizeClass}>{mealType?.type}</Badge>;
}
