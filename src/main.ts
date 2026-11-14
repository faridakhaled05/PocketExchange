//  While rates load, show “Loading rates…” and disable Convert. When they arrive, fill both dropdowns. Use async/await..
import { loadRates } from "./rates";
// import { addConversion } from "./state";
// import createStore from "./store";
// const store = createStore({
//   from: 'USD',
//   to: 'EUR',
//   amount: '100',
//   history: [{ id: 1, from: 'USD', to: 'EUR', amount: 100, result: 85 , date: new Date().toISOString() }],
//   filter: null,
//   status: 'loading',
// });
// addConversion(store.getState(), { id: 2, from: 'EUR', to: 'USD', amount: 50, result: 54.35, date: new Date().toISOString() });
// const oldState = store.getState();
// const theNewConversion = { id: 3, from: 'USD', to: 'GBP', amount: 200, result: 158, date: new Date().toISOString() };
// const newState = addConversion(oldState, theNewConversion);
// console.log(newState === oldState); // false, because we created a new state object
// console.log(newState.history === oldState.history); // false, because we created a new history array
// console.log(newState.history[1] === oldState.history[0]); // true, because the first item in the new history array is the same object as the first item in the old history array
// console.log(newState.history[0] === theNewConversion);  //true, because the first in the new history is the the one we just added

const fromSelect = requireEl<HTMLSelectElement>("from");
const toSelect = requireEl<HTMLSelectElement>("to");
const convertButton = requireEl<HTMLButtonElement>("convert");
const message = requireEl<HTMLElement>("message");


function requireEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (el === null) throw new Error(`Missing #${id}`);
  return el;
}
async function loadRatesAndPopulateDropdowns() : Promise<void> {
  convertButton.disabled = true;
  message.textContent = 'Loading rates...';
  const rates = await loadRates();
  populateDropdown(fromSelect, rates);
  populateDropdown(toSelect, rates);
  convertButton.disabled = false;
  message.textContent = '';
}

function populateDropdown(select: HTMLSelectElement, rates: Record<string, number>): void {
 const options = Object.keys(rates).map(code => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = code;
  return option;
});
select.replaceChildren(...options);
}
//no await needed here because we don't need to wait for the rates to load before we can start the app. The rates will be loaded in the background and the dropdowns will be populated when they arrive.
loadRatesAndPopulateDropdowns();