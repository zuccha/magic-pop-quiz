import DocsPage from "./docs-page";

export default function DocsPageCardsQuiz() {
  document.title = "Cards Quizzes • Documentation • Magic Pop Quiz";

  return (
    <DocsPage>
      <h1>Cards Quiz</h1>
      <p>
        Card quizzes are a way to test your knowledge about Magic cards. Given a
        pool of cards, you'll have to guess all of them to complete the quiz.
      </p>
      <p>
        The platform comes with a variety of pre-configured quizzes, divided
        into categories. You can click on a quiz to open its page, ready to be
        played.
      </p>
      <p>
        If you want to alter a quiz (either the query, the duration, or anything
        else) you can press on the pen (edit) icon on the right and the quiz
        parameters will be copied in the quiz configuration form (check the
        section below to see how that works). Editing a quiz will actually
        create a new variation and it will not change the original quiz.
      </p>

      <h3>Configuring a New Quiz</h3>
      <p>
        You can create new quizzes or alter existing ones via the quiz
        configuration form in the home page.
      </p>
      <p>
        The <b>name</b> of the quiz is just a description and it has no impact
        on the quiz whatsoever. The <b>quantity</b> determines how many cards
        you'll have to guess to complete the quiz, up to a maximum of 175. If
        you set the value to 0, then all matching cards (up to 175) will be part
        of the quiz. The quiz's <b>duration</b> determines how much time you
        have to complete the quiz. The duration can go from 1 second to 59
        minutes and 59 seconds.
      </p>
      <p>
        To determine which cards you need to guess in a quiz you have to specify
        a valid non-empty Scryfall <b>query</b>. Check{" "}
        <a href="https://scryfall.com/docs/syntax" target="_blank">
          Scryfall's syntax guide
        </a>{" "}
        to learn how to write queries. The <b>order</b> and <b>direction</b>{" "}
        specify which cards will be taken first.
      </p>
      <p>
        <b>Hints</b> will help you to identify cards as you solve the quiz.
        Hints will appear next to cards. Supported hints are: mana cost, card
        colors, card color identity, card types, stats(power/toughness for
        creatures, loyalty for planeswalkers, and defense for battles), price
        (USD, EUR, or TIX), rarity, set name, artist name, and release year. If
        the quiz format is <i>Slideshow</i> (see section below) the following
        hints are also available: card image, oracle text, reminder text (only
        if oracle text is available), and flavor text.
      </p>

      <h3>Quiz Formats</h3>
      <p>Two quiz formats are currently available:</p>
      <ul>
        <li>
          <b>Free Typing:</b> You guess cards all together. Cards are presented
          as a table containing all guessed card names; as you guess cards
          correctly the table will fill up. Hints selected during the quiz
          creation will appear next to the card name.
        </li>
        <li>
          <b>Slideshow:</b> You have to guess cards one-by-one. Cards are
          presented individually as previews containing all elements specified
          as hints while creating the quiz. You can select the next card in the
          series if you are unable to name the current one.
        </li>
      </ul>

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

      <h3>Finishing a Quiz</h3>
      <p>
        The quiz finishes once you guess the last card, when the time runs out,
        or if you give up. Once the quiz is finished, if the current score
        (number of correct guesses) is the highest that you ever got on the
        quiz, then the record will be updated.
      </p>

      <h3>Saving Favorites</h3>
      <p>
        You can save a quiz as a favorite by clicking on the heart icon on the
        top-right corner of a quiz's page. Similarly, you can click the heart
        icon again to remove a quiz from favorites.
      </p>
      <p>
        Favorite quizzes will appear in the home page under the <b>Favorites</b>{" "}
        category. The category will not appear if you don't have any favorites.
      </p>

      <h3>Quiz Uniqueness</h3>
      <p>
        Quizzes are identified by their query, order, order direction, format,
        cards quantity, duration, and hints.
      </p>
      <p>
        Two quizzes that have different parameters will also have different
        scores and will be saved as favorites independently. For example, if two
        quizzes have the same query and order, but have a different duration,
        each quiz will have its own record score.
      </p>
    </DocsPage>
  );
}
