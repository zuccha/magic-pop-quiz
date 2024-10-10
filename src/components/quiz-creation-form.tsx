import { forwardRef, useRef, useImperativeHandle } from "react";
import { CardsQuiz } from "../models/cards-quiz";
import { msToTime } from "../models/time";
import "./quiz-creation-form.css";
import {
  cardsSearchOrders,
  formattedCardsSearchOrder as formattedCardsSearchOrders,
} from "../models/cards-search-order";
import {
  cardsSearchDirections,
  formattedCardsSearchDirection as formattedCardsSearchDirections,
} from "../models/cards-search-direction";

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
    const showCostRef = useRef<HTMLInputElement>(null);
    const showColorRef = useRef<HTMLInputElement>(null);
    const showTypesRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      configureQuiz: (quiz: CardsQuiz) => {
        if (nameRef.current) nameRef.current.value = quiz.name;
        if (queryRef.current) queryRef.current.value = quiz.query;
        if (orderRef.current) orderRef.current.value = quiz.order;
        if (directionRef.current) directionRef.current.value = quiz.direction;
        if (quantityRef.current) quantityRef.current.value = `${quiz.quantity}`;
        if (timeRef.current) timeRef.current.value = msToTime(quiz.time);
        if (showCostRef.current)
          showCostRef.current.checked = quiz.hints.showCost;
        if (showColorRef.current)
          showColorRef.current.checked = quiz.hints.showColor;
        if (showTypesRef.current)
          showTypesRef.current.checked = quiz.hints.showTypes;
      },
    }));

    return (
      <form className="QuizCreationForm" action="/cards-quiz">
        <div className="QuizCreationForm_Inputs">
          <input name="name" placeholder="Name" ref={nameRef} required />

          <input
            defaultValue={100}
            max={175}
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
            name="time"
            pattern="[0-5]?\d:[0-5]?\d"
            placeholder="Time"
            required
            ref={timeRef}
            size={5}
            title="mm:ss"
          />
        </div>

        <div className="QuizCreationForm_Inputs">
          <input
            name="q"
            placeholder="Scryfall query"
            ref={queryRef}
            required
          />

          <select name="order" ref={orderRef} required>
            {cardsSearchOrders.map((order) => (
              <option key={order} value={order}>
                {formattedCardsSearchOrders[order]}
              </option>
            ))}
          </select>

          <select name="dir" ref={directionRef} required>
            {cardsSearchDirections.map((direction) => (
              <option key={direction} value={direction}>
                {formattedCardsSearchDirections[direction]}
              </option>
            ))}
            <option value="auto">Auto</option>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="QuizCreationForm_Options">
          <label htmlFor="show-cost">
            <input
              type="checkbox"
              id="show-cost"
              name="show-cost"
              ref={showCostRef}
            />
            Show cost
          </label>
          <label htmlFor="show-color">
            <input
              type="checkbox"
              id="show-color"
              name="show-color"
              ref={showColorRef}
            />
            Show color
          </label>
          <label htmlFor="show-types">
            <input
              type="checkbox"
              id="show-types"
              name="show-types"
              ref={showColorRef}
            />
            Show types
          </label>
        </div>

        <button ref={buttonRef} type="submit">
          Create
        </button>
      </form>
    );
  },
);
