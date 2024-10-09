import { forwardRef, useRef, useImperativeHandle } from "react";
import { Quiz } from "../models/quiz";
import "./quiz-creation-form.css";

export type QuizCreationFormRefObject = {
  configureQuiz: (quiz: Quiz) => void;
};

export type QuizCreationFormProps = {
  onCreateQuiz: (quiz: Quiz) => void;
};

function msToTime(ms: number): string {
  const seconds = (ms % (60 * 1000)) / 1000;
  const minutes = (ms % (60 * 60 * 1000)) / (60 * 1000);
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${minutesStr}:${secondsStr}`;
}

export default forwardRef<QuizCreationFormRefObject, QuizCreationFormProps>(
  function QuizCreationForm({}, ref) {
    const descriptionRef = useRef<HTMLInputElement>(null);
    const queryRef = useRef<HTMLInputElement>(null);
    const orderRef = useRef<HTMLSelectElement>(null);
    const directionRef = useRef<HTMLSelectElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const showManaRef = useRef<HTMLInputElement>(null);
    const showSetRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      configureQuiz: (quiz: Quiz) => {
        if (descriptionRef.current)
          descriptionRef.current.value = quiz.description;
        if (queryRef.current) queryRef.current.value = quiz.query;
        if (orderRef.current) orderRef.current.value = quiz.order;
        if (directionRef.current) directionRef.current.value = quiz.direction;
        if (quantityRef.current) quantityRef.current.value = `${quiz.quantity}`;
        if (timeRef.current) timeRef.current.value = msToTime(quiz.time);
        if (showManaRef.current)
          showManaRef.current.checked = quiz.options.showMana;
        if (showSetRef.current)
          showSetRef.current.checked = quiz.options.showSet;
      },
    }));

    return (
      <form className="QuizCreationForm" action="/quiz">
        <input
          className="QuizCreationForm_Query"
          placeholder="Description"
          ref={descriptionRef}
          required
        />

        <div className="QuizCreationForm_Group">
          <input
            className="QuizCreationForm_Query"
            name="q"
            placeholder="Scryfall query"
            ref={queryRef}
            required
          />

          <select name="order" ref={orderRef} required>
            <option value="name">Name</option>
            <option value="released">Release Date</option>
            <option value="set">Set/Number</option>
            <option value="rarity">Rarity</option>
            <option value="color">Color</option>
            <option value="usd">Price: USD</option>
            <option value="tix">Price: TIX</option>
            <option value="eur">Price: EUR</option>
            <option value="cmc">Mana Value</option>
            <option value="power">Power</option>
            <option value="toughness">Toughness</option>
            <option value="artist">Artist Name</option>
            <option value="edhrec">EDHREC Rank</option>
            <option value="review">Set Review</option>
          </select>

          <select name="dir" ref={directionRef} required>
            <option value="auto">Auto</option>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          <input
            defaultValue={100}
            max={300}
            min={1}
            name="qty"
            placeholder="Qty"
            ref={quantityRef}
            required
            size={100}
            step={1}
            type="number"
          />

          <input
            defaultValue="10:00"
            max="59:59"
            min="00:30"
            name="time"
            placeholder="Time"
            required
            ref={timeRef}
            type="time"
          />
        </div>

        <div className="QuizCreationForm_Group">
          <div className="QuizCreationForm_Option">
            <input
              type="checkbox"
              id="show-mana"
              name="show-mana"
              ref={showManaRef}
            />
            <label htmlFor="show-mana">Show mana</label>
          </div>
          <div className="QuizCreationForm_Option">
            <input
              type="checkbox"
              id="show-set"
              name="show-set"
              ref={showSetRef}
            />
            <label htmlFor="show-set">Show set</label>
          </div>
        </div>

        <button ref={buttonRef} type="submit">
          Create
        </button>
      </form>
    );
  },
);
