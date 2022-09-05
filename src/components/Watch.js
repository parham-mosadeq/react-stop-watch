import React, { useReducer, useRef, useEffect } from 'react';
// * styles
import styles from './watch.module.css';
const initState = {
  isRunning: false,
  min: 0,
  sec: 0,
  millisec: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isRunning: true,
      };
    case 'STOP':
      return {
        ...state,
        isRunning: false,
      };

    case 'MILLISEC':
      return {
        ...state,
        millisec: action.payload,
      };

    case 'SEC':
      return {
        ...state,
        sec: action.payload,
      };

    case 'MIN':
      return {
        ...state,
        min: action.payload,
      };

    case 'RESET':
      return initState;

    default:
      return state;
  }
};

const Watch = () => {
  const [{ min, sec, millisec, isRunning }, dispatch] = useReducer(
    reducer,
    initState
  );
  const useInterval = (callback, delay) => {
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
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(() => {
    if (isRunning) {
      dispatch({
        type: 'MILLISEC',
        payload: millisec === 99 ? 0 : millisec + 1,
      });
    }
  }, 10);

  useInterval(() => {
    if (isRunning) {
      dispatch({
        type: 'SEC',
        payload: sec === 59 ? 0 : sec + 1,
      });
    }
  }, 1000);

  useInterval(() => {
    if (isRunning) {
      dispatch({
        type: 'MIN',
        payload: min === 59 ? 0 : min + 1,
      });
    }
  }, 60000);

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        {min.toString().padStart(2, 0)}:{sec.toString().padStart(2, 0)}:
        {millisec.toString().padStart(2, 0)}
      </div>
      <div className={styles.btnContainer}>
        {isRunning ? (
          <button
            onClick={() => {
              dispatch({ type: 'STOP' });
            }}
          >
            stop
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch({ type: 'START' });
            }}
          >
            start
          </button>
        )}
        <button
          onClick={() => {
            dispatch({ type: 'RESET' });
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default Watch;
