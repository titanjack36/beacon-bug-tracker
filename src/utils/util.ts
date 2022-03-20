import Toastify from "toastify-js";
import { useEffect, useRef } from "react";

export function showErrorToast(message: string) {
  Toastify({
    text: message,
    position: 'center',
    duration: 10000,
    close: true,
    className: 'error-toast',
    avatar: '/warning.svg',
    onClick: () => window.location.reload()
  }).showToast();
}

export function usePrevious <T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // returns previous value because useEffect runs afterwards
  return ref.current;
};

export function limitRange(value: number, min?: number, max?: number) {
  let result = value;
  if (min) {
    result = Math.max(result, min);
  }
  if (max) {
    result = Math.min(result, max);
  }
  return result;
}