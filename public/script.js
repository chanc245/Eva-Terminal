// ----- Hover overlay pinned to terminal ----- //
(function () {
  const hoverTrigger = document.querySelector(".hover-element");
  const hoverBox = document.querySelector(".hover-flex-container");
  const terminal = document.querySelector("#commandDiv");

  if (!hoverTrigger || !hoverBox || !terminal) return;

  let hideTimer = null;
  let isVisible = false;

  function positionOverlay() {
    const rect = terminal.getBoundingClientRect();
    hoverBox.style.top = `${rect.top + window.scrollY}px`;
    hoverBox.style.left = `${rect.left + window.scrollX}px`;
    hoverBox.style.width = `${rect.width}px`;
    hoverBox.style.height = `${rect.height}px`;
  }

  function showOverlay() {
    clearTimeout(hideTimer);
    positionOverlay();
    hoverBox.style.display = "flex";
    isVisible = true;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hoverBox.style.display = "none";
      isVisible = false;
    }, 180);
  }

  hoverTrigger.addEventListener("mouseenter", showOverlay);

  hoverTrigger.addEventListener("mouseleave", scheduleHide);

  hoverBox.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  hoverBox.addEventListener("mouseleave", scheduleHide);

  ["scroll", "resize"].forEach((evt) =>
    window.addEventListener(evt, () => {
      if (isVisible) positionOverlay();
    })
  );

  document.addEventListener("click", (e) => {
    if (!isVisible) return;
    if (!hoverBox.contains(e.target) && !hoverTrigger.contains(e.target)) {
      hoverBox.style.display = "none";
      isVisible = false;
    }
  });
})();
