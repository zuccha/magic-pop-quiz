import { forwardRef, useRef, useImperativeHandle } from "react";
import { CardsQuiz } from "../models/cards-quiz";
import { msToTime } from "../models/time";
import "./quiz-creation-form.css";

export type QuizCreationFormRefObject = {
  configureQuiz: (quiz: CardsQuiz) => void;
};

export type QuizCreationFormProps = {
  onCreateQuiz: (quiz: CardsQuiz) => void;
};

export default forwardRef<QuizCreationFormRefObject, QuizCreationFormProps>(
  function QuizCreationForm({}, ref) {
    const nameRef = useRef<HTMLInputElement>(null);
    const queryRef = useRef<HTMLInputElement>(null);
    const orderRef = useRef<HTMLSelectElement>(null);
    const directionRef = useRef<HTMLSelectElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const showManaRef = useRef<HTMLInputElement>(null);
    const showSetRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      configureQuiz: (quiz: CardsQuiz) => {
        if (nameRef.current) nameRef.current.value = quiz.name;
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
      <form className="QuizCreationForm" action="/cards-quiz">
        <div className="QuizCreationForm_Inputs">
          <input
            className="QuizCreationForm_Query"
            placeholder="Name"
            ref={nameRef}
            required
          />

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

        <div className="QuizCreationForm_Inputs">
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
        </div>

        <div className="QuizCreationForm_Options">
          <label htmlFor="show-mana">
            <input
              type="checkbox"
              id="show-mana"
              name="show-mana"
              ref={showManaRef}
            />
            Show mana
          </label>
          <label htmlFor="show-set">
            <input
              type="checkbox"
              id="show-set"
              name="show-set"
              ref={showSetRef}
            />
            Show set
          </label>
        </div>

        <button ref={buttonRef} type="submit">
          Create
        </button>
      </form>
    );
  },
);
