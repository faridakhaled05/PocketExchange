import type { AppState } from './types';
export default function createStore(initialState: AppState) {
    //let because we will reassign it when the state changes
  let state = initialState;

  //private array of listerners that will be called when the state changes, set of functions that take no arguments and return void
  const listeners: Set<() => void> = new Set();

  function subscribe(listener: () => void) {
    listeners.add(listener);
    //return an unsubscribe function that will remove the listener from the set of listeners when called
    return () => {
      listeners.delete(listener);
    };
  }

  function getState() {
    return state;
  }
  
  function setState(updater: (current: AppState) => AppState) {
    const newState = updater(state);
    if (newState === state) {
      console.log("No change, skipping render");
      return;
    }
    state = newState;
    for (const listener of [...listeners]) {
      listener();
    }
    
  }
 
  return { getState, setState, subscribe };



}   
