import { forwardRef, useRef, useImperativeHandle } from "react";
import { CardsQuiz } from "../models/cards-quiz";
import {
  CardsSearchOrder,
  cardsSearchOrders,
  formattedCardsSearchOrder as formattedCardsSearchOrders,
} from "../models/cards-search-order";
import {
  CardsSearchDirection,
  cardsSearchDirections,
  formattedCardsSearchDirection as formattedCardsSearchDirections,
} from "../models/cards-search-direction";
import { msToTime } from "../models/time";
import "./quiz-creation-form.css";

export type QuizCreationFormRefObject = {
  configureQuiz: (quiz: CardsQuiz) => void;
  createQuiz: () => void;
};

export type QuizCreationFormProps = {
  defaultName?: string;
  defaultQuery?: string;
  defaultOrder?: CardsSearchOrder;
  defaultDirection?: CardsSearchDirection;
  defaultQuantity?: number;
  defaultTime?: number;
  defaultShowCost?: boolean;
  defaultShowColors?: boolean;
  defaultShowIdentity?: boolean;
  defaultShowTypes?: boolean;
  defaultShowUsd?: boolean;
  defaultShowEur?: boolean;
  defaultShowTix?: boolean;
  defaultShowStats?: boolean;
};

export default forwardRef<QuizCreationFormRefObject, QuizCreationFormProps>(
  function QuizCreationForm(
    {
      defaultName = "",
      defaultQuery = "",
      defaultOrder = "name",
      defaultDirection = "auto",
      defaultQuantity = 50,
      defaultTime = 10 * 60 * 1000,
      defaultShowCost = false,
      defaultShowColors = false,
      defaultShowIdentity = false,
      defaultShowTypes = false,
      defaultShowUsd = false,
      defaultShowEur = false,
      defaultShowTix = false,
      defaultShowStats = false,
    },
    ref,
  ) {
    const formRef = useRef<HTMLFormElement>(null);
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
    const showStatsRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      configureQuiz: (quiz: CardsQuiz) => {
        if (nameRef.current) nameRef.current.value = quiz.name;
        if (queryRef.current) queryRef.current.value = quiz.query;
        if (orderRef.current) orderRef.current.value = quiz.order;
        if (directionRef.current) directionRef.current.value = quiz.direction;
        if (quantityRef.current) quantityRef.current.value = `${quiz.quantity}`;
        if (timeRef.current) timeRef.current.value = msToTime(quiz.time);
        if (showCostRef.current)
          showCostRef.current.checked = Boolean(quiz.hints.showCost);
        if (showColorsRef.current)
          showColorsRef.current.checked = Boolean(quiz.hints.showColors);
        if (showIdentityRef.current)
          showIdentityRef.current.checked = Boolean(quiz.hints.showIdentity);
        if (showTypesRef.current)
          showTypesRef.current.checked = Boolean(quiz.hints.showTypes);
        if (showUsdRef.current)
          showUsdRef.current.checked = Boolean(quiz.hints.showPriceUsd);
        if (showEurRef.current)
          showEurRef.current.checked = Boolean(quiz.hints.showPriceEur);
        if (showTixRef.current)
          showTixRef.current.checked = Boolean(quiz.hints.showPriceTix);
        if (showStatsRef.current)
          showStatsRef.current.checked = Boolean(quiz.hints.showStats);
      },
      createQuiz: () => formRef.current?.submit(),
    }));

    return (
      <form action="/cards-quiz" className="QuizCreationForm" ref={formRef}>
        <div className="QuizCreationForm_Inputs">
          <input
            defaultValue={defaultName}
            name="name"
            placeholder="Name"
            ref={nameRef}
            required
          />

          <input
            defaultValue={defaultQuantity}
            max={175}
            min={0}
            name="qty"
            placeholder="Qty"
            ref={quantityRef}
            required
            size={100}
            step={1}
            type="number"
          />

          <input
            defaultValue={msToTime(defaultTime)}
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
            defaultValue={defaultQuery}
            name="q"
            placeholder="Scryfall query"
            ref={queryRef}
            required
          />

          <select
            defaultValue={defaultOrder}
            name="order"
            ref={orderRef}
            required
          >
            {cardsSearchOrders.map((order) => (
              <option key={order} value={order}>
                {formattedCardsSearchOrders[order]}
              </option>
            ))}
          </select>

          <select
            defaultValue={defaultDirection}
            name="dir"
            ref={directionRef}
            required
          >
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

        <div className="QuizCreationForm_Hints">
          <span>Hints:</span>

          <label htmlFor="show-cost">
            <input
              defaultChecked={defaultShowCost}
              id="show-cost"
              name="show-cost"
              ref={showCostRef}
              type="checkbox"
            />
            Cost
          </label>
          <label htmlFor="show-colors">
            <input
              defaultChecked={defaultShowColors}
              id="show-colors"
              name="show-colors"
              ref={showColorsRef}
              type="checkbox"
            />
            Colors
          </label>
          <label htmlFor="show-identity">
            <input
              defaultChecked={defaultShowIdentity}
              id="show-identity"
              name="show-identity"
              ref={showIdentityRef}
              type="checkbox"
            />
            Identity
          </label>
          <label htmlFor="show-types">
            <input
              defaultChecked={defaultShowTypes}
              id="show-types"
              name="show-types"
              ref={showTypesRef}
              type="checkbox"
            />
            Types
          </label>
          <label htmlFor="show-price-usd">
            <input
              defaultChecked={defaultShowUsd}
              id="show-price-usd"
              name="show-price-usd"
              ref={showUsdRef}
              type="checkbox"
            />
            Price (USD)
          </label>
          <label htmlFor="show-price-eur">
            <input
              defaultChecked={defaultShowEur}
              id="show-price-eur"
              name="show-price-eur"
              ref={showEurRef}
              type="checkbox"
            />
            Price (EUR)
          </label>
          <label htmlFor="show-price-tix">
            <input
              defaultChecked={defaultShowTix}
              id="show-price-tix"
              name="show-price-tix"
              ref={showTixRef}
              type="checkbox"
            />
            Price (TIX)
          </label>
          <label htmlFor="show-stats">
            <input
              defaultChecked={defaultShowStats}
              id="show-stats"
              name="show-stats"
              ref={showStatsRef}
              type="checkbox"
            />
            P/T
          </label>
        </div>

        <div className="QuizCreationForm_Buttons">
          <button className="solid" type="submit">
            Play
          </button>
          <button className="danger" type="reset">
            Clear
          </button>
        </div>
      </form>
    );
  },
);
