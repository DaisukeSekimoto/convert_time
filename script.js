const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function timeToMinutes(value) {
  if (!/^\d{1,3}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (minutes > 59) return null;
  return hours * 60 + minutes;
}

function pad(value) { return String(value).padStart(2, "0"); }

function formatSignedMinutes(total) {
  const sign = total < 0 ? "−" : "";
  const absolute = Math.abs(Math.round(total));
  return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

function calculateRange() {
  const start = timeToMinutes($("#start-time").value);
  const end = timeToMinutes($("#end-time").value);
  const breakTime = Math.max(0, Number($("#break-minutes").value) || 0);
  if (start === null || end === null) return;
  let elapsed = end - start;
  if (elapsed < 0) elapsed += 24 * 60;
  elapsed = Math.max(0, elapsed - breakTime);
  $("#range-hours").textContent = Math.floor(elapsed / 60);
  $("#range-minutes").textContent = pad(elapsed % 60);
  $("#range-total").textContent = `${elapsed}分`;
  $("#range-decimal").textContent = `${(elapsed / 60).toFixed(2)}時間`;
}

function convertToMinutes() {
  const hoursInput = $("#convert-hours");
  const minutesInput = $("#convert-time-minutes");
  const hours = Number(hoursInput.value);
  const minutes = Number(minutesInput.value);
  const invalid = hoursInput.value === "" || minutesInput.value === "" || hours < 0 || minutes < 0 || minutes > 59 || !Number.isInteger(hours) || !Number.isInteger(minutes);
  $("#convert-form .segmented-time").setAttribute("aria-invalid", String(invalid));
  $("#time-error").textContent = invalid ? "時間は0以上、分は0〜59で入力してください。" : "";
  if (!invalid) $("#convert-minutes").value = hours * 60 + minutes;
}

function convertToTime() {
  const input = $("#convert-minutes");
  const total = Number(input.value);
  const invalid = input.value === "" || total < 0 || !Number.isInteger(total);
  input.setAttribute("aria-invalid", String(invalid));
  $("#time-error").textContent = invalid ? "分は0以上の整数で入力してください。" : "";
  if (invalid) return;
  $("#convert-hours").value = Math.floor(total / 60);
  $("#convert-time-minutes").value = total % 60;
  $("#convert-form .segmented-time").setAttribute("aria-invalid", "false");
  $("#time-error").textContent = "";
}

function updateRemoveButtons() {
  const buttons = $$(".remove-box-button");
  buttons.forEach((button) => { button.disabled = buttons.length <= 2; });
}

function normalizeFirstOperator() {
  const firstItem = $(".expression-item");
  if (!firstItem) return;
  const currentOperator = firstItem.firstElementChild;
  if (currentOperator.classList.contains("first-operator")) return;

  const firstOperator = document.createElement("span");
  firstOperator.className = "first-operator";
  firstOperator.textContent = "開始";
  currentOperator.replaceWith(firstOperator);
}

function calculateExpression() {
  let total = 0;
  let hasError = false;

  $$(".expression-item").forEach((item, index) => {
    const timeField = item.querySelector(".expression-time");
    const hoursInput = item.querySelector(".duration-hours");
    const minutesInput = item.querySelector(".duration-minutes");
    const hours = Number(hoursInput.value);
    const minutePart = Number(minutesInput.value);
    const invalid = hoursInput.value === "" || minutesInput.value === "" || hours < 0 || minutePart < 0 || minutePart > 59 || !Number.isInteger(hours) || !Number.isInteger(minutePart);
    timeField.setAttribute("aria-invalid", String(invalid));
    hasError ||= invalid;
    if (invalid) return;

    const minutes = hours * 60 + minutePart;
    const operator = index === 0 ? "+" : item.querySelector(".expression-operator").value;
    total += operator === "+" ? minutes : -minutes;
  });

  $("#calculation-error").textContent = hasError ? "時間は0以上、分は0〜59で入力してください。" : "";
  $("#calculation-result").textContent = hasError ? "—" : formatSignedMinutes(total);
  $("#calculation-total").textContent = hasError ? "—" : `${total}分`;
}

function addTimeBox(hours = 0, minutes = 0) {
  const item = document.createElement("div");
  const isFirst = $("#expression-list").children.length === 0;
  item.className = "expression-item";

  const operator = document.createElement(isFirst ? "span" : "select");
  if (isFirst) {
    operator.className = "first-operator";
    operator.textContent = "開始";
  } else {
    operator.className = "expression-operator";
    operator.setAttribute("aria-label", "演算子");
    operator.append(new Option("＋ 足す", "+"), new Option("− 引く", "-"));
  }

  const timeField = document.createElement("span");
  timeField.className = "segmented-time expression-time";

  const hoursInput = document.createElement("input");
  hoursInput.className = "duration-hours";
  hoursInput.type = "number";
  hoursInput.inputMode = "numeric";
  hoursInput.min = "0";
  hoursInput.step = "1";
  hoursInput.value = hours;
  hoursInput.setAttribute("aria-label", "時間");

  const separator = document.createElement("b");
  separator.textContent = ":";
  separator.setAttribute("aria-hidden", "true");

  const minutesInput = document.createElement("input");
  minutesInput.className = "duration-minutes";
  minutesInput.type = "number";
  minutesInput.inputMode = "numeric";
  minutesInput.min = "0";
  minutesInput.max = "59";
  minutesInput.step = "1";
  minutesInput.value = minutes;
  minutesInput.setAttribute("aria-label", "分");

  timeField.append(hoursInput, separator, minutesInput);

  const removeButton = document.createElement("button");
  removeButton.className = "remove-box-button";
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", "この時間を削除");
  removeButton.textContent = "×";

  item.append(operator, timeField, removeButton);
  $("#expression-list").append(item);
  updateRemoveButtons();
  calculateExpression();
  if ($$(".expression-item").length > 2) hoursInput.focus();
}

$$('[data-target]').forEach((button) => {
  button.addEventListener("click", () => {
    $$(".nav-button").forEach((item) => item.classList.toggle("active", item === button));
    $$(".tool-panel").forEach((panel) => {
      const active = panel.id === button.dataset.target;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
  });
});

$$('form').forEach((form) => form.addEventListener('submit', (event) => event.preventDefault()));

[$("#start-time"), $("#end-time"), $("#break-minutes")].forEach((input) => input.addEventListener("input", calculateRange));
$("#convert-hours").addEventListener("input", convertToMinutes);
$("#convert-time-minutes").addEventListener("input", convertToMinutes);
$("#convert-minutes").addEventListener("input", convertToTime);
$("#add-time-box").addEventListener("click", () => addTimeBox());
$("#expression-list").addEventListener("input", calculateExpression);
$("#expression-list").addEventListener("click", (event) => {
  const button = event.target.closest(".remove-box-button");
  if (!button || button.disabled) return;
  button.closest(".expression-item").remove();
  normalizeFirstOperator();
  updateRemoveButtons();
  calculateExpression();
});

calculateRange();
convertToMinutes();
addTimeBox(0, 0);
addTimeBox(0, 0);
