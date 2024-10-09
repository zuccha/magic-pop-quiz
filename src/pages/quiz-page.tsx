import { useLayoutEffect } from "react";
import "./quiz-page.css";

// function timeToMs(time: string): number {
//   const [minutes, seconds] = time.split(":").map((v) => parseInt(v, 10));
//   return (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
// }

export default function QuizPage() {
  // const [quiz, setQuiz] = useState<Quiz | undefined>();

  useLayoutEffect(() => {
    // const url = new URL("https://api.scryfall.com/cards/search");
    // url.searchParams.set("q", query);
    // url.searchParams.set("order", order);
    // url.searchParams.set("dir", direction);
    // const response: ScryfallList.Cards = await (await fetch(url)).json();
    // const cards = response.data;
    //
    // setQuiz({
    //   description,
    //   query,
    //   order,
    //   direction,
    //   cards: [],
    //   quantity,
    //   time,
    //   options: { showMana, showSet },
    // });
  }, []);

  return <div className="HomePage"></div>;
}
