(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 900;
  const COUNT_SELECTOR =
    "#temperature, #feels-like, #humidity, #wind-speed, #chance-of-rain, .optiontemperature";
  const NUMBER = /-?\d+(?:\.\d+)?/;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const state = new WeakMap();

  /* ---- 1. Count up/down to new values -------------------------------- */
  const counter = new MutationObserver((records) => {
    const changed = new Set();
    records.forEach((r) => {
      const node = r.target.nodeType === Node.TEXT_NODE ? r.target.parentElement : r.target;
      const el = node && node.closest(COUNT_SELECTOR);
      if (el) changed.add(el);
    });
    changed.forEach(countTo);
  });

  function countTo(el) {
    const finalText = el.textContent;
    const match = finalText.match(NUMBER);
    const st = state.get(el) || {};
    state.set(el, st);
    cancelAnimationFrame(st.raf);
    if (!match) return; // placeholders like "--"

    const to = parseFloat(match[0]);
    const from = st.shown ?? 0;
    if (reduceMotion || from === to) { st.shown = to; return; }

    const decimals = (match[0].split(".")[1] || "").length;
    const prefix = finalText.slice(0, match.index);
    const suffix = finalText.slice(match.index + match[0].length);
    const t0 = performance.now();

    const frame = (now) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const value = from + (to - from) * easeOut(p);
      el.textContent = p < 1 ? prefix + value.toFixed(decimals) + suffix : finalText;
      st.shown = p < 1 ? value : to;
      counter.takeRecords(); // ignore our own writes
      if (p < 1) st.raf = requestAnimationFrame(frame);
    };
    frame(t0);
  }

  document.querySelectorAll(COUNT_SELECTOR).forEach((el) =>
    counter.observe(el, { childList: true, characterData: true, subtree: true })
  );

  /* ---- 2. Replay the swap-in animation when the city changes --------- */
  const replay = (nodes) =>
    nodes.forEach((n) => {
      n.classList.remove("is-fresh");
      void n.offsetWidth; // restart the CSS animation
      n.classList.add("is-fresh");
    });

  const cityName = document.getElementById("city-name");
  if (cityName) {
    new MutationObserver(() =>
      replay(document.querySelectorAll("#place, .weather-info, .information .info"))
    ).observe(cityName, { childList: true, characterData: true, subtree: true });
  }

  /* ---- 3. Set the sky theme from the weather text --------------------- */
  const THEMES = {
    thunder: "thunderstorm", drizzle: "drizzle", rain: "rain", snow: "snow",
    clear: "clear", cloud: "clouds", mist: "mist", haze: "haze", fog: "fog", smoke: "smoke",
  };
  const type = document.getElementById("weather-type");
  if (type) {
    const applyTheme = () => {
      const label = type.textContent.trim().toLowerCase();
      const key = Object.keys(THEMES).find((k) => label.includes(k));
      if (key) document.body.dataset.weather = THEMES[key];
      else delete document.body.dataset.weather;
    };
    new MutationObserver(applyTheme).observe(type, { childList: true, characterData: true, subtree: true });
    applyTheme();
  }
})();