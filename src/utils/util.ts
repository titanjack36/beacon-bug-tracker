import Toastify from "toastify-js";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";

export function showErrorToast(message: string, onClick?: () => void) {
  Toastify({
    text: message,
    position: 'center',
    duration: 10000,
    close: true,
    className: 'error-toast',
    avatar: '/warning.svg',
    onClick: onClick || (() => window.location.reload())
  }).showToast();
}

export function useCompare<T>(value: T) {
  const prevValue = usePrevious(value);
  return prevValue !== value;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(); // initially undefined
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // returns previous value because useEffect runs afterwards
  return ref.current;
};

export function useStateRef<T>(value: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [state, setState] = useState(value);
  const stateRef = useTrackingRef(state);
  return [state, setState, stateRef];
}

export function useTrackingRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

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