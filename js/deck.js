(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.querySelector(".progress");
  const counter = document.querySelector("[data-counter]");
  let i = 0;

  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    if (progress) progress.style.width = ((i + 1) / slides.length) * 100 + "%";
    if (counter) counter.textContent = i + 1 + " / " + slides.length;
    history.replaceState(null, "", "#s" + (i + 1));
  }

  document.querySelector("[data-prev]")?.addEventListener("click", () => show(i - 1));
  document.querySelector("[data-next]")?.addEventListener("click", () => show(i + 1));
  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) { e.preventDefault(); show(i + 1); }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); show(i - 1); }
    if (e.key === "Home") show(0);
    if (e.key === "End") show(slides.length - 1);
  });

  let startX = 0;
  let startY = 0;
  let tracking = false;

  function onStart(x, y) {
    startX = x;
    startY = y;
    tracking = true;
  }

  function onEnd(x, y) {
    if (!tracking) return;
    tracking = false;
    const dx = x - startX;
    const dy = y - startY;
    if (Math.abs(dx) < 40) return;
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) show(i + 1);
    else show(i - 1);
  }

  document.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    onEnd(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.target.closest("a, button")) return;
    onStart(e.clientX, e.clientY);
  });

  document.addEventListener("pointerup", (e) => {
    if (e.target.closest("a, button")) return;
    onEnd(e.clientX, e.clientY);
  });

  const hash = parseInt((location.hash.match(/s(\d+)/) || [])[1], 10);
  show(hash ? hash - 1 : 0);
})();
