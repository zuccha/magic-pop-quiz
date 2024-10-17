import { forwardRef, useRef, useImperativeHandle } from "react";
import useSelectValue from "../hooks/use-select-value";
import { CardsQuiz } from "../models/cards-quiz";
import {
  CardsQuizDirection,
  cardsQuizDirections,
  formattedCardsQuizDirection,
} from "../models/cards-quiz-direction";
import {
  CardsQuizMode,
  cardsQuizModes,
  formattedCardsQuizMode,
} from "../models/cards-quiz-mode";
import {
  CardsQuizOrder,
  cardsQuizOrders,
  formattedCardsQuizOrder,
} from "../models/cards-quiz-order";
import { msToTime } from "../models/time";
import "./quiz-creation-form.css";

export type QuizCreationFormRefObject = {
  configureQuiz: (quiz: CardsQuiz) => void;
  createQuiz: () => void;
};

export type QuizCreationFormProps = {
  defaultName?: string;
  defaultQuery?: string;
  defaultOrder?: CardsQuizOrder;
  defaultDirection?: CardsQuizDirection;
  defaultQuantity?: number;
  defaultTime?: number;
  defaultMode?: CardsQuizMode;
  defaultShowCost?: boolean;
  defaultShowColors?: boolean;
  defaultShowIdentity?: boolean;
  defaultShowImage?: boolean;
  defaultShowTypes?: boolean;
  defaultShowRarity?: boolean;
  defaultShowOracle?: boolean;
  defaultShowReminder?: boolean;
  defaultShowFlavor?: boolean;
  defaultShowSet?: boolean;
  defaultShowArtist?: boolean;
  defaultShowYear?: boolean;
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
      defaultMode = "free-typing",
      defaultShowCost = false,
      defaultShowColors = false,
      defaultShowIdentity = false,
      defaultShowImage = false,
      defaultShowTypes = false,
      defaultShowRarity = false,
      defaultShowOracle = false,
      defaultShowReminder = false,
      defaultShowFlavor = false,
      defaultShowSet = false,
      defaultShowArtist = false,
      defaultShowYear = false,
      defaultShowUsd = false,
      defaultShowEur = false,
      defaultShowTix = false,
      defaultShowStats = false,
    },
    ref,
  ) {
    const [mode, setMode, handleChangeMode] = useSelectValue(defaultMode);

    const formRef = useRef<HTMLFormElement>(null);

    const directionRef = useRef<HTMLSelectElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const orderRef = useRef<HTMLSelectElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const queryRef = useRef<HTMLInputElement>(null);
    const showArtistRef = useRef<HTMLInputElement>(null);
    const showColorsRef = useRef<HTMLInputElement>(null);
    const showCostRef = useRef<HTMLInputElement>(null);
    const showEurRef = useRef<HTMLInputElement>(null);
    const showFlavorRef = useRef<HTMLInputElement>(null);
    const showIdentityRef = useRef<HTMLInputElement>(null);
    const showImageRef = useRef<HTMLInputElement>(null);
    const showOracleRef = useRef<HTMLInputElement>(null);
    const showRarityRef = useRef<HTMLInputElement>(null);
    const showReminderRef = useRef<HTMLInputElement>(null);
    const showSetRef = useRef<HTMLInputElement>(null);
    const showStatsRef = useRef<HTMLInputElement>(null);
    const showTixRef = useRef<HTMLInputElement>(null);
    const showTypesRef = useRef<HTMLInputElement>(null);
    const showUsdRef = useRef<HTMLInputElement>(null);
    const showYearRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      configureQuiz: (quiz: CardsQuiz) => {
        setMode(quiz.mode);

        if (directionRef.current) directionRef.current.value = quiz.direction;
        if (nameRef.current) nameRef.current.value = quiz.name;
        if (orderRef.current) orderRef.current.value = quiz.order;
        if (quantityRef.current) quantityRef.current.value = `${quiz.quantity}`;
        if (queryRef.current) queryRef.current.value = quiz.query;
        if (showArtistRef.current)
          showArtistRef.current.checked = Boolean(quiz.hints.showArtist);
        if (showColorsRef.current)
          showColorsRef.current.checked = Boolean(quiz.hints.showColors);
        if (showCostRef.current)
          showCostRef.current.checked = Boolean(quiz.hints.showCost);
        if (showEurRef.current)
          showEurRef.current.checked = Boolean(quiz.hints.showPriceEur);
        if (showFlavorRef.current)
          showFlavorRef.current.checked = Boolean(quiz.hints.showFlavor);
        if (showIdentityRef.current)
          showIdentityRef.current.checked = Boolean(quiz.hints.showIdentity);
        if (showImageRef.current)
          showImageRef.current.checked = Boolean(quiz.hints.showImage);
        if (showOracleRef.current)
          showOracleRef.current.checked = Boolean(quiz.hints.showOracle);
        if (showRarityRef.current)
          showRarityRef.current.checked = Boolean(quiz.hints.showRarity);
        if (showReminderRef.current)
          showReminderRef.current.checked = Boolean(quiz.hints.showReminder);
        if (showSetRef.current)
          showSetRef.current.checked = Boolean(quiz.hints.showSet);
        if (showStatsRef.current)
          showStatsRef.current.checked = Boolean(quiz.hints.showStats);
        if (showTixRef.current)
          showTixRef.current.checked = Boolean(quiz.hints.showPriceTix);
        if (showTypesRef.current)
          showTypesRef.current.checked = Boolean(quiz.hints.showTypes);
        if (showUsdRef.current)
          showUsdRef.current.checked = Boolean(quiz.hints.showPriceUsd);
        if (showYearRef.current)
          showYearRef.current.checked = Boolean(quiz.hints.showYear);
        if (timeRef.current) timeRef.current.value = msToTime(quiz.time);
      },
      createQuiz: () => formRef.current?.submit(),
    }));

    return (
      <form action="/cards/quiz" className="QuizCreationForm" ref={formRef}>
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

          <select name="mode" onChange={handleChangeMode} required value={mode}>
            {cardsQuizModes.map((mode) => (
              <option key={mode} value={mode}>
                {formattedCardsQuizMode[mode]}
              </option>
            ))}
          </select>
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
            {cardsQuizOrders.map((order) => (
              <option key={order} value={order}>
                {formattedCardsQuizOrder[order]}
              </option>
            ))}
          </select>

          <select
            defaultValue={defaultDirection}
            name="dir"
            ref={directionRef}
            required
          >
            {cardsQuizDirections.map((direction) => (
              <option key={direction} value={direction}>
                {formattedCardsQuizDirection[direction]}
              </option>
            ))}
          </select>
        </div>

        <div className="QuizCreationForm_Hints">
          <Checkbox
            defaultChecked={defaultShowCost}
            id="show-cost"
            name="Cost"
            ref={showCostRef}
          />
          <Checkbox
            defaultChecked={defaultShowColors}
            id="show-colors"
            name="Colors"
            ref={showColorsRef}
          />
          <Checkbox
            defaultChecked={defaultShowIdentity}
            id="show-identity"
            name="Identity"
            ref={showIdentityRef}
          />
          <Checkbox
            defaultChecked={defaultShowTypes}
            id="show-types"
            name="Types"
            ref={showTypesRef}
          />
          <Checkbox
            defaultChecked={defaultShowStats}
            id="show-stats"
            name="Stats"
            ref={showStatsRef}
          />
          <Checkbox
            defaultChecked={defaultShowUsd}
            id="show-price-usd"
            name="USD"
            ref={showUsdRef}
          />
          <Checkbox
            defaultChecked={defaultShowEur}
            id="show-price-eur"
            name="EUR"
            ref={showEurRef}
          />
          <Checkbox
            defaultChecked={defaultShowTix}
            id="show-price-tix"
            name="TIX"
            ref={showTixRef}
          />
          <Checkbox
            defaultChecked={defaultShowRarity}
            id="show-rarity"
            name="Rarity"
            ref={showRarityRef}
          />
          <Checkbox
            defaultChecked={defaultShowSet}
            id="show-set"
            name="Set"
            ref={showSetRef}
          />
          <Checkbox
            defaultChecked={defaultShowArtist}
            id="show-artist"
            name="Artist"
            ref={showArtistRef}
          />
          <Checkbox
            defaultChecked={defaultShowYear}
            id="show-year"
            name="Year"
            ref={showYearRef}
          />
          {mode === "slideshow" && (
            <>
              <Checkbox
                defaultChecked={defaultShowImage}
                id="show-image"
                name="Image"
                ref={showImageRef}
              />
              <Checkbox
                defaultChecked={defaultShowOracle}
                id="show-oracle"
                name="Oracle"
                ref={showOracleRef}
              />
              <Checkbox
                defaultChecked={defaultShowReminder}
                id="show-reminder"
                name="Reminder"
                ref={showReminderRef}
              />
              <Checkbox
                defaultChecked={defaultShowFlavor}
                id="show-flavor"
                name="Flavor"
                ref={showFlavorRef}
              />
            </>
          )}
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

const Checkbox = forwardRef<
  HTMLInputElement,
  { defaultChecked: boolean; id: string; name: string }
>(({ defaultChecked, id, name }, ref) => (
  <label htmlFor={id}>
    <input
      defaultChecked={defaultChecked}
      id={id}
      name={id}
      ref={ref}
      type="checkbox"
    />
    {name}
  </label>
));
