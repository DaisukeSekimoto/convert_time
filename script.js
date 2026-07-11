const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function timeToMinutes(value) {
  if (!/^\d{1,3}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (minutes > 59) return null;
  return hours * 60 + minutes;
}

function pad(value) { return String(value).padStart(2, "0"); }

function formatMinutes(total) {
  const safeTotal = Math.max(0, Math.round(total));
  return `${pad(Math.floor(safeTotal / 60))}:${pad(safeTotal % 60)}`;
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
  const value = $("#convert-time").value.trim();
  const minutes = timeToMinutes(value);
  $("#time-error").textContent = minutes === null ? "例のように入力してください（例 02:30）" : "";
  if (minutes !== null) $("#convert-minutes").value = minutes;
}

function convertToTime() {
  const input = $("#convert-minutes");
  if (input.value === "" || Number(input.value) < 0) return;
  $("#convert-time").value = formatMinutes(Number(input.value));
  $("#time-error").textContent = "";
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
$("#convert-time").addEventListener("input", convertToMinutes);
$("#convert-minutes").addEventListener("input", convertToTime);

calculateRange();
convertToMinutes();
