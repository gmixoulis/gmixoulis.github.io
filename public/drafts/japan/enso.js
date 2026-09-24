/**
 * Enso — real sumi Zen circle asset (not a UI ring).
 * Primary: baked brush PNG. Variants via CSS filters / mask.
 * Ref: https://www.lionsroar.com/what-is-an-enso/
 *
 *   <div data-enso data-enso-variant="day" data-enso-size="420"></div>
 */
(function (global) {
  "use strict";

  var VARIANTS = {
    day: { mode: "img", opacity: 0.92 },
    wash: { mode: "img", opacity: 0.22 },
    noir: { mode: "img", filter: "invert(1) brightness(0.95)", opacity: 0.88 },
    vermilion: { mode: "mask", color: "#C43C2C", opacity: 0.95 },
    tick: { mode: "mask", color: "#C43C2C", opacity: 1 },
  };

  function resolveAsset(name) {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || "";
      if (src.indexOf("enso.js") !== -1) {
        return src.replace(/enso\.js(\?.*)?$/, name);
      }
    }
    return "./" + name;
  }

  function render(container, opts) {
    if (!container) return null;
    var options = opts || {};
    var variant =
      options.variant || container.getAttribute("data-enso-variant") || "day";
    var size = Number(
      options.size || container.getAttribute("data-enso-size") || 360,
    );
    var label =
      options.label || container.getAttribute("data-enso-label") || "Enso";
    var showInscription =
      options.inscribe === true ||
      container.getAttribute("data-enso-inscribe") === "true";
    var palette = VARIANTS[variant] || VARIANTS.day;
    var src = resolveAsset("enso-sumi.png");

    container.innerHTML = "";
    // Do NOT set position — parent CSS may use absolute for atmosphere placement.
    container.style.maxWidth = "100%";
    if (!container.style.width && !container.classList.contains("enso-wrap")) {
      container.style.width = size + "px";
    }

    var shell = document.createElement("div");
    shell.className = "enso-shell";
    shell.style.position = "relative";
    shell.style.width = "100%";

    if (palette.mode === "mask") {
      var mask = document.createElement("div");
      mask.className = "enso-mask";
      mask.setAttribute("role", "img");
      mask.setAttribute("aria-label", label);
      mask.style.width = "100%";
      mask.style.aspectRatio = "1";
      mask.style.background = palette.color;
      mask.style.opacity = String(palette.opacity);
      mask.style.webkitMask =
        "url('" + src + "') center / contain no-repeat";
      mask.style.mask = "url('" + src + "') center / contain no-repeat";
      shell.appendChild(mask);
    } else {
      var img = document.createElement("img");
      img.className = "enso-img";
      img.src = src + "?v=transparent";
      img.alt = label;
      img.width = size;
      img.height = size;
      img.decoding = "async";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.opacity = String(palette.opacity);
      img.style.background = "transparent";
      if (palette.filter) {
        img.style.filter = palette.filter;
        img.style.mixBlendMode = "screen";
      } else {
        img.style.mixBlendMode = "normal";
      }
      shell.appendChild(img);
    }

    if (showInscription) {
      var cap = document.createElement("p");
      cap.className = "enso-inscription";
      cap.textContent = "What is this?";
      cap.style.cssText =
        "position:absolute;inset:0;display:grid;place-items:center;margin:0;" +
        "font-family:Zen Kurenaido,Shippori Mincho,serif;font-size:clamp(0.75rem,2.2vw,1rem);" +
        "opacity:0.4;pointer-events:none;color:inherit;";
      if (variant === "noir") cap.style.color = "#EDE8DF";
      else if (variant === "vermilion" || variant === "tick")
        cap.style.color = "#C43C2C";
      else cap.style.color = "#0A0A0A";
      shell.appendChild(cap);
    }

    container.appendChild(shell);

    return container;
  }

  function mountAll(root) {
    (root || document).querySelectorAll("[data-enso]").forEach(function (el) {
      render(el);
    });
  }

  global.Enso = { render: render, mountAll: mountAll };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountAll();
    });
  } else {
    mountAll();
  }
})(typeof window !== "undefined" ? window : globalThis);
