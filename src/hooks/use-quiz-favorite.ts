import { useCallback } from "react";
import { useStoreBoolean, useStoreString } from "./use-store";

export function createUseQuizFavorite(favPrefix: string, namePrefix: string) {
  return function useQuizFavorite(
    id: string,
    name: string,
  ): [boolean, () => void] {
    const [, setName] = useStoreString(`${namePrefix}${id}`, name);
    const [favorite, setFavorite] = useStoreBoolean(`${favPrefix}${id}`, false);

    const toggleIsFavorite = useCallback(() => {
      setName(name);
      setFavorite((prev) => !prev);
    }, [name, setFavorite]);

    return [favorite, toggleIsFavorite];
  };
}
