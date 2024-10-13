import DocsPage from "./docs-page";

export default function DocsPageOverview() {
  return (
    <DocsPage>
      <h1>Overview</h1>
      <p>Scryfall Quizzes will test your knowledge about Magic.</p>
      <p>
        The idea is that you retrieve a list of elements through a Scryfall
        query, then you have to guess them.
      </p>
      <p>
        Currently we support only quizzes about Magic cards, but maybe in the
        future we will also include sets or other MtG attributes that can be
        retrieved via Scryfall.
      </p>
    </DocsPage>
  );
}
