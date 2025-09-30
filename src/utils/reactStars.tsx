import ReactStars from "react-stars";

//Might use later but put on hold for now

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  edit?: boolean;
  onChange?: (newValue: number) => void;
}

const StarRating = ({
  value,
  count = 5,
  size = 24,
  edit = true,
  onChange,
}: StarRatingProps) => {
  return (
    <ReactStars
      value={value}
      count={count}
      size={size}
      edit={edit}
      onChange={onChange}
    />
  );
};

export default StarRating;