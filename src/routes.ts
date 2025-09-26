import type Route from "./interfaces/Route.ts";
import { createElement } from "react";
import ProtectedRoute from "./utils/protectedRoute.tsx";

// page components
import NotFoundPage from "./pages/NotFoundPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import RecipePage from "./pages/RecipePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import UsersRecipesPage from "./pages/UsersRecipesPage.tsx";
import CreateRecipePage from "./pages/CreateRecipePage.tsx";

export default [
  NotFoundPage,
  HomePage,
  RecipePage,
  LoginPage,
  UsersRecipesPage,
  CreateRecipePage,
]
  .map((Page) => {
    const routeProps: Partial<Route> = Page.route || {};

    const element = routeProps.requiresAuth
      ? createElement(ProtectedRoute, { children: createElement(Page) })
      : createElement(Page);

    return { element, ...routeProps } as Route;
  })
  .sort((a, b) => (a.index || 0) - (b.index || 0));


