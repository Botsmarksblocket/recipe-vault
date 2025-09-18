// import { Row, Col } from "react-bootstrap";
// import { Link, useLoaderData } from "react-router-dom";
// import NotFoundPage from "./NotFoundPage";
import productsLoader from "../utils/productsLoader";

ProductDetailsPage.route = {
  path: "/products/:slug",
  parent: "/",
  loader: productsLoader,
};

export default function ProductDetailsPage() {
  return <></>;
}
