import DocsPage from "./docs-page";

export default function DocsPageOverview() {
  document.title = "Documentation • Magic Pop Quiz";

  return (
    <DocsPage>
      <h1>Overview</h1>
      <p>Scryfall Quizzes will test your knowledge about Magic.</p>
      <p>
        Through a Scryfall query you retrieve a list of Magic-related cards or
        terms, then you have to guess them. You can customize queries to suit
        your preferences and make quizzes easier or harder by adjusting their
        duration and hints available.
      </p>
      <p>
        Currently, there are three quiz types: <b>Random Card</b>, <b>Cards</b>,
        and <b>Catalog</b>.
      </p>

      <h3>Card Previews</h3>
      <p>
        The Random Card quiz and <i>Slideshow</i> Cards quizzes feature a card
        preview that plays as a hint for guessing. The card is build dynamically
        including elements matching the active hints.
      </p>
      <p>
        Since MtG cards come in a multitude of shapes and forms, recreating all
        of them would take too much effort. For this reason, you might notice
        discrepancies compared to the actual card image. Some common
        inaccuracies include:
      </p>
      <ul>
        <li>Card images might not be cropped correclty.</li>
        <li>
          Lands and two-colors cards might not have the correct frame color. For
          example, fetchlands appear as colorless, while shocklands and{" "}
          <i>Deathrite Shaman</i> will have a golden frame.
        </li>
        <li>
          Sagas use the same frame as cases/classes (i.e., images are on the
          left side).
        </li>
        <li>
          Cards with multiple faces (transform, flip, aftermath, fuse, rooms,
          adventures, etc.) are presented as two regular cards, one next to the
          other.
        </li>
        <li>Planeswalkers and battles use the same frame as regular cards.</li>
        <li>All cards are black bordered.</li>
        <li>
          Cards don't have their correct set symbol. The set symbol is always a
          diamond.
        </li>
      </ul>
      <p>
        If the oracle/flavor text doesn't fit in the frame, the oracle/flavor
        box will scroll.
      </p>
    </DocsPage>
  );
}
