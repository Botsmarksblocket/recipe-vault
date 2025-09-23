import { useLocation } from "react-router-dom";
import Header from "./partials/Header";
import Main from "./partials/Main";
import Footer from "./partials/Footer";
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  return (
    <>
      <AuthProvider>
        <Header />
        <Main />
        <Footer />
      </AuthProvider>
    </>
  );
}
