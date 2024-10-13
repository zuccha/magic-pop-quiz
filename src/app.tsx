import CardPreview from "./components/card-preview";
import useCardSymbolInfos from "./data-hooks/use-card-symbol-infos";
import AboutPage from "./pages/about-page";
import DocsPageCardsQuiz from "./pages/docs/docs-page-cards-quiz";
import DocsPageOverview from "./pages/docs/docs-page-overview";
import DocsPageSettings from "./pages/docs/docs-page-settings";
import HomePage from "./pages/home-page";
import CardsQuizPage from "./pages/quiz/cards-quiz-page";
import NotFoundPage from "./pages/not-found-page";
import "./app.css";

const pages: Record<string, () => JSX.Element> = {
  "/": HomePage,
  "/about": AboutPage,
  "/docs": DocsPageOverview,
  "/docs/settings": DocsPageSettings,
  "/docs/cards-quiz": DocsPageCardsQuiz,
  "/quiz/cards": CardsQuizPage,
};

export default function App() {
  const cardSymbolInfos = useCardSymbolInfos();

  if (cardSymbolInfos.status !== "success") return null;

  const Page = pages[document.location.pathname] ?? NotFoundPage;

  return (
    <div className="App">
      <div className="App_Header">
        <div className="App_Header_Content">
          <div className="App_Header_Group">
            <a href="/">
              <i className="fa-solid fa-house fa-sm" />
              <b>Home</b>
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
