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
    const showColorsRef = useRef<HTMLInputElement>(null);
    const showIdentityRef = useRef<HTMLInputElement>(null);
    const showTypesRef = useRef<HTMLInputElement>(null);
    const showUsdRef = useRef<HTMLInputElement>(null);
    const showEurRef = useRef<HTMLInputElement>(null);
    const showTixRef = useRef<HTMLInputElement>(null);
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
        if (showColorsRef.current)
          showColorsRef.current.checked = quiz.hints.showColors;
        if (showIdentityRef.current)
          showIdentityRef.current.checked = quiz.hints.showIdentity;
        if (showTypesRef.current)
          showTypesRef.current.checked = quiz.hints.showTypes;
        if (showUsdRef.current) showUsdRef.current.checked = quiz.hints.showUsd;
        if (showEurRef.current) showEurRef.current.checked = quiz.hints.showEur;
        if (showTixRef.current) showTixRef.current.checked = quiz.hints.showTix;
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
          <span>Hints:</span>

          <label htmlFor="show-cost">
            <input
              type="checkbox"
              id="show-cost"
              name="show-cost"
              ref={showCostRef}
            />
            Cost
          </label>
          <label htmlFor="show-colors">
            <input
              type="checkbox"
              id="show-colors"
              name="show-colors"
              ref={showColorsRef}
            />
            Colors
          </label>
          <label htmlFor="show-identity">
            <input
              type="checkbox"
              id="show-identity"
              name="show-identity"
              ref={showIdentityRef}
            />
            Identity
          </label>
          <label htmlFor="show-types">
            <input
              type="checkbox"
              id="show-types"
              name="show-types"
              ref={showTypesRef}
            />
            Types
          </label>
          <label htmlFor="show-usd">
            <input
              type="checkbox"
              id="show-usd"
              name="show-usd"
              ref={showUsdRef}
            />
            Price (USD)
          </label>
          <label htmlFor="show-eur">
            <input
              type="checkbox"
              id="show-eur"
              name="show-eur"
              ref={showEurRef}
            />
            Price (EUR)
          </label>
          <label htmlFor="show-tix">
            <input
              type="checkbox"
              id="show-tix"
              name="show-tix"
              ref={showTixRef}
            />
            Price (TIX)
          </label>
        </div>

        <button ref={buttonRef} type="submit">
          Create
        </button>
      </form>
    );
  },
);
