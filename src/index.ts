import { useEffect, useReducer, useRef } from "react";

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type GetState<T> = () => T;
type Subscribe<T> = (listener: (state: T) => void) => () => void;

interface StoreApi<T> {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: Subscribe<T>;
}

export function createStore<T extends object>(
  createState: (set: SetState<T>, get: GetState<T>) => T
): StoreApi<T> {
  let state: T;
  const listeners = new Set<(state: T) => void>();

  const setState: SetState<T> = (partial) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener(state));
  };

  const getState: GetState<T> = () => state;

  const subscribe: Subscribe<T> = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = createState(setState, getState);

  return { getState, setState, subscribe };
}

export function useStore<T, U = T>(
  store: StoreApi<T>,
  selector?: (state: T) => U
) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);

  // Store the selector function
  const selectorRef = useRef(selector);

  // Get current selected value
  const getSelected = () => {
    const state = store.getState();
    return selectorRef.current
      ? selectorRef.current(state)
      : (state as unknown as U);
  };

  // Store the selected value with initial value
  const selectedRef = useRef<U>(getSelected());

  // Update selector ref on each render
  selectorRef.current = selector;

  useEffect(() => {
    const checkForUpdates = () => {
      const nextSelected = getSelected();

      // Only update if the selected value changed
      if (!Object.is(selectedRef.current, nextSelected)) {
        selectedRef.current = nextSelected;
        forceUpdate();
      }
    };

    return store.subscribe(checkForUpdates);
  }, [store]);

  return selectedRef.current;
}
