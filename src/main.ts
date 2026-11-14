//  While rates load, show “Loading rates…” and disable Convert. When they arrive, fill both dropdowns. Use async/await..
import { loadRates } from "./rates";
// import createStore from "./store";
// const store = createStore({
//   from: 'USD',
//   to: 'EUR',
//   amount: '100',
//   history: [],
//   filter: null,
//   status: 'loading',
// });
// store.subscribe(() => {console.log("Render called")});
// store.setState(s => ({ ...s, amount: '50' }));
// console.log(store.getState().amount);
// store.setState(s => s);
// console.log(store.getState().amount);
// store.setState(s => { s.amount = '75'; return s; });
// console.log(store.getState().amount);

// const old = store.getState();                       // grab the state object into a variable
// store.setState(s => ({ ...s, amount: '999' }));      // replace the state
// console.log(old.amount);                             // line 1
// console.log(store.getState().amount);                // line 2


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