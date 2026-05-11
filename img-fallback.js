// Replace any broken <img> with a brand-matched striped placeholder labeled with alt text.
(function () {
  function placeholder(alt) {
    var label = (alt || "image").toString().replace(/[<>&]/g, "").toUpperCase();
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">' +
        '<defs>' +
          '<pattern id="p" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
            '<line x1="0" y1="0" x2="0" y2="16" stroke="#0E2A20" stroke-width="0.6" opacity="0.18"/>' +
          '</pattern>' +
        '</defs>' +
        '<rect width="400" height="500" fill="#E8E1D2"/>' +
        '<rect width="400" height="500" fill="url(#p)"/>' +
        '<text x="20" y="32" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="1.4" fill="#0E2A20" opacity="0.55">[ IMAGE ]</text>' +
        '<text x="20" y="478" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="1.2" fill="#0E2A20" opacity="0.7">' + label + '</text>' +
      '</svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  window.__imgPlaceholder = placeholder;
  // Pre-empt the placeholder:// scheme so we never trigger a network error.
  function sweep(root) {
    (root || document).querySelectorAll('img[src^="placeholder:"]').forEach(function (t) {
      t.dataset.fallback = "1";
      t.src = placeholder(t.alt);
    });
  }
  document.addEventListener("DOMContentLoaded", function () { sweep(); });
  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1) {
          if (n.tagName === "IMG" && /^placeholder:/i.test(n.getAttribute("src") || "")) {
            n.dataset.fallback = "1";
            n.src = placeholder(n.alt);
          } else if (n.querySelectorAll) {
            sweep(n);
          }
        }
      });
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && !t.dataset.fallback) {
      t.dataset.fallback = "1";
      t.src = placeholder(t.alt);
    }
  }, true);

  // Status-strip marquee: start first span centered, then loop seamlessly.
  function initMarquee() {
    document.querySelectorAll(".status-strip-inner").forEach(function (inner) {
      var track = inner.querySelector(".status-strip-track");
      if (!track) return;
      var span = track.querySelector("span");
      if (!span) return;
      var cw = inner.offsetWidth;
      var sw = span.offsetWidth;
      var gap = 64;
      var pad = Math.max(0, (cw - sw) / 2);
      track.style.paddingLeft = pad + "px";
      track.style.setProperty("--ss-step", (sw + gap) + "px");
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMarquee);
  } else {
    initMarquee();
  }
  window.addEventListener("resize", initMarquee);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initMarquee);
  }
})();
