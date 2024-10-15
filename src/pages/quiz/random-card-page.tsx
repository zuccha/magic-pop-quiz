import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CardSheet from "../../components/card-sheet";
import { useCheckboxValueStore } from "../../hooks/use-checkbox-value";
import useInputValue, { useInputValueStore } from "../../hooks/use-input-value";
import useResource from "../../hooks/use-resource";
import { blankCard, cardFromScryfallCard } from "../../models/card";
import { sanitize } from "../../utils";
import "./random-card-page.css";

export default function RandomCardPage() {
  const guessInputRef = useRef<HTMLInputElement>(null);

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
  const [showOracle, _setShowOracleChange, handleShowOracleChange] =
    useCheckboxValueStore("setting/random-card/show-oracle", false);
  const [showFlavor, _setShowFlavorChange, handleShowFlavorChange] =
    useCheckboxValueStore("setting/random-card/show-flavor", false);
  const [showSet, _setShowSetChange, handleShowSetChange] =
    useCheckboxValueStore("setting/random-card/show-set", false);
  const [showArtist, _setShowArtistChange, handleShowArtistChange] =
    useCheckboxValueStore("setting/random-card/show-artist", false);
  const [showStats, _setShowStatsChange, handleShowStatsChange] =
    useCheckboxValueStore("setting/random-card/show-stats", false);

  const url = useMemo(() => {
    // const url = new URL("https://api.scryfall.com/cards/named");
    // url.searchParams.set("fuzzy", "");
    const url = new URL("https://api.scryfall.com/cards/random");
    url.searchParams.set("q", query);
    return url.toString();
  }, [query]);

  const [randomCard, fetchRandomCard] = useResource(url, cardFromScryfallCard);

  const guessed = useMemo(() => {
    if (randomCard.status !== "success") return false;

    const sanitizedGuess = sanitize(guess);
    return (
      sanitizedGuess === randomCard.data.nameSanitized ||
      randomCard.data.faces.some((f) => f.nameSanitized === sanitizedGuess)
    );
  }, [guess, randomCard]);

  const loading =
    randomCard.status === "initial" || randomCard.status === "loading";

  const card = useMemo(() => {
    if (randomCard.status !== "success") return blankCard;
    if (guessed) return randomCard.data;

    return {
      ...randomCard.data,
      faces: randomCard.data.faces.map((face) => ({
        ...face,
        artist: showArtist ? face.artist : "",
        colors: showColors ? face.colors : [],
        cost: showCost ? face.cost : [],
        flavor: showFlavor ? face.flavor : undefined,
        name: "",
        oracle: showOracle
          ? face.oracle.replace(new RegExp(face.name, "g"), "~")
          : "",
        set: showSet ? face.set : { code: "", name: "" },
        stats: showStats ? face.stats : undefined,
        type: showType ? face.typeLine : "",
      })),
    };
  }, [
    guessed,
    randomCard,
    showArtist,
    showColors,
    showCost,
    showFlavor,
    showOracle,
    showSet,
    showStats,
    showType,
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

  return (
    <div className="RandomCardPage">
      <CardSheet faces={card.faces} />

      <div className="RandomCardPage_Form">
        {guessed ? (
          <>
            <h3>
              {gaveUp ? "" : "Correct! "}
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
                placeholder="Search query"
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
            checked={showFlavor}
            disabled={loading}
            id="show-flavor"
            label="Flavor"
            onChange={handleShowFlavorChange}
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
            checked={showStats}
            disabled={loading}
            id="show-stats"
            label="Stats"
            onChange={handleShowStatsChange}
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