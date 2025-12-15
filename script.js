<<<<<<< HEAD
// Shared location and averages system
(function setupLocationSystem() {
  const LOCATION_STORAGE_KEY = "snorefest-location-pref";
  const LOCATION_DATA_KEY = "snorefest-location-data";

  // National industry averages
  const nationalAverages = {
    "": 18.0, // General gig work average
    "Uber": 20.0,
    "DoorDash": 16.0,
    "Instacart": 17.0,
    "Prolific": 8.0,
    "MTurk": 6.0,
  };

  // Metro multipliers (same as in ticker)
  const metroMultipliers = {
    "high": {
      "Uber": 1.15,
      "DoorDash": 1.12,
      "Instacart": 1.10,
      "Prolific": 1.0,
      "MTurk": 1.0,
    },
    "medium": {
      "Uber": 1.08,
      "DoorDash": 1.06,
      "Instacart": 1.05,
      "Prolific": 1.0,
      "MTurk": 1.0,
    },
    "low": {
      "Uber": 0.92,
      "DoorDash": 0.94,
      "Instacart": 0.95,
      "Prolific": 1.0,
      "MTurk": 1.0,
    },
  };

  function getLocationData() {
    try {
      const locationData = localStorage.getItem(LOCATION_DATA_KEY);
      if (locationData) {
        return JSON.parse(locationData);
      }
    } catch {
      return null;
    }
    return null;
  }

  function getCurrentAverages() {
    const locationData = getLocationData();
    const useLocation = localStorage.getItem(LOCATION_STORAGE_KEY) === "true";
    
    if (!useLocation || !locationData || !locationData.metroTier) {
      return nationalAverages;
    }

    const multipliers = metroMultipliers[locationData.metroTier] || metroMultipliers["medium"];
    const localAverages = {};
    
    Object.keys(nationalAverages).forEach((platform) => {
      const multiplier = multipliers[platform] || 1.0;
      localAverages[platform] = nationalAverages[platform] * multiplier;
    });

    return localAverages;
  }

  // Expose to global scope for other functions
  window.getCurrentAverages = getCurrentAverages;
  window.nationalAverages = nationalAverages;
})();

// Earnings & hourly rate calculator with comparison
=======
// Earnings & hourly rate calculator
>>>>>>> Deployment
(function setupEarningsCalculator() {
  const amountEl = document.getElementById("amount-earned");
  const hoursEl = document.getElementById("time-hours");
  const minutesEl = document.getElementById("time-minutes");
<<<<<<< HEAD
  const platformEl = document.getElementById("rate-platform");
  const btn = document.getElementById("calc-rate-btn");
  const resultEl = document.getElementById("rate-result");
  const comparisonEl = document.getElementById("rate-comparison");
  const comparisonTextEl = document.getElementById("comparison-text");
  const comparisonDetailsEl = document.getElementById("comparison-details");

  if (!amountEl || !hoursEl || !minutesEl || !btn || !resultEl) return;

  function getPlatformAverages() {
    return window.getCurrentAverages ? window.getCurrentAverages() : window.nationalAverages;
  }

=======
  const btn = document.getElementById("calc-rate-btn");
  const resultEl = document.getElementById("rate-result");

  if (!amountEl || !hoursEl || !minutesEl || !btn || !resultEl) return;

>>>>>>> Deployment
  function calc() {
    const amount = parseFloat(amountEl.value || "0");
    const hours = parseFloat(hoursEl.value || "0");
    const minutes = parseFloat(minutesEl.value || "0");
<<<<<<< HEAD
    const selectedPlatform = platformEl ? platformEl.value : "";

    if (amount <= 0 || (hours <= 0 && minutes <= 0)) {
      resultEl.textContent = "Enter an amount and time greater than zero.";
      resultEl.classList.add("error");
      comparisonEl.style.display = "none";
=======

    if (amount <= 0 || (hours <= 0 && minutes <= 0)) {
      resultEl.textContent = "Hourly rate: —";
      resultEl.classList.add("error");
      resultEl.textContent = "Enter an amount and time greater than zero.";
>>>>>>> Deployment
      return;
    }

    const totalHours = hours + minutes / 60;
    const hourly = amount / totalHours;

    if (!isFinite(hourly) || hourly <= 0) {
<<<<<<< HEAD
      resultEl.textContent = "Something looks off. Double-check your numbers.";
      resultEl.classList.add("error");
      comparisonEl.style.display = "none";
=======
      resultEl.textContent = "Hourly rate: —";
      resultEl.classList.add("error");
      resultEl.textContent = "Something looks off. Double-check your numbers.";
>>>>>>> Deployment
      return;
    }

    resultEl.classList.remove("error");
    resultEl.textContent = `Hourly rate: $${hourly.toFixed(2)}/hr`;
<<<<<<< HEAD

    // Show comparison
    const platformAverages = getPlatformAverages();
    const avgRate = platformAverages[selectedPlatform] || platformAverages[""];
    const diff = hourly - avgRate;
    const diffPercent = ((diff / avgRate) * 100).toFixed(1);
    const platformLabel = selectedPlatform || "general gig work";

    comparisonEl.style.display = "block";

    if (diff > 2) {
      // Significantly above average
      comparisonTextEl.textContent = `🎉 You're earning ${Math.abs(diffPercent)}% above the ${platformLabel} average!`;
      comparisonTextEl.className = "comparison-text above";
    } else if (diff < -2) {
      // Significantly below average
      comparisonTextEl.textContent = `📊 You're earning ${Math.abs(diffPercent)}% below the ${platformLabel} average.`;
      comparisonTextEl.className = "comparison-text below";
    } else {
      // Close to average
      comparisonTextEl.textContent = `✅ You're right around the ${platformLabel} average!`;
      comparisonTextEl.className = "comparison-text average";
    }

    comparisonDetailsEl.textContent = `Your rate: $${hourly.toFixed(2)}/hr vs. Average: $${avgRate.toFixed(2)}/hr (${diff >= 0 ? "+" : ""}$${diff.toFixed(2)} difference)`;
  }

  btn.addEventListener("click", calc);

  // Setup rate ticker - updates with user's actual rates
  (function setupRateTicker() {
    const tickerContentEl = document.getElementById("rate-ticker-content");
    const tickerLabelEl = document.getElementById("rate-ticker-label");
    const locationBtn = document.getElementById("location-toggle-btn");
    if (!tickerContentEl || !tickerLabelEl || !locationBtn) return;

    // Extended national averages for ticker (includes more platforms)
    const tickerNationalAverages = {
      "Uber": 20.0,
      "DoorDash": 16.0,
      "Instacart": 17.0,
      "Prolific": 8.0,
      "MTurk": 6.0,
      "Grubhub": 18.0,
      "Uber Eats": 15.0,
      "Postmates": 16.0,
      "Shipt": 17.0,
      "TaskRabbit": 19.0,
    };

    // Local metro area multipliers (example - would come from API in production)
    // These adjust national averages based on cost of living/demand in metro areas
    const tickerMetroMultipliers = {
      // High cost metros (SF, NYC, LA, etc.) - typically 10-20% higher
      "high": {
        "Uber": 1.15,
        "DoorDash": 1.12,
        "Instacart": 1.10,
        "Prolific": 1.0,
        "MTurk": 1.0,
        "Grubhub": 1.13,
        "Uber Eats": 1.12,
        "Postmates": 1.12,
        "Shipt": 1.10,
        "TaskRabbit": 1.15,
      },
      "medium": {
        "Uber": 1.08,
        "DoorDash": 1.06,
        "Instacart": 1.05,
        "Prolific": 1.0,
        "MTurk": 1.0,
        "Grubhub": 1.07,
        "Uber Eats": 1.06,
        "Postmates": 1.06,
        "Shipt": 1.05,
        "TaskRabbit": 1.08,
      },
      "low": {
        "Uber": 0.92,
        "DoorDash": 0.94,
        "Instacart": 0.95,
        "Prolific": 1.0,
        "MTurk": 1.0,
        "Grubhub": 0.93,
        "Uber Eats": 0.94,
        "Postmates": 0.94,
        "Shipt": 0.95,
        "TaskRabbit": 0.92,
      },
    };

    let useLocation = false;
    let userLocation = null;
    let metroTier = null; // "high", "medium", or "low"

    // Load location preference
    const LOCATION_STORAGE_KEY = "snorefest-location-pref";
    const LOCATION_DATA_KEY = "snorefest-location-data";
    
    function loadLocationPreference() {
      try {
        const pref = localStorage.getItem(LOCATION_STORAGE_KEY);
        useLocation = pref === "true";
        
        const locationData = localStorage.getItem(LOCATION_DATA_KEY);
        if (locationData) {
          const parsed = JSON.parse(locationData);
          userLocation = parsed;
          metroTier = parsed.metroTier || "medium";
        }
      } catch {
        useLocation = false;
      }
      updateLocationUI();
    }

    function saveLocationPreference() {
      try {
        localStorage.setItem(LOCATION_STORAGE_KEY, useLocation.toString());
        if (userLocation) {
          localStorage.setItem(LOCATION_DATA_KEY, JSON.stringify(userLocation));
        }
      } catch {
        // ignore
      }
    }

    function getTickerAverages() {
      if (!useLocation || !metroTier) {
        return tickerNationalAverages;
      }

      const multipliers = tickerMetroMultipliers[metroTier] || tickerMetroMultipliers["medium"];
      const localAverages = {};
      
      Object.keys(tickerNationalAverages).forEach((platform) => {
        const multiplier = multipliers[platform] || 1.0;
        localAverages[platform] = tickerNationalAverages[platform] * multiplier;
      });

      return localAverages;
    }

    function updateLocationUI() {
      if (useLocation && userLocation) {
        const city = userLocation.city || "your area";
        tickerLabelEl.textContent = `Industry Average Rates (${city})`;
        locationBtn.textContent = "📍 Using Location";
        locationBtn.classList.add("active");
      } else {
        tickerLabelEl.textContent = "Industry Average Rates (National)";
        locationBtn.textContent = "📍 Use Location";
        locationBtn.classList.remove("active");
      }
    }

    function requestLocation() {
      if (!navigator.geolocation) {
        alert("Location services are not available in your browser.");
        return;
      }

      locationBtn.textContent = "📍 Getting location...";
      locationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // In production, you'd call an API here to:
          // 1. Reverse geocode lat/lng to get city/metro area
          // 2. Get metro-specific rate data
          // For now, we'll simulate this
          
          // Simulate metro tier detection (in production, use real API)
          // You could use APIs like:
          // - Google Geocoding API to get city/metro
          // - Census Bureau data for metro areas
          // - Custom API with metro-specific gig worker data
          
          // For demo: determine tier based on rough lat/lng (this is simplified)
          // High cost areas: CA, NY, MA, WA, etc.
          if ((lat > 37 && lat < 38 && lng > -123 && lng < -122) || // SF Bay
              (lat > 40.5 && lat < 41 && lng > -74.5 && lng < -73.5) || // NYC
              (lat > 34 && lat < 34.5 && lng > -118.5 && lng < -118)) { // LA
            metroTier = "high";
          } else if (lat > 45 || lat < 30 || lng < -100) {
            metroTier = "low";
          } else {
            metroTier = "medium";
          }

          // Simulate city name (in production, get from reverse geocoding)
          const cities = ["San Francisco", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];
          const city = cities[Math.floor(Math.random() * cities.length)];

          userLocation = {
            lat,
            lng,
            city,
            metroTier,
            timestamp: Date.now()
          };

          useLocation = true;
          saveLocationPreference();
          updateLocationUI();
          updateTicker();
          window.dispatchEvent(new Event("locationUpdated"));
          locationBtn.disabled = false;
        },
        (error) => {
          alert("Unable to get your location. Please check your browser permissions.");
          locationBtn.textContent = "📍 Use Location";
          locationBtn.disabled = false;
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 3600000 // Cache for 1 hour
        }
      );
    }

    function toggleLocation() {
      if (useLocation) {
        useLocation = false;
        userLocation = null;
        metroTier = null;
        saveLocationPreference();
        updateLocationUI();
        updateTicker();
        window.dispatchEvent(new Event("locationUpdated"));
      } else {
        requestLocation();
      }
    }

    locationBtn.addEventListener("click", toggleLocation);
    loadLocationPreference();

    // Industry fallback averages (will be replaced by getCurrentAverages)
    let industryAverages = nationalAverages;

    function calculateUserRates() {
      const STORAGE_KEY = "snorefest-gigs-v1";
      let gigs = [];
      
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            gigs = parsed;
          }
        }
      } catch {
        // ignore parse errors
      }

      // Calculate average rate per platform
      const platformData = {};
      
      gigs.forEach((gig) => {
        const platform = gig.platform;
        if (!platform) return; // Skip gigs without a platform
        
        const earnings = gig.earnings || 0;
        const minutes = gig.minutes || 0;
        
        if (earnings > 0 && minutes > 0) {
          if (!platformData[platform]) {
            platformData[platform] = { totalEarnings: 0, totalMinutes: 0 };
          }
          platformData[platform].totalEarnings += earnings;
          platformData[platform].totalMinutes += minutes;
        }
      });

      // Build ticker items - use user's rates if available, otherwise industry average
      const tickerItems = [];
      const platforms = Object.keys(industryAverages);
      
      platforms.forEach((platform) => {
        let rate;
        if (platformData[platform] && platformData[platform].totalMinutes > 0) {
          const hours = platformData[platform].totalMinutes / 60;
          rate = platformData[platform].totalEarnings / hours;
        } else {
          rate = industryAverages[platform];
        }
        
        if (isFinite(rate) && rate > 0) {
          tickerItems.push({
            name: platform,
            rate: rate,
            isUserData: !!platformData[platform]
          });
        }
      });

      return tickerItems;
    }

    function updateTicker() {
      industryAverages = getTickerAverages(); // Update to use local/national averages
      const items = calculateUserRates();
      if (items.length === 0) {
        // Fallback to industry averages if no data
        const fallbackItems = Object.keys(industryAverages).map(name => ({
          name,
          rate: industryAverages[name],
          isUserData: false
        }));
        items.push(...fallbackItems);
      }

      const tickerHTML = items.map(
        (p) => `<span class="ticker-item ${p.isUserData ? 'user-data' : ''}">${p.name}: $${p.rate.toFixed(2)}/hr${p.isUserData ? ' (yours)' : ''}</span>`
      );
      
      // Duplicate for seamless loop
      tickerContentEl.innerHTML = tickerHTML.join(" • ") + " • " + tickerHTML.join(" • ");
    }

    // Update ticker initially
    updateTicker();

    // Update ticker when calculator page is shown
    const calculatorPage = document.getElementById("calculator-page");
    if (calculatorPage) {
      const observer = new MutationObserver(() => {
        if (calculatorPage.classList.contains("active")) {
          updateTicker();
        }
      });
      observer.observe(calculatorPage, { attributes: true, attributeFilter: ["class"] });
    }

    // Update when gigs are added/removed
    window.addEventListener("gigsUpdated", updateTicker);
    
    // Update when location changes
    window.addEventListener("locationUpdated", updateTicker);
    
    // Also update on storage changes (cross-tab)
    window.addEventListener("storage", updateTicker);
    
    // Update periodically to catch any local changes
    setInterval(updateTicker, 2000);
  })();
=======
  }

  btn.addEventListener("click", calc);
>>>>>>> Deployment
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

<<<<<<< HEAD
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
=======
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
>>>>>>> Deployment
    !earningsEl ||
    !minutesEl ||
    !listEl ||
    !countEl ||
<<<<<<< HEAD
    !totalEarnedEl ||
    !monthSummaryEl ||
    !yearSummaryEl
=======
    !totalEarnedEl
>>>>>>> Deployment
  ) {
    return;
  }

<<<<<<< HEAD
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
=======
  const STORAGE_KEY = "microtask-buddy-tasks-v1";
  let tasks = [];

  function loadTasks() {
>>>>>>> Deployment
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
<<<<<<< HEAD
        gigs = parsed;
=======
        tasks = parsed;
>>>>>>> Deployment
      }
    } catch {
      // ignore parse errors
    }
  }

<<<<<<< HEAD
  function saveGigs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gigs));
=======
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
>>>>>>> Deployment
    } catch {
      // ignore quota errors
    }
  }

  function formatCurrency(amount) {
    const v = typeof amount === "number" ? amount : parseFloat(amount || "0");
    if (!isFinite(v)) return "$0.00";
    return `$${v.toFixed(2)}`;
  }

<<<<<<< HEAD
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

  function getPlatformAverages() {
    return window.getCurrentAverages ? window.getCurrentAverages() : window.nationalAverages;
  }

  function updateOverallRateComparison() {
    const rateValueEl = document.getElementById("overall-rate-value");
    const rateBadgeEl = document.getElementById("rate-comparison-badge");
    const badgeTextEl = document.getElementById("comparison-badge-text");
    const hintEl = document.getElementById("rate-comparison-hint");

    if (!rateValueEl || !rateBadgeEl || !badgeTextEl || !hintEl) return;

    // Calculate overall rate from all gigs
    const totalMinutes = gigs.reduce((sum, g) => sum + (g.minutes || 0), 0);
    const totalEarned = gigs.reduce((sum, g) => sum + (g.earnings || 0), 0);

    if (totalMinutes === 0 || totalEarned === 0 || gigs.length === 0) {
      rateValueEl.textContent = "—";
      rateBadgeEl.style.display = "none";
      hintEl.textContent = "Add gigs to see how your rate compares";
      return;
    }

    const totalHours = totalMinutes / 60;
    const overallRate = totalEarned / totalHours;

    if (!isFinite(overallRate) || overallRate <= 0) {
      rateValueEl.textContent = "—";
      rateBadgeEl.style.display = "none";
      hintEl.textContent = "Add gigs to see how your rate compares";
      return;
    }

    // Calculate weighted average of platform averages based on gigs
    const platformTotals = {};
    gigs.forEach((gig) => {
      const platform = gig.platform;
      if (!platform) return; // Skip gigs without a platform
      
      if (!platformTotals[platform]) {
        platformTotals[platform] = { minutes: 0, count: 0 };
      }
      platformTotals[platform].minutes += gig.minutes || 0;
      platformTotals[platform].count += 1;
    });

    // Weighted average of industry rates
    const platformAverages = getPlatformAverages();
    let weightedAvg = 0;
    let totalWeight = 0;
    Object.keys(platformTotals).forEach((platform) => {
      const avg = platformAverages[platform] || platformAverages[""];
      const weight = platformTotals[platform].minutes;
      weightedAvg += avg * weight;
      totalWeight += weight;
    });

    const industryAvg = totalWeight > 0 ? weightedAvg / totalWeight : platformAverages[""];

    // Display overall rate
    rateValueEl.textContent = `$${overallRate.toFixed(2)}/hr`;

    // Calculate comparison
    const diff = overallRate - industryAvg;
    const diffPercent = ((diff / industryAvg) * 100).toFixed(1);

    rateBadgeEl.style.display = "block";
    hintEl.textContent = `Industry average: $${industryAvg.toFixed(2)}/hr`;

    if (diff > 2) {
      badgeTextEl.textContent = `🎉 ${Math.abs(diffPercent)}% above average`;
      rateBadgeEl.className = "rate-comparison-badge above";
    } else if (diff < -2) {
      badgeTextEl.textContent = `📊 ${Math.abs(diffPercent)}% below average`;
      rateBadgeEl.className = "rate-comparison-badge below";
    } else {
      badgeTextEl.textContent = `✅ Around average`;
      rateBadgeEl.className = "rate-comparison-badge average";
    }
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

    // Update overall rate comparison
    updateOverallRateComparison();
  }

  function updateTotals() {
    const count = gigs.length;
    const total = gigs.reduce((sum, g) => sum + (g.earnings || 0), 0);
    countEl.textContent = `${count} gig${count === 1 ? "" : "s"}`;
=======
  function updateSummary() {
    const count = tasks.length;
    const total = tasks.reduce((sum, t) => sum + (t.earnings || 0), 0);
    countEl.textContent = `${count} task${count === 1 ? "" : "s"}`;
>>>>>>> Deployment
    totalEarnedEl.textContent = formatCurrency(total);
  }

  function render() {
    listEl.innerHTML = "";
<<<<<<< HEAD
    gigs.forEach((gig) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = gig.id;
=======
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = task.id;
>>>>>>> Deployment

      const main = document.createElement("div");
      main.className = "task-main";

      const nameSpan = document.createElement("div");
      nameSpan.className = "task-name";
<<<<<<< HEAD
      const platform = gig.platform || "(no platform)";
      const dateLabel = gig.date || "";
      nameSpan.textContent = dateLabel
        ? `${platform} · ${dateLabel}`
        : platform;
=======
      nameSpan.textContent = task.name || "(untitled task)";
>>>>>>> Deployment

      const meta = document.createElement("div");
      meta.className = "task-meta";

      const earnSpan = document.createElement("span");
      earnSpan.className = "task-earnings";
<<<<<<< HEAD
      earnSpan.textContent = formatCurrency(gig.earnings || 0);

      const minsSpan = document.createElement("span");
      minsSpan.textContent = `${gig.minutes || 0} min`;

      const rateSpan = document.createElement("span");
      if (gig.minutes && gig.earnings) {
        const hrs = gig.minutes / 60;
        const rate = gig.earnings / hrs;
=======
      earnSpan.textContent = formatCurrency(task.earnings || 0);

      const minsSpan = document.createElement("span");
      minsSpan.textContent = `${task.minutes || 0} min`;

      const rateSpan = document.createElement("span");
      if (task.minutes && task.earnings) {
        const hrs = task.minutes / 60;
        const rate = task.earnings / hrs;
>>>>>>> Deployment
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
<<<<<<< HEAD
      removeBtn.setAttribute("aria-label", "Remove gig");
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        gigs = gigs.filter((g) => g.id !== gig.id);
        saveGigs();
        render();
        updateTotals();
        updateSummaries();
        updateOverallRateComparison();
        
        // Trigger ticker update
        window.dispatchEvent(new Event("gigsUpdated"));
=======
      removeBtn.setAttribute("aria-label", "Remove task");
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        render();
        updateSummary();
>>>>>>> Deployment
      });

      li.appendChild(main);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });

<<<<<<< HEAD
    updateTotals();
    updateSummaries();
=======
    updateSummary();
>>>>>>> Deployment
  }

  function handleSubmit(event) {
    event.preventDefault();
<<<<<<< HEAD
    const platform = platformEl.value.trim();
    const date = dateEl.value || todayISO();
    const earnings = parseFloat(earningsEl.value || "0");
    const minutes = parseInt(minutesEl.value || "0", 10);

    if (!platform && earnings <= 0 && minutes <= 0) {
      return;
    }

    const gig = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      platform: platform || "",
      date,
=======
    const name = nameEl.value.trim();
    const earnings = parseFloat(earningsEl.value || "0");
    const minutes = parseInt(minutesEl.value || "0", 10);

    if (!name && earnings <= 0 && minutes <= 0) {
      return;
    }

    const task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: name || "",
>>>>>>> Deployment
      earnings: isFinite(earnings) && earnings > 0 ? earnings : 0,
      minutes: isFinite(minutes) && minutes > 0 ? minutes : 0,
    };

<<<<<<< HEAD
    gigs.unshift(gig);
    saveGigs();
    render();
    updateOverallRateComparison();
    
    // Trigger ticker update
    window.dispatchEvent(new Event("gigsUpdated"));

    form.reset();
    dateEl.value = todayISO();
    platformEl.focus();
  }

  function exportToCSV() {
    if (gigs.length === 0) {
      alert("No gigs to export.");
      return;
    }

    // CSV header
    const headers = ["Platform", "Date", "Earnings ($)", "Minutes", "Hours", "Hourly Rate ($/hr)"];
    const rows = [headers.join(",")];

    // CSV rows
    gigs.forEach((gig) => {
      const platform = `"${(gig.platform || "").replace(/"/g, '""')}"`;
      const date = gig.date || "";
      const earnings = (gig.earnings || 0).toFixed(2);
      const minutes = gig.minutes || 0;
      const hours = (minutes / 60).toFixed(2);
      const rate =
        minutes > 0 && gig.earnings > 0
          ? ((gig.earnings / (minutes / 60)) || 0).toFixed(2)
          : "0.00";

      rows.push([platform, date, earnings, minutes, hours, rate].join(","));
    });

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snorefest-gigs-${todayISO()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportToJSON() {
    if (gigs.length === 0) {
      alert("No gigs to export.");
      return;
    }

    const jsonContent = JSON.stringify(gigs, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snorefest-gigs-${todayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const exportCsvBtn = document.getElementById("export-csv-btn");
  const exportJsonBtn = document.getElementById("export-json-btn");

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", exportToCSV);
  }
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", exportToJSON);
  }

  loadGigs();
  render();
  dateEl.value = todayISO();
  updateOverallRateComparison();
  form.addEventListener("submit", handleSubmit);
})();

// Tab navigation
(function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPages = document.querySelectorAll(".tab-page");

  if (tabButtons.length === 0 || tabPages.length === 0) return;

  function switchTab(targetTab) {
    // Update buttons
    tabButtons.forEach((btn) => {
      if (btn.dataset.tab === targetTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update pages
    tabPages.forEach((page) => {
      if (page.id === `${targetTab}-page`) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });
})();

=======
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

>>>>>>> Deployment

