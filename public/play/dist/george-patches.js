/* george-patches: hold-to-move + walk + jump that keeps dokson Y units.
   NEVER parseFloat() a "%" bottom — that turned 20% into 20px (player underground). */
(function () {
  "use strict";

  var heldLeft = false;
  var heldRight = false;
  var rafId = 0;
  var lastTs = 0;
  var PX_PER_SEC = 520;
  var jumping = false;
  var boarding = false;
  var JUMP_PX = 168;
  var JUMP_UP_MS = 280;
  var JUMP_DOWN_MS = 260;
  var _setAleStaticFrame = typeof setAleStaticFrame === "function" ? setAleStaticFrame : null;

  function isHeld() {
    return heldLeft || heldRight;
  }

  function canMove() {
    return !boarding && !climbing && (typeof scrollState === "undefined" || scrollState.canScrollOrSwipe !== false);
  }

  function kickWalk() {
    if (typeof ale === "undefined") return;
    if (jumping || climbing || boarding || ale.isJumping || ale.isFalling) return;
    if (scrollState.layersMovement !== "horizontal") return;
    if (typeof animateAleRunSwim === "function") animateAleRunSwim();
  }

  function isTypingTarget(el) {
    if (!el || !el.tagName) return false;
    var tag = el.tagName.toUpperCase();
    return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
  }

  function groundBottomPx() {
    var h = containerDiv && containerDiv.offsetHeight ? containerDiv.offsetHeight : 0;
    return 0.2 * h;
  }

  function currentLandBottomPx() {
    if (typeof ale !== "undefined" && ale.elevationBelow != null && ale.elevations) {
      var elev = ale.elevations[ale.elevationBelow];
      if (elev && containerDiv) {
        return containerDiv.offsetHeight - elev.offsetTop;
      }
    }
    return groundBottomPx();
  }

  function snapAleToEngine() {
    if (!aleContainerDiv || typeof ale === "undefined") return;
    if (ale.isSwimming) {
      if (typeof positionAleAtSeaFloorLevel === "function") positionAleAtSeaFloorLevel();
      return;
    }
    if (typeof positionAleContainerVertically === "function") {
      positionAleContainerVertically();
      return;
    }
    if (typeof positionAleAtGroundLevel === "function") {
      positionAleAtGroundLevel();
      return;
    }
    aleContainerDiv.style.bottom = groundBottomPx() + "px";
  }

  function playerJump() {
    if (jumping || typeof ale === "undefined" || !aleContainerDiv) return;
    if (!canMove()) return;
    if (scrollState.layersMovement !== "horizontal") return;
    if (ale.isSwimming) {
      if (typeof aleSwimUp === "function") aleSwimUp();
      return;
    }
    jumping = true;
    ale.isJumping = true;
    ale.isFalling = false;
    if (typeof setAleJumpUpFrame === "function") setAleJumpUpFrame();
    var start = currentLandBottomPx();
    var peak = start + JUMP_PX;
    aleContainerDiv.style.bottom = start + "px";
    var $el = $(aleContainerDiv);
    $el.stop(true, false).animate({ bottom: peak }, JUMP_UP_MS, "easeOutCubic", function () {
      if (typeof setAleJumpDownAndFallFrame === "function") setAleJumpDownAndFallFrame();
      $el.animate({ bottom: start }, JUMP_DOWN_MS, "easeInCubic", function () {
        jumping = false;
        ale.isJumping = false;
        ale.isFalling = false;
        snapAleToEngine();
        if (isHeld() && typeof animateAleRunSwim === "function") animateAleRunSwim();
        else if (typeof setAleStaticFrame === "function") setAleStaticFrame();
      });
    });
  }

  window.setAleStaticFrame = function () {
    if (jumping || climbing || (isHeld() && scrollState.layersMovement === "horizontal")) return;
    if (_setAleStaticFrame) _setAleStaticFrame();
  };

  var speed = 0; // px/s, eased towards PX_PER_SEC while held, glides out on release
  var lastDir = 1;
  function moveLoop(ts) {
    if (!isHeld() && speed < 8) {
      rafId = 0;
      lastTs = 0;
      speed = 0;
      if (typeof enableAnimateAleRunSwim === "function") enableAnimateAleRunSwim();
      return;
    }
    rafId = requestAnimationFrame(moveLoop);
    if (!lastTs) {
      lastTs = ts;
      kickWalk();
      return;
    }
    var dt = Math.min(0.048, (ts - lastTs) / 1000);
    lastTs = ts;
    if (!canMove()) return;
    if (isHeld()) lastDir = (heldRight ? 1 : 0) - (heldLeft ? 1 : 0);
    var target = isHeld() && lastDir ? PX_PER_SEC : 0;
    speed += (target - speed) * Math.min(1, dt * 9);
    if (!lastDir) return;
    window.scrollBy(0, lastDir * speed * dt);
  }

  function startLoop() {
    if (!rafId) {
      lastTs = 0;
      rafId = requestAnimationFrame(moveLoop);
    }
  }

  function setHeld(left, right, down) {
    if (left) heldLeft = down;
    if (right) heldRight = down;
    if (isHeld()) startLoop();
  }

  document.addEventListener(
    "keydown",
    function (e) {
      if (isTypingTarget(e.target)) return;
      var k = e.key;
      var isSpace = k === " " || k === "Spacebar" || e.code === "Space";
      if (k === "ArrowUp" || isSpace) {
        e.preventDefault();
        if (!e.repeat) playerJump();
        return;
      }
      if (k === "ArrowDown") {
        e.preventDefault();
        return;
      }
      if (k !== "ArrowLeft" && k !== "ArrowRight") return;
      e.preventDefault();
      if (e.repeat) return;
      if (k === "ArrowRight") setHeld(false, true, true);
      else if (k === "ArrowLeft") setHeld(true, false, true);
    },
    { passive: false }
  );

  document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight") heldRight = false;
    if (e.key === "ArrowLeft") heldLeft = false;
  });

  function bindHoldSurface(el) {
    if (!el) return;
    el.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 && e.button !== 2) return;
      var rect = el.getBoundingClientRect();
      var right = e.clientX >= rect.left + rect.width * 0.5;
      setHeld(!right, right, true);
    });
    el.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }
  window.addEventListener("pointerup", function () {
    heldLeft = false;
    heldRight = false;
  });
  window.addEventListener("blur", function () {
    heldLeft = false;
    heldRight = false;
  });
  bindHoldSurface(document.getElementById("container") || document.body);

  // Let the engine finish its entrance animation: snapping here cancelled its
  // completion callback and left ale.canRunSwim disabled for the first level.
  /* Seat coordinates follow the engine layout, without a trailing transition. */
  var rocketDiv = document.getElementById("rocket");
  if (rocketDiv && !document.getElementById("rocket-flame")) {
    var flame = document.createElement("div");
    flame.id = "rocket-flame";
    rocketDiv.appendChild(flame);
  }
  function syncRocketSeat(previousHead) {
    if (!rocketDiv || !aleContainerDiv || !containerDiv || typeof scrollState === "undefined") return;
    var mv = String(scrollState.layersMovement || "");
    var st = containerDiv.getBoundingClientRect(), rk = rocketDiv.getBoundingClientRect();
    var seated = mv === "vertical" || mv === "not moving 1" || mv === "not moving 2";
    var entering = seated && !aleContainerDiv.classList.contains("in-rocket");
    aleContainerDiv.classList.toggle("in-rocket", seated);
    rocketDiv.classList.toggle("flying", mv === "vertical");
    if (!seated) return;
    aleContainerDiv.style.setProperty("--seat-left", (rk.left - st.left) + "px");
    aleContainerDiv.style.setProperty("--seat-top", (rk.top - st.top) + "px");
    if (entering) {
      boarding = true;
      speed = 0;
      disableScrollOrSwipe();
      clearShiftAleFrameTimer();
      _setAleStaticFrame();
      aleContainerDiv.style.setProperty("--boarding-x", (previousHead.left + 102 - rk.left - 166) + "px");
      aleContainerDiv.style.setProperty("--boarding-y", (previousHead.top + 76 - rk.top - 201) + "px");
      aleContainerDiv.classList.add("boarding");
      setTimeout(function () {
        aleContainerDiv.classList.remove("boarding");
        boarding = false;
        enableScrollOrSwipe();
      }, 450);
    }
  }
  var _positionRocketAndAle = window.positionRocketAndAleContainerHorizontally;
  window.positionRocketAndAleContainerHorizontally = function () {
    var previousHead = aleDiv.getBoundingClientRect();
    _positionRocketAndAle();
    syncRocketSeat(previousHead);
  };
  function shiftSeaCamera(top, duration) {
    clearShiftUpDownLayerHorizontalTimer();
    for (var layer of layerHorizontalArray) {
      $(layer).stop(true, false).animate({ top: top }, {
        duration: duration,
        easing: "swing",
        step: function (now) {
          if (this !== layerHorizontalArray[layerHorizontalArray.length - 1]) return;
          ale.isBelowSeaLevel = aleContainerDiv.offsetTop > sea1Div.offsetTop + now;
          for (var vertical of layerVerticalArray) vertical.style.bottom = -now + "px";
        }
      });
    }
  }
  window.shiftUpLayerHorizontal = function () {
    setShiftUpLayerHorizontalDistance();
    disableIsAleJumpingAndFalling();
    shiftSeaCamera(-shiftUpLayerHorizontalDistance, 650);
  };
  /* Sea exit: climb the ladder instead of popping up to the floor. */
  var climbing = false;
  var _shiftAleToGroundLevel = typeof shiftAleToGroundLevel === "function" ? shiftAleToGroundLevel : null;
  if (_shiftAleToGroundLevel) {
    window.shiftAleToGroundLevel = function () {
      var goingRight = typeof scrollState !== "undefined" && scrollState.delta > 0;
      var hasLadder = !!document.querySelector(".ladder");
      if (!goingRight || !hasLadder || climbing || typeof groundAndGrassContainer1Div === "undefined") return _shiftAleToGroundLevel();
      climbing = true;
      speed = 0; // keep the held key: movement resumes by itself after the climb
      if (typeof disableScrollOrSwipe === "function") disableScrollOrSwipe();
      if (typeof timers !== "undefined") clearInterval(timers.shiftAleFrame);
      hideAleEyesClose();
      // Match the camera's rise to the climb instead of finishing it in 450ms.
      shiftSeaCamera(0, 1400);
      var frames = [typeof ale !== "undefined" ? ale.startJumpFrame : 6, typeof ale !== "undefined" ? ale.stopJumpFrame : 7];
      var k = 0;
      aleFramesDiv.style.left = -frames[k++ % 2] * 200 + "px";
      var tick = setInterval(function () {
        if (typeof aleFramesDiv !== "undefined") aleFramesDiv.style.left = -frames[k++ % 2] * 200 + "px";
      }, 170);
      var target = containerDiv.offsetHeight - groundAndGrassContainer1Div.offsetTop;
      $(aleContainerDiv).stop(true, false).animate({ bottom: target + "px" }, 1400, "swing", function () {
        clearInterval(tick);
        climbing = false;
        ale.isBelowSeaLevel = false;
        positionLayerHorizontalToBottom();
        if (typeof enableScrollOrSwipe === "function") enableScrollOrSwipe();
        enableAnimateAleRunSwim();
        if (isHeld()) animateAleRunSwim();
        else if (_setAleStaticFrame) _setAleStaticFrame();
      });
    };
  }
  if (typeof ale !== "undefined") ale.frameTimeInterval = 120; // 200 read as sliding at 520px/s
})();

/* CLS (plan 013): the engine slides the preloader away by animating its `bottom`, which moves layout on every frame
   (CLS 1.05 on mobile). Same slide, same 1 s and the same end state, but with a transform, which doesn't shift layout.
   state.min.js calls shiftUpPreloader() after load, by which time this file has replaced it. */
window.shiftUpPreloader = function () {
  turnOffPreloaderDotsAnimation();
  preloaderDiv.style.transition = 'transform 1s ease-in-out';
  preloaderDiv.style.transform = 'translateY(-100%)';
  setTimeout(function () {
    hidePreloader();
    preloaderDiv.style.transition = preloaderDiv.style.transform = '';
  }, 1000);
};

