import HomePage from "./pages/home-page";
import QuizPage from "./pages/quiz-page";
import "./app.css";
import useCardSymbolInfos from "./data-hooks/use-card-symbol-infos";

const pages: Record<string, () => JSX.Element> = {
  "/cards-quiz": QuizPage,
};

export default function App() {
  const cardSymbolInfos = useCardSymbolInfos();

  if (cardSymbolInfos.status !== "success") return null;

  const Page = pages[document.location.pathname] ?? HomePage;

  return (
    <div className="App">
      <div className="App_Header">
        <div>
          <a className="App_Header_Title" href="/">
            <b>Home</b>
          </a>
        </div>
      </div>
      <div className="App_Page">
        <Page />
      </div>
    </div>
  );
}
