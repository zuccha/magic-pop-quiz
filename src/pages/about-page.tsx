import "./about-page.css";

export default function AboutPage() {
  document.title = "About Magic Pop Quiz";

  return (
    <div className="AboutPage">
      <h1>About Magic Pop Quiz</h1>
      <p>
        <b>Magic Pop Quiz</b> offers interactive <i>Magic: the Gathering</i>{" "}
        quizzes, featuring up-to-date card data taken directly from Scryfall.
        Users can also create custom quizzes by specifying their own Scryfall
        queries.
      </p>
      <img src="/images/pop-quiz.jpg" />
      <caption>
        “Today is hydromancy? I thought it was amplimancy! I studied for
        amplimancy!”
      </caption>
      <p>
        The platform was created by zuccha, an avid <i>Magic: the Gathering</i>{" "}
        player and Sporcle enthusiast, who saw the need for a quiz experience
        with real-time card lists and a UI designed specifically for Magic
        quizzes.
      </p>
      <p>
        <b>Magic Pop Quiz</b> is not affiliated with Wizard of the Coast,
        Scryfall, or Card Conjurer.
      </p>
    </div>
  );
}
