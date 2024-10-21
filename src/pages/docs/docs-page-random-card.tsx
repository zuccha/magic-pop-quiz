import DocsPage from "./docs-page";

export default function DocsPageRandomCard() {
  document.title = "Random Card • Documentation • Magic Pop Quiz";

  return (
    <DocsPage>
      <h1>Random</h1>
      <p>
        Guess a random card from the entire MtG collection! Type the name of the
        card in the input field, or give up if you don't know it.
      </p>
      <p>
        You can control which elements appear in the card preview to make
        guessing more or less difficult.
      </p>

      <h3>Guessing</h3>
      <p>
        You solve a quiz by typing card names in the input field. The guess is
        case insensitive and it ignores accents, diacritics, and special
        characters.
      </p>
      <p>
        Moreover, the guess will match a card if it's the same as the part of
        the card's name that precedes a comma. This is useful for quickly
        guessing legendary cards without having to specify their full name.
      </p>
      <p>
        Once a guess matches a card, the card will be revealed and the input
        field will be cleared.
      </p>

      <h3>Less Random Cards</h3>
      <p>
        You can narrow randomized cards via the input field appearing once you
        guessed correctly or gave up. The input field will allow you to specify
        a{" "}
        <a href="https://scryfall.com/docs/syntax" target="_blank">
          Scryfall query
        </a>{" "}
        to restrict card selection.
      </p>
    </DocsPage>
  );
}
