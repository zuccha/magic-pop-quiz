import CardPreview from "./components/card-preview";
import useCardSymbolInfos from "./data-hooks/use-card-symbol-infos";
import AboutPage from "./pages/about-page";
import HelpPage from "./pages/help-page";
import HomePage from "./pages/home-page";
import CardsQuizPage from "./pages/quiz/cards-quiz-page";
import NotFoundPage from "./pages/not-found-page";
import "./app.css";

const pages: Record<string, () => JSX.Element> = {
  "/": HomePage,
  "/about": AboutPage,
  "/help": HelpPage,
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
            <a className="App_Header_Nav" href="/">
              <i className="fa-solid fa-house fa-sm" />
              Home
            </a>
          </div>

          <div className="App_Header_Group">
            <a className="App_Header_Nav" href="/about">
              <i className="fa-solid fa-circle-info" />
              About
            </a>

            <a className="App_Header_Nav" href="/help">
              <i className="fa-solid fa-circle-question" />
              Help
            </a>

            <div className="App_Header_Divider" />

            <a className="App_Header_Nav" href="/settings">
              <i className="fa-solid fa-gear" />
            </a>
          </div>
        </div>
      </div>
      <div className="App_Page">
        <Page />
      </div>

      <CardPreview />
    </div>
  );
}
