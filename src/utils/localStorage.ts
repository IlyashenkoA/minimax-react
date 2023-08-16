import { localStorageKey } from '../store/types/localStorage';

export const saveLocalStorage = (
  key: string,
  value: string
) => {
  localStorage.setItem(key, value);
};

export const clearLocalStorage = () => {
  localStorage.removeItem(localStorageKey.ROW);
  localStorage.removeItem(localStorageKey.ROW_LENGTH);
  localStorage.removeItem(localStorageKey.WHO_START);
};
