import { useCallback } from "react";
import { useStoreBoolean, useStoreString } from "./use-store";

const favPrefix = "fav/";
const namePrefix = "name/";

const favId = (id: string) => `${favPrefix}${id}`;
const nameId = (id: string) => `${namePrefix}${id}`;

export default function useQuizPB(
  id: string,
  name: string,
): [boolean, () => void] {
  const [, setName] = useStoreString(nameId(id), name);
  const [isFavorite, setIsFavorite] = useStoreBoolean(favId(id), false);

  const toggleIsFavorite = useCallback(() => {
    setName(name);
    setIsFavorite((prev) => !prev);
  }, [name, setIsFavorite]);

  return [isFavorite, toggleIsFavorite];
}
