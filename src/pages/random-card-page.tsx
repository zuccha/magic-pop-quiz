import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CardSheet from "../components/card-sheet";
import { useCheckboxValueStore } from "../hooks/use-checkbox-value";
import useInputValue, { useInputValueStore } from "../hooks/use-input-value";
import useResourceScryfall, {
  scryfallUrl,
} from "../hooks/use-resource-scryfall";
import {
  blankCard,
  blankCardFace,
  cardFromScryfallCard,
  guessMatchesCard,
} from "../models/card";
import { validateListWithAtLeastOneItem } from "../utils";
import "./random-card-page.css";

export default function RandomCardPage() {
  document.title = "Guess a Random Card! • Magic Pop Quiz";

  const guessInputRef = useRef<HTMLInputElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

  const [query, , handleQueryChange] = useInputValueStore(
    "setting/random-card/query",
    "not:reprint",
  );
  const [guess, setGuess, handleGuessChange] = useInputValue("");
  const [gaveUp, setGaveUp] = useState(false);

  const [showColors, _setShowColorsChange, handleShowColorsChange] =
    useCheckboxValueStore("setting/random-card/show-colors", true);
  const [showCost, _setShowCostChange, handleShowCostChange] =
    useCheckboxValueStore("setting/random-card/show-cost", true);
  const [showImage, _setShowImageChange, handleShowImageChange] =
    useCheckboxValueStore("setting/random-card/show-image", true);
  const [showType, _setShowTypeChange, handleShowTypeChange] =
    useCheckboxValueStore("setting/random-card/show-type", false);
  const [showRarity, _setShowRarityChange, handleShowRarityChange] =
    useCheckboxValueStore("setting/random-card/show-rarity", true);
  const [showOracle, _setShowOracleChange, handleShowOracleChange] =
    useCheckboxValueStore("setting/random-card/show-oracle", false);
  const [showReminder, _setShowReminderChange, handleShowReminderChange] =
    useCheckboxValueStore("setting/random-card/show-reminder", true);
  const [showFlavor, _setShowFlavorChange, handleShowFlavorChange] =
    useCheckboxValueStore("setting/random-card/show-flavor", false);
  const [showStats, _setShowStatsChange, handleShowStatsChange] =
    useCheckboxValueStore("setting/random-card/show-stats", false);
  const [showSet, _setShowSetChange, handleShowSetChange] =
    useCheckboxValueStore("setting/random-card/show-set", true);
  const [showArtist, _setShowArtistChange, handleShowArtistChange] =
    useCheckboxValueStore("setting/random-card/show-artist", true);
  const [showYear, _setShowYearChange, handleShowYearChange] =
    useCheckboxValueStore("setting/random-card/show-year", true);

  const url = useMemo(() => {
    // const url = scryfallUrl("/cards/named");
    // url.searchParams.set("fuzzy", "");
    const url = scryfallUrl("/cards/random");
    url.searchParams.set("q", query);
    return url.toString();
  }, [query]);

  const [randomCard, fetchRandomCard] = useResourceScryfall(
    url,
    cardFromScryfallCard,
  );

  const guessed = useMemo(() => {
    if (randomCard.status !== "success") return false;
    return guessMatchesCard(randomCard.data, guess);
  }, [guess, randomCard]);

  const loading =
    randomCard.status === "initial" || randomCard.status === "loading";

  const card = useMemo(() => {
    if (randomCard.status !== "success") return blankCard;
    if (guessed) return randomCard.data;

    return {
      ...randomCard.data,
      faces: validateListWithAtLeastOneItem(
        randomCard.data.faces.map((face) => ({
          ...face,
          art: showImage ? face.art : "",
          artist: showArtist ? face.artist : "",
          colors: showColors ? face.colors : [],
          cost: showCost ? face.cost : [],
          flavor: showFlavor ? face.flavor : undefined,
          name: "",
          oracle: showOracle
            ? face.oracle.replace(new RegExp(face.name, "g"), "~")
            : "",
          stats: showStats ? face.stats : face.stats ? " " : undefined,
          typeLine: showType ? face.typeLine : "",
        })),
        blankCardFace,
      ),
      rarity: showRarity ? randomCard.data.rarity : "",
      releaseYear: showYear ? randomCard.data.releaseYear : "",
      set: showSet ? randomCard.data.set : { code: "", name: "" },
    };
  }, [
    guessed,
    randomCard,
    showArtist,
    showColors,
    showCost,
    showFlavor,
    showImage,
    showOracle,
    showRarity,
    showSet,
    showStats,
    showType,
    showYear,
  ]);

  const fetchNextRandomCard = useCallback(() => {
    setGuess("");
    setGaveUp(false);
    fetchRandomCard();
  }, [fetchRandomCard]);

  const submitFetchNextRandomCard = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") fetchNextRandomCard();
    },
    [fetchNextRandomCard],
  );

  const giveUp = useCallback(() => {
    setGuess(card.name);
    setGaveUp(true);
  }, [card.name]);

  useEffect(() => {
    if (randomCard.status === "success") guessInputRef.current?.focus();
  }, [randomCard.status]);

  useEffect(() => {
    if (guessed) queryInputRef.current?.focus();
  }, [guessed]);

  return (
    <div className="RandomCardPage">
      <div className="RandomCardPage_Card">
        <CardSheet card={card} scale={1} showReminder={showReminder} />
      </div>

      <div className="RandomCardPage_Form">
        {guessed ? (
          <>
            <h3>
              {gaveUp ? "Too bad... " : "Correct! "}
              The card is{" "}
              <a href={card.scryfallUrl} target="_blank">
                <b>{card.name}</b>
              </a>
              !
            </h3>
            <div className="RandomCardPage_Inputs">
              <input
                autoFocus
                disabled={loading}
                onChange={handleQueryChange}
                onKeyDown={submitFetchNextRandomCard}
                placeholder="Scryfall query"
                ref={queryInputRef}
                value={query}
              />
              <button
                className="solid"
                disabled={loading}
                onClick={fetchNextRandomCard}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Guess the card!</h3>
            <div className="RandomCardPage_Inputs">
              <input
                autoFocus
                disabled={loading}
                onChange={handleGuessChange}
                placeholder="Name of the card"
                ref={guessInputRef}
                value={guess}
              />
              <button className="danger" disabled={loading} onClick={giveUp}>
                Give Up
              </button>
            </div>
          </>
        )}

        <small>
          <i>{guessed ? "\u00A0" : query || "\u00A0"}</i>
        </small>

        <div className="RandomCardPage_Hints">
          <Checkbox
            checked={showColors}
            disabled={loading}
            id="show-color"
            label="Color"
            onChange={handleShowColorsChange}
          />

          <Checkbox
            checked={showCost}
            disabled={loading}
            id="show-cost"
            label="Cost"
            onChange={handleShowCostChange}
          />

          <Checkbox
            checked={showImage}
            disabled={loading}
            id="show-image"
            label="Image"
            onChange={handleShowImageChange}
          />

          <Checkbox
            checked={showType}
            disabled={loading}
            id="show-type"
            label="Type"
            onChange={handleShowTypeChange}
          />

          <Checkbox
            checked={showOracle}
            disabled={loading}
            id="show-oracle"
            label="Oracle"
            onChange={handleShowOracleChange}
          />

          <Checkbox
            checked={showReminder}
            disabled={loading}
            id="show-reminder"
            label="Reminder"
            onChange={handleShowReminderChange}
          />

          <Checkbox
            checked={showFlavor}
            disabled={loading}
            id="show-flavor"
            label="Flavor"
            onChange={handleShowFlavorChange}
          />

          <Checkbox
            checked={showStats}
            disabled={loading}
            id="show-stats"
            label="Stats"
            onChange={handleShowStatsChange}
          />

          <Checkbox
            checked={showRarity}
            disabled={loading}
            id="show-rarity"
            label="Rarity"
            onChange={handleShowRarityChange}
          />

          <Checkbox
            checked={showSet}
            disabled={loading}
            id="show-set"
            label="Set"
            onChange={handleShowSetChange}
          />

          <Checkbox
            checked={showArtist}
            disabled={loading}
            id="show-artist"
            label="Artist"
            onChange={handleShowArtistChange}
          />

          <Checkbox
            checked={showYear}
            disabled={loading}
            id="show-year"
            label="Year"
            onChange={handleShowYearChange}
          />
        </div>
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  disabled,
  id,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label htmlFor={id}>
      <input
        checked={checked}
        disabled={disabled}
        id={id}
        name={id}
        onChange={onChange}
        type="checkbox"
      />
      {label}
    </label>
  );
}
