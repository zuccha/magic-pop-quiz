import { useState, useCallback } from "react";
import { useStoreString } from "./use-store";

export default function useSelectValue(
  defaultValue: string,
): [
  string,
  (value: string) => void,
  (e: React.ChangeEvent<HTMLSelectElement>) => void,
] {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setValue(e.currentTarget.value),
    [],
  );

  return [value, setValue, handleChangeValue];
}

export function useSelectValueStore(
  id: string,
  defaultValue: string,
): [
  string,
  (value: string) => void,
  (e: React.ChangeEvent<HTMLSelectElement>) => void,
] {
  const [value, setValue] = useStoreString(id, defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setValue(e.currentTarget.value),
    [],
  );

  return [value, setValue, handleChangeValue];
}
