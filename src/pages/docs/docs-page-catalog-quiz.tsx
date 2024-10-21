import DocsPage from "./docs-page";

export default function DocsPageCatalogQuiz() {
  document.title = "Catalog Quizzes • Documentation • Magic Pop Quiz";

  return (
    <DocsPage>
      <h1>Catalog Quiz</h1>
      <p>
        Catalog quizzes are a way to test your knowledge about Magic card types
        and mechanics.
      </p>
      <p>
        The platform comes with a variety of pre-configured quizzes. You can
        click on a quiz to open its page, ready to be played. Catalog quizzes
        cannot be customized.
      </p>

      <h3>Quiz Formats</h3>
      <p>
        Catalog quizzes are available only in the <b>Free Typing</b> format: you
        guess types/mechanics all together. Types/mechanics are presented as a
        table; as you guess correctly the table will fill up.
      </p>

      <h3>Guessing</h3>
      <p>
        You solve a quiz by typing types/mechanics names in the input field. The
        guess is case insensitive and it ignores accents, diacritics, and
        special characters.
      </p>
      <p>
        Once a guess matches a type/mechanic, the type/mechanic will be revealed
        and the input field will be cleared.
      </p>

      <h3>Finishing a Quiz</h3>
      <p>
        The quiz finishes once you guess the last type/mechanic, when the time
        runs out, or if you give up. Once the quiz is finished, if the current
        score (number of correct guesses) is the highest that you ever got on
        the quiz, then the record will be updated.
      </p>
    </DocsPage>
  );
}
