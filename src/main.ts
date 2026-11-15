//  While rates load, show “Loading rates…” and disable Convert. When they arrive, fill both dropdowns. Use async/await..
import { loadRates } from "./rates";
import createStore from "./store";
import { loadHistory, saveHistory } from "./storage";
import { createIdGenerator } from "./state";
import type { AppState } from "./types";

const history = loadHistory();

// history is newest-first, so history[0] holds the highest id; empty history starts at 0
export const generateId = createIdGenerator((history[0]?.id ?? -1) + 1);

const initialState: AppState = {
  from: "",
  to: "",
  amount: "",
  history, // restore saved history instead of starting empty
  filter: null,
  status: "loading",
};
const store = createStore(initialState);

// persist history to localStorage, but only when history itself changed
let lastSavedHistory = store.getState().history;
store.subscribe(() => {
  const currentHistory = store.getState().history;
  if (currentHistory === lastSavedHistory) return;
  lastSavedHistory = currentHistory;
  saveHistory(currentHistory);
});

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