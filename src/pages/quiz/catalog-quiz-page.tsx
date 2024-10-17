import { useLayoutEffect, useState } from "react";
import CatalogQuizFreeTyping from "../../components/catalog-quiz-free-typing";
import QuizProgress from "../../components/quiz-progress";
import {
  useCatalogQuizFromParams,
  useCatalogQuizPB,
} from "../../hooks/use-catalog-quiz";
import { fetchScryfall, scryfallUrl } from "../../hooks/use-resource-scryfall";
import { CatalogEntry } from "../../models/catalog-entry";
import { CatalogQuizType } from "../../models/catalog-quiz-type";
import { sanitize } from "../../utils";
import "./catalog-quiz-page.css";

export default function CatalogQuizPage() {
  document.title = "Catalog Quiz • Magic Pop Quiz";

  const [error, setError] = useState("");
  const [entries, setEntries] = useState<CatalogEntry[] | undefined>(undefined);

  const quiz = useCatalogQuizFromParams();
  const [pb, setPB] = useCatalogQuizPB(quiz);

  useLayoutEffect(() => {
    const fetchCatalog = async (type: CatalogQuizType) => {
      const url = scryfallUrl(`/catalog/${type}`);
      const response = await fetchScryfall(url);
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
        setEntries(values.flat());
      })
      .catch(() => {
        setError("An error occurred");
        setEntries(undefined);
      });
  }, [quiz.types]);

  return (
    <div className="CatalogQuizPage">
      <div className="CatalogQuizPage_Header">
        <div>
          <h1>{quiz.name || "Unnamed"}</h1>
          <span className="CatalogQuizPage_Header_Params">
            <i>{`Types: ${quiz.types.join(", ")}`}</i>
          </span>

          {pb && entries && (
            <div className="CatalogQuizPage_Header_PB">
              <span>Record:</span>
              <QuizProgress
                guessed={pb.answersGuessed}
                time={pb.timeRemaining}
                total={entries.length}
              />
            </div>
          )}
        </div>

        <div className="CatalogQuizPage_Header_Actions" />
      </div>

      {entries ? (
        <CatalogQuizFreeTyping entries={entries} onDone={setPB} quiz={quiz} />
      ) : error ? (
        <div className="CatalogQuizPage_Message">
          <h2>{error}</h2>
          <a className="button" href="/catalog">
            Go Back
          </a>
        </div>
      ) : (
        <div className="CatalogQuizPage_Message">
          <h2>Retrieving values...</h2>
        </div>
      )}
    </div>
  );
}
