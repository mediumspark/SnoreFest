// Earnings & hourly rate calculator
(function setupEarningsCalculator() {
  const amountEl = document.getElementById("amount-earned");
  const hoursEl = document.getElementById("time-hours");
  const minutesEl = document.getElementById("time-minutes");
  const btn = document.getElementById("calc-rate-btn");
  const resultEl = document.getElementById("rate-result");

  if (!amountEl || !hoursEl || !minutesEl || !btn || !resultEl) return;

  function calc() {
    const amount = parseFloat(amountEl.value || "0");
    const hours = parseFloat(hoursEl.value || "0");
    const minutes = parseFloat(minutesEl.value || "0");

    if (amount <= 0 || (hours <= 0 && minutes <= 0)) {
      resultEl.textContent = "Hourly rate: —";
      resultEl.classList.add("error");
      resultEl.textContent = "Enter an amount and time greater than zero.";
      return;
    }

    const totalHours = hours + minutes / 60;
    const hourly = amount / totalHours;

    if (!isFinite(hourly) || hourly <= 0) {
      resultEl.textContent = "Hourly rate: —";
      resultEl.classList.add("error");
      resultEl.textContent = "Something looks off. Double-check your numbers.";
      return;
    }

    resultEl.classList.remove("error");
    resultEl.textContent = `Hourly rate: $${hourly.toFixed(2)}/hr`;
  }

  btn.addEventListener("click", calc);
})();

// Break timer
(function setupBreakTimer() {
  const displayEl = document.getElementById("timer-display");
  const minutesInput = document.getElementById("timer-minutes");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resetBtn = document.getElementById("timer-reset");

  if (!displayEl || !minutesInput || !startBtn || !pauseBtn || !resetBtn) {
    return;
  }

  let remainingSeconds = parseInt(minutesInput.value || "5", 10) * 60;
  let timerId = null;

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function syncInitial() {
    const mins = Math.min(
      60,
      Math.max(1, parseInt(minutesInput.value || "5", 10))
    );
    remainingSeconds = mins * 60;
    displayEl.textContent = formatTime(remainingSeconds);
  }

  function tick() {
    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      remainingSeconds = 0;
      displayEl.textContent = formatTime(remainingSeconds);
      // gentle visual cue by toggling a class could be added here
      startBtn.disabled = false;
      minutesInput.disabled = false;
      return;
    }
    remainingSeconds -= 1;
    displayEl.textContent = formatTime(remainingSeconds);
  }

  function start() {
    if (timerId != null) return;
    if (remainingSeconds <= 0) {
      syncInitial();
    }
    timerId = setInterval(tick, 1000);
    startBtn.disabled = true;
    minutesInput.disabled = true;
  }

  function pause() {
    if (timerId == null) return;
    clearInterval(timerId);
    timerId = null;
    startBtn.disabled = false;
    minutesInput.disabled = true;
  }

  function reset() {
    clearInterval(timerId);
    timerId = null;
    syncInitial();
    startBtn.disabled = false;
    minutesInput.disabled = false;
  }

  minutesInput.addEventListener("change", syncInitial);
  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);

  // initial display
  syncInitial();
})();

// Task log with localStorage
(function setupTaskLog() {
  const form = document.getElementById("task-form");
  const nameEl = document.getElementById("task-name");
  const earningsEl = document.getElementById("task-earnings");
  const minutesEl = document.getElementById("task-minutes");
  const listEl = document.getElementById("task-list");
  const countEl = document.getElementById("task-count");
  const totalEarnedEl = document.getElementById("task-total-earned");

  if (
    !form ||
    !nameEl ||
    !earningsEl ||
    !minutesEl ||
    !listEl ||
    !countEl ||
    !totalEarnedEl
  ) {
    return;
  }

  const STORAGE_KEY = "microtask-buddy-tasks-v1";
  let tasks = [];

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      }
    } catch {
      // ignore parse errors
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore quota errors
    }
  }

  function formatCurrency(amount) {
    const v = typeof amount === "number" ? amount : parseFloat(amount || "0");
    if (!isFinite(v)) return "$0.00";
    return `$${v.toFixed(2)}`;
  }

  function updateSummary() {
    const count = tasks.length;
    const total = tasks.reduce((sum, t) => sum + (t.earnings || 0), 0);
    countEl.textContent = `${count} task${count === 1 ? "" : "s"}`;
    totalEarnedEl.textContent = formatCurrency(total);
  }

  function render() {
    listEl.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = task.id;

      const main = document.createElement("div");
      main.className = "task-main";

      const nameSpan = document.createElement("div");
      nameSpan.className = "task-name";
      nameSpan.textContent = task.name || "(untitled task)";

      const meta = document.createElement("div");
      meta.className = "task-meta";

      const earnSpan = document.createElement("span");
      earnSpan.className = "task-earnings";
      earnSpan.textContent = formatCurrency(task.earnings || 0);

      const minsSpan = document.createElement("span");
      minsSpan.textContent = `${task.minutes || 0} min`;

      const rateSpan = document.createElement("span");
      if (task.minutes && task.earnings) {
        const hrs = task.minutes / 60;
        const rate = task.earnings / hrs;
        if (isFinite(rate) && rate > 0) {
          rateSpan.textContent = `~$${rate.toFixed(2)}/hr`;
        }
      }

      meta.appendChild(earnSpan);
      meta.appendChild(minsSpan);
      if (rateSpan.textContent) meta.appendChild(rateSpan);

      main.appendChild(nameSpan);
      main.appendChild(meta);

      const removeBtn = document.createElement("button");
      removeBtn.className = "task-remove";
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove task");
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        render();
        updateSummary();
      });

      li.appendChild(main);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });

    updateSummary();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = nameEl.value.trim();
    const earnings = parseFloat(earningsEl.value || "0");
    const minutes = parseInt(minutesEl.value || "0", 10);

    if (!name && earnings <= 0 && minutes <= 0) {
      return;
    }

    const task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: name || "",
      earnings: isFinite(earnings) && earnings > 0 ? earnings : 0,
      minutes: isFinite(minutes) && minutes > 0 ? minutes : 0,
    };

    tasks.unshift(task);
    saveTasks();
    render();

    form.reset();
    nameEl.focus();
  }

  loadTasks();
  render();
  form.addEventListener("submit", handleSubmit);
})();


