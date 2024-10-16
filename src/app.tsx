import CardPreview from "./components/card-preview";
import useCardSymbolInfos from "./data-hooks/use-card-symbol-infos";
import AboutPage from "./pages/about-page";
import CatalogPage from "./pages/catalog-page";
import DocsPageCardsQuiz from "./pages/docs/docs-page-cards-quiz";
import DocsPageOverview from "./pages/docs/docs-page-overview";
import DocsPageSettings from "./pages/docs/docs-page-settings";
import HomePage from "./pages/cards-page";
import CardsQuizPage from "./pages/quiz/cards-quiz-page";
import CatalogQuizPage from "./pages/quiz/catalog-quiz-page";
import NotFoundPage from "./pages/not-found-page";
import "./app.css";
import RandomCardPage from "./pages/random-card-page";

const pages: Record<string, () => JSX.Element> = {
  "/": RandomCardPage,
  "/about": AboutPage,
  "/cards": HomePage,
  "/cards/quiz": CardsQuizPage,
  "/catalog": CatalogPage,
  "/catalog/quiz": CatalogQuizPage,
  "/docs": DocsPageOverview,
  "/docs/cards-quiz": DocsPageCardsQuiz,
  "/docs/settings": DocsPageSettings,
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

            <div className="App_Header_Divider" />

            <a href="/settings">
              <i className="fa-solid fa-gear" />
            </a>
          </div>
        </div>
      </div>

      <Page />

      <CardPreview />
    </div>
  );
}
