import CardPreview from "./components/card-preview";
import useCardSymbolInfos from "./data-hooks/use-card-symbol-infos";
import AboutPage from "./pages/about-page";
import CatalogPage from "./pages/catalog-page";
import DocsPageCardsQuiz from "./pages/docs/docs-page-cards-quiz";
import DocsPageCatalogQuiz from "./pages/docs/docs-page-catalog-quiz";
import DocsPageOverview from "./pages/docs/docs-page-overview";
import DocsPageRandomCard from "./pages/docs/docs-page-random-card";
import HomePage from "./pages/cards-page";
import NotFoundPage from "./pages/not-found-page";
import CardsQuizPage from "./pages/quiz/cards-quiz-page";
import CatalogQuizPage from "./pages/quiz/catalog-quiz-page";
import RandomCardPage from "./pages/random-card-page";
import "./app.css";

const pages: Record<string, () => JSX.Element> = {
  "/": RandomCardPage,
  "/about": AboutPage,
  "/cards": HomePage,
  "/cards/quiz": CardsQuizPage,
  "/catalog": CatalogPage,
  "/catalog/quiz": CatalogQuizPage,
  "/docs": DocsPageOverview,
  "/docs/cards-quiz": DocsPageCardsQuiz,
  "/docs/catalog-quiz": DocsPageCatalogQuiz,
  "/docs/random-card": DocsPageRandomCard,
};

export default function App() {
  const [cardSymbolInfos] = useCardSymbolInfos();

  if (cardSymbolInfos.status !== "success") return null;

  const Page = pages[document.location.pathname] ?? NotFoundPage;

  return (
    <div className="App">
      <div className="App_Header">
        <div className="App_Header_Content">
          <div className="App_Header_Group">
            <a href="/">
              <i className="fa-solid fa-shuffle" />
              <b>Random</b>
            </a>

            <a href="/cards">
              <i className="fa-solid fa-layer-group" />
              <b>Cards</b>
            </a>

            <a href="/catalog">
              <i className="fa-solid fa-book" />
              <b>Catalog</b>
            </a>
          </div>

          <div className="App_Header_Group">
            <a href="/about">
              <i className="fa-solid fa-circle-info" />
              <b>About</b>
            </a>

            <a href="/docs">
              <i className="fa-solid fa-circle-question" />
              <b>Docs</b>
            </a>
          </div>
        </div>
      </div>

      <Page />

      <CardPreview />
    </div>
  );
}
