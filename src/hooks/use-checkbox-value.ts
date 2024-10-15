import { useState, useCallback } from "react";
import { useStoreBoolean } from "./use-store";

export default function useCheckboxValue(
  defaultValue: boolean,
): [
  boolean,
  (value: boolean) => void,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
] {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.currentTarget.checked),
    [],
  );

  return [value, setValue, handleChangeValue];
}

export function useCheckboxValueStore(
  id: string,
  defaultValue: boolean,
): [
  boolean,
  (value: boolean) => void,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
] {
  const [value, setValue] = useStoreBoolean(id, defaultValue);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.currentTarget.checked),
    [],
  );

  return [value, setValue, handleChangeValue];
}
