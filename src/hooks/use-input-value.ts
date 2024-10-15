import { useState, useCallback } from "react";
import { useStoreString } from "./use-store";

export default function useInputValue(
  defaultValue: string,
): [
  string,
  (value: string) => void,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
] {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    [],
  );

  return [value, setValue, handleChangeValue];
}

export function useInputValueStore(
  id: string,
  defaultValue: string,
): [
  string,
  (value: string) => void,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
] {
  const [value, setValue] = useStoreString(id, defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    [],
  );

  return [value, setValue, handleChangeValue];
}
