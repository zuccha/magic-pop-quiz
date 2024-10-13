import { useLayoutEffect, useState } from "react";
import CatalogQuiz from "../../components/catalog-quiz";
import QuizProgress from "../../components/quiz-progress";
import {
  useCatalogQuizFromParams,
  useCatalogQuizPB,
} from "../../hooks/use-catalog-quiz";
import { CatalogQuizAnswer } from "../../models/catalog-quiz-answer";
import { CatalogQuizType } from "../../models/catalog-quiz-type";
import "./catalog-quiz-page.css";
import { sanitize } from "../../utils";

export default function CatalogQuizPage() {
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<CatalogQuizAnswer[] | undefined>(
    undefined,
  );

  const quiz = useCatalogQuizFromParams();
  const [pb, setPB] = useCatalogQuizPB(quiz);

  useLayoutEffect(() => {
    const fetchCatalog = async (type: CatalogQuizType) => {
      const response = await fetch(`https://api.scryfall.com/catalog/${type}`);
      const json = await response.json();

      if (json.object === "error") {
        throw new Error("An error occurred");
      }

      const values = json.data as string[];
      return values
        .map((value) => ({
          type,
          name: value,
          simpleName: sanitize(value),
        }))
        .sort((a1, a2) => {
          if (a1.name > a2.name) return 1;
          if (a1.name < a2.name) return -1;
          return 0;
        });
    };

    Promise.all(quiz.types.map(fetchCatalog))
      .then((values) => {
        setError("");
        setAnswers(values.flat());
      })
      .catch(() => {
        setError("An error occurred");
        setAnswers(undefined);
      });
  }, [quiz.types]);

  return (
    <div className="CardsQuizPage">
      <div className="CardsQuizPage_Header">
        <div>
          <h1>{quiz.name || "Unnamed"}</h1>
          <span>
            <i>{`Types: ${quiz.types.join(", ")}`}</i>
          </span>
        </div>

        <div className="CardsQuizPage_Header_ActionsAndPB">
          <div className="CardsQuizPage_Header_Actions" />

          {pb && answers && (
            <div className="CardsQuizPage_Header_PB">
              <span>Record:</span>
              <QuizProgress
                guessed={pb.answersGuessed}
                time={pb.timeRemaining}
                total={answers.length}
              />
            </div>
          )}
        </div>
      </div>

      {answers ? (
        <CatalogQuiz
          answers={answers}
          duration={quiz.time}
          onDone={setPB}
          types={quiz.types}
        />
      ) : error ? (
        <div className="CardsQuizPage_Message">
          <h2>{error}</h2>
          <a className="button" href="/catalog">
            Go Back
          </a>
        </div>
      ) : (
        <div className="CardsQuizPage_Message">
          <h2>Retrieving values...</h2>
        </div>
      )}
    </div>
  );
}
