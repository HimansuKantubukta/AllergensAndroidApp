import { useEffect, useRef } from 'react';

/**
 * useInterval is like SetInterval but actually works as you expect.
 * Using setInterval normally with useState is very tricky as
 * the function to be scheduled will have access to an
 * old value of the state, not the latest due to how closures work.
 * This is why useInterval exists. Another advantage
 * is we don't need to care about clearing it.
 * It happens automatically.
 *
 * You can have a deeper read at:
 *
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param {*} callback
 * @param {*} delay
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
