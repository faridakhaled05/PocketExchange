import { loadRates } from "./rates";
import createStore from "./store";
import { loadHistory, saveHistory } from "./storage";
import { createIdGenerator, getVisibleHistory, getTotals, removeConversion, swapCurrencies, clearHistory, validateAmount, convert, addConversion } from "./state";
import type { AppState, Conversion } from "./types";

const history = loadHistory();

// history is newest-first, so history[0] holds the highest id
export const generateId = createIdGenerator((history[0]?.id ?? -1) + 1);

const initialState: AppState = {
  from: "EUR",
  to: "EGP",
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
const resultEl = requireEl<HTMLElement>("result");
const historyList = requireEl<HTMLUListElement>("history-list");
const totalsEl = requireEl<HTMLElement>("totals");
const swapButton = requireEl<HTMLButtonElement>("swap");
const clearButton = requireEl<HTMLButtonElement>("clear");
const filterSelect = requireEl<HTMLSelectElement>("filter");
const amountInput = requireEl<HTMLInputElement>("amount");

// populated once loadRatesAndPopulateDropdowns resolves; convert() needs it
let rates: Record<string, number> = {};

function requireEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (el === null) throw new Error(`Missing #${id}`);
  return el;
}

function formatConversion(conversion: Conversion): string {
  // rounded for display only; conversion.result itself stays exact so
  // getTotals summing raw results doesn't compound rounding error
  const roundedResult = conversion.result.toFixed(2);
  return `${conversion.amount} ${conversion.from} = ${roundedResult} ${conversion.to}`;
}

function render(state: AppState): void {
  convertButton.disabled = state.status === "loading";
  message.textContent = state.status === "loading" ? "Loading rates..." : "";

  fromSelect.value = state.from;
  toSelect.value = state.to;

  const latest = state.history[0];
  resultEl.textContent = latest ? formatConversion(latest) : "";

  const visibleHistory = getVisibleHistory(state);
  const items = visibleHistory.map(conversion => {
    const li = document.createElement("li");
    li.className = "history-item";

    const span = document.createElement("span");
    span.textContent = formatConversion(conversion);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = String(conversion.id);

    li.append(span, deleteButton);
    return li;
  });
  
  historyList.replaceChildren(...items);

  // totals: rounding happens here, not in getTotals
  const totals = getTotals(state);
  const totalsText = Object.entries(totals)
    .map(([currency, amount]) => `${currency}: ${Math.round(amount).toLocaleString("en-US")}`)
    .join(", ");
  totalsEl.textContent = totalsText;
}

render(store.getState());
store.subscribe(() => render(store.getState()));

historyList.addEventListener("click", (event) => {
  // event.target is EventTarget | null, and may be the button or something inside it
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("button[data-id]");
  if (button === null) return;

  const id = Number(button.dataset.id);
  store.setState(current => removeConversion(current, id));
});

swapButton.addEventListener("click", () => {
  store.setState(swapCurrencies);
});

clearButton.addEventListener("click", () => {
  store.setState(clearHistory);
});

filterSelect.addEventListener("change", () => {
  store.setState(current => ({ ...current, filter: filterSelect.value || null }));
});

fromSelect.addEventListener("change", () => {
  store.setState(current => ({ ...current, from: fromSelect.value }));
});

toSelect.addEventListener("change", () => {
  store.setState(current => ({ ...current, to: toSelect.value }));
});

convertButton.addEventListener("click", () => {
  const error = validateAmount(amountInput.value);
  if (error !== null) {
    message.textContent = error;
    return; // setState is called zero times on failure
  }

  const amount = Number(amountInput.value);
  const { from, to } = store.getState();
  const result = convert(amount, from, to, rates);

  const conversion: Conversion = {
    id: generateId(),
    date: new Date().toISOString(),
    from,
    to,
    amount,
    result,
  };

  store.setState(current => addConversion(current, conversion));
});

async function loadRatesAndPopulateDropdowns() : Promise<void> {
  rates = await loadRates();
  populateDropdown(fromSelect, rates);
  populateDropdown(toSelect, rates);
  store.setState(current => ({ ...current, status: "ready" }));
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