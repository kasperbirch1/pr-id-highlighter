function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash) + i * 13;
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 100%, 70%, 0.2)`;
}

(function () {
  function highlightPRs() {
    const prTitles = document.querySelectorAll(
      ".js-issue-row .Link--primary.markdown-title"
    );
    const idMap = {};

    prTitles.forEach((title) => {
      const match = title.textContent.match(/([A-Z]+-\d+)/);
      if (match) {
        const id = match[1];
        if (!idMap[id]) {
          idMap[id] = [];
        }
        idMap[id].push(title.closest(".js-issue-row"));
      }
    });

    // Generate deterministic, highly distinct HSL colors based on PR ID string
    function idToHSL(id) {
      // improved hash to spread similar IDs more distinctly
      let hash = 5381;
      for (let i = 0; i < id.length; i++) {
        // classic djb2 variant, weighted by position
        hash = (hash << 5) + hash + id.charCodeAt(i) * (i + 1);
      }
      hash = Math.abs(hash);
      // amplify differences by multiplying before modulo
      const hue = (hash * 7) % 360;
      const saturation = 60 + (hash % 40); // between 60% and 99%
      const lightness = 40 + ((hash >> 5) % 30); // between 40% and 69%
      return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;
    }

    const ids = Object.keys(idMap);
    ids.forEach((id) => {
      const color = idToHSL(id);
      idMap[id].forEach((row) => {
        row.style.backgroundColor = color;
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", highlightPRs);
  } else {
    highlightPRs();
  }
})();
