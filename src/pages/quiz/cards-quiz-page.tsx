import { ScryfallCard } from "@scryfall/api-types";
import { useCallback, useLayoutEffect, useState } from "react";
import CardsQuizFreeTyping from "../../components/cards-quiz-free-typing";
import CardsQuizSlideshow from "../../components/cards-quiz-slideshow";
import QuizProgress from "../../components/quiz-progress";
import {
  useCardsQuizFromParams,
  useCardsQuizIsFavorite,
  useCardsQuizPB,
} from "../../hooks/use-cards-quiz";
import { fetchScryfall, scryfallUrl } from "../../hooks/use-resource-scryfall";
import { saveCardsQuizToParams } from "../../models/cards-quiz";
import { Card, cardFromScryfallCard } from "../../models/card";
import { formattedCardsQuizDirection } from "../../models/cards-quiz-direction";
import { formattedCardsQuizOrder } from "../../models/cards-quiz-order";
import { formatCardsQuizHints } from "../../models/cards-quiz-hints";
import "./cards-quiz-page.css";

export default function CardsQuizPage() {
  document.title = "Cards Quiz • Magic Pop Quiz";

  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | undefined>(undefined);

  const quiz = useCardsQuizFromParams();
  const [pb, setPB] = useCardsQuizPB(quiz);
  const [isFavorite, toggleIsFavorite] = useCardsQuizIsFavorite(quiz);

  const formattedOrder = formattedCardsQuizOrder[quiz.order];
  const formattedDirection = formattedCardsQuizDirection[quiz.direction];
  const formattedHints = formatCardsQuizHints(quiz.hints);

  const edit = useCallback(() => {
    const url = new URL(document.location.origin);
    url.pathname = "/cards";
    url.search = saveCardsQuizToParams(quiz).toString();
    document.location.href = url.href;
  }, [quiz]);

  useLayoutEffect(() => {
    const fetchCards = async () => {
      const url = scryfallUrl("/cards/search");
      url.searchParams.set("q", quiz.query);
      url.searchParams.set("order", quiz.order);
      url.searchParams.set("dir", quiz.direction);
      const response = await (await fetchScryfall(url)).json();
      if (response.object === "error") {
        setError(
          response.status === 404
            ? "No cards found for the given query"
            : "An error occurred",
        );
        setCards(undefined);
        return;
      }

      const cards = response.data as ScryfallCard.Any[];
      setError("");
      setCards(
        cards.slice(0, quiz.quantity || undefined).map(cardFromScryfallCard),
      );
    };

    fetchCards().catch(() => {
      setError("An error occurred");
    });
  }, [quiz.quantity, quiz.query, quiz.order, quiz.direction]);

  return (
    <div className="CardsQuizPage">
      <div className="CardsQuizPage_Header">
        <div>
          <h1>{quiz.name || "Unnamed"}</h1>
          <span className="CardsQuizPage_Header_Params">
            <i>{`${quiz.query} | Order: ${formattedOrder}, ${formattedDirection} | Hints: ${formattedHints}`}</i>
          </span>

          {pb && cards && (
            <div className="CardsQuizPage_Header_PB">
              <span>Record:</span>
              <QuizProgress
                guessed={pb.answersGuessed}
                time={pb.timeRemaining}
                total={cards.length}
              />
            </div>
          )}
        </div>

        <div className="CardsQuizPage_Header_Actions">
          <button className="small" onClick={edit}>
            <i className="fa-solid fa-pen" />
            Edit
          </button>

          <button className="small icon" onClick={toggleIsFavorite}>
            {isFavorite ? (
              <abbr
                className="fa-solid fa-heart fa-xl"
                title="Remove favorite"
              />
            ) : (
              <abbr
                className="fa-regular fa-heart fa-xl"
                title="Save favorite"
              />
            )}
          </button>
        </div>
      </div>

      {cards ? (
        quiz.mode === "slideshow" ? (
          <CardsQuizSlideshow cards={cards} onDone={setPB} quiz={quiz} />
        ) : (
          <CardsQuizFreeTyping cards={cards} onDone={setPB} quiz={quiz} />
        )
      ) : error ? (
        <div className="CardsQuizPage_Message">
          <h2>{error}</h2>
          <button onClick={edit}>Edit Quiz</button>
        </div>
      ) : (
        <div className="CardsQuizPage_Message">
          <h2>Retrieving cards...</h2>
        </div>
      )}
    </div>
  );
}
