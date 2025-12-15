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

// Gig log with localStorage and month/year summaries
(function setupGigLog() {
  const form = document.getElementById("gig-form");
  const platformEl = document.getElementById("gig-platform");
  const dateEl = document.getElementById("gig-date");
  const earningsEl = document.getElementById("gig-earnings");
  const minutesEl = document.getElementById("gig-minutes");
  const listEl = document.getElementById("gig-list");
  const countEl = document.getElementById("gig-count");
  const totalEarnedEl = document.getElementById("gig-total-earned");
  const monthSummaryEl = document.getElementById("gig-month-summary");
  const yearSummaryEl = document.getElementById("gig-year-summary");

  if (
    !form ||
    !platformEl ||
    !dateEl ||
    !earningsEl ||
    !minutesEl ||
    !listEl ||
    !countEl ||
    !totalEarnedEl ||
    !monthSummaryEl ||
    !yearSummaryEl
  ) {
    return;
  }

  const STORAGE_KEY = "snorefest-gigs-v1";
  let gigs = [];

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function loadGigs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        gigs = parsed;
      }
    } catch {
      // ignore parse errors
    }
  }

  function saveGigs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gigs));
    } catch {
      // ignore quota errors
    }
  }

  function formatCurrency(amount) {
    const v = typeof amount === "number" ? amount : parseFloat(amount || "0");
    if (!isFinite(v)) return "$0.00";
    return `$${v.toFixed(2)}`;
  }

  function formatHours(minutes) {
    const hrs = (minutes || 0) / 60;
    if (!isFinite(hrs) || hrs <= 0) return "0 hrs";
    return `${hrs.toFixed(1)} hrs`;
  }

  function calcRate(totalEarned, totalMinutes) {
    const hrs = totalMinutes / 60;
    if (!hrs || !isFinite(hrs)) return "$0.00/hr";
    const rate = totalEarned / hrs;
    if (!isFinite(rate) || rate <= 0) return "$0.00/hr";
    return `$${rate.toFixed(2)}/hr`;
  }

  function updateSummaries() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    let monthMinutes = 0;
    let monthEarned = 0;
    let yearMinutes = 0;
    let yearEarned = 0;

    gigs.forEach((gig) => {
      const d = gig.date ? new Date(gig.date) : null;
      const mins = gig.minutes || 0;
      const earn = gig.earnings || 0;

      if (!d || Number.isNaN(d.getTime())) {
        return;
      }

      if (d.getFullYear() === year) {
        yearMinutes += mins;
        yearEarned += earn;

        if (d.getMonth() === month) {
          monthMinutes += mins;
          monthEarned += earn;
        }
      }
    });

    monthSummaryEl.textContent = `${formatCurrency(
      monthEarned
    )} · ${formatHours(monthMinutes)} · ${calcRate(
      monthEarned,
      monthMinutes
    )}`;

    yearSummaryEl.textContent = `${formatCurrency(
      yearEarned
    )} · ${formatHours(yearMinutes)} · ${calcRate(
      yearEarned,
      yearMinutes
    )}`;
  }

  function updateTotals() {
    const count = gigs.length;
    const total = gigs.reduce((sum, g) => sum + (g.earnings || 0), 0);
    countEl.textContent = `${count} gig${count === 1 ? "" : "s"}`;
    totalEarnedEl.textContent = formatCurrency(total);
  }

  function render() {
    listEl.innerHTML = "";
    gigs.forEach((gig) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = gig.id;

      const main = document.createElement("div");
      main.className = "task-main";

      const nameSpan = document.createElement("div");
      nameSpan.className = "task-name";
      const platform = gig.platform || "Other";
      const dateLabel = gig.date || "";
      nameSpan.textContent = dateLabel
        ? `${platform} · ${dateLabel}`
        : platform;

      const meta = document.createElement("div");
      meta.className = "task-meta";

      const earnSpan = document.createElement("span");
      earnSpan.className = "task-earnings";
      earnSpan.textContent = formatCurrency(gig.earnings || 0);

      const minsSpan = document.createElement("span");
      minsSpan.textContent = `${gig.minutes || 0} min`;

      const rateSpan = document.createElement("span");
      if (gig.minutes && gig.earnings) {
        const hrs = gig.minutes / 60;
        const rate = gig.earnings / hrs;
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
      removeBtn.setAttribute("aria-label", "Remove gig");
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        gigs = gigs.filter((g) => g.id !== gig.id);
        saveGigs();
        render();
        updateTotals();
        updateSummaries();
      });

      li.appendChild(main);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });

    updateTotals();
    updateSummaries();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const platform = platformEl.value.trim();
    const date = dateEl.value || todayISO();
    const earnings = parseFloat(earningsEl.value || "0");
    const minutes = parseInt(minutesEl.value || "0", 10);

    if (!platform && earnings <= 0 && minutes <= 0) {
      return;
    }

    const gig = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      platform: platform || "Other",
      date,
      earnings: isFinite(earnings) && earnings > 0 ? earnings : 0,
      minutes: isFinite(minutes) && minutes > 0 ? minutes : 0,
    };

    gigs.unshift(gig);
    saveGigs();
    render();

    form.reset();
    dateEl.value = todayISO();
    platformEl.focus();
  }

  loadGigs();
  render();
  dateEl.value = todayISO();
  form.addEventListener("submit", handleSubmit);
})();


