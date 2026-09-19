(function () {
  const getOptions = () =>
    new Promise((resolve) => {
      chrome.storage.local.get(null, (result) => {
        const options = {
          scrollThreshold: result?.scrollThreshold ?? 25,
          preventKeys: result?.preventKeys ?? [
            "shiftKey",
            "ctrlKey",
            "altKey",
            "metaKey",
          ],
          disableOnTrackpad: result?.disableOnTrackpad ?? false,
          invertDirection: result?.invertDirection ?? false,
        };
        if (!result.scrollThreshold && !result.preventKeys) {
          chrome.storage.local.set(options);
        }
        resolve(options);
      });
    });

  let options;

  const shouldPrevent = (event, preventKeys) =>
    preventKeys.some((key) => event[key]);

  const simulateArrowKey = (direction) => {
    const key = direction === "left" ? "ArrowLeft" : "ArrowRight";
    const event = new KeyboardEvent("keydown", {
      key,
      code: key,
      keyCode: key === "ArrowLeft" ? 37 : 39,
      which: key === "ArrowLeft" ? 37 : 39,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  let lastSeekTime = 0;
  const THROTTLE_MS = 300;

  const DELTA_MODE_MULTIPLIERS = { 0: 1, 1: 40, 2: 800 };

  const handleWheel = (event) => {
    const video = document.querySelector("video");
    if (!video) return;
    if (shouldPrevent(event, options.preventKeys)) return;
    if (options.disableOnTrackpad && event.deltaMode === 0 && event.deltaX !== 0 && event.deltaY !== 0) return;
    const multiplier = DELTA_MODE_MULTIPLIERS[event.deltaMode] ?? 1;
    const normalizedDeltaX = event.deltaX * multiplier;
    if (Math.abs(normalizedDeltaX) < options.scrollThreshold) return;
    const now = Date.now();
    if (now - lastSeekTime < THROTTLE_MS) {
      event.preventDefault();
      return;
    }
    lastSeekTime = now;
    event.preventDefault();
    const goLeft = options.invertDirection ? event.deltaX > 0 : event.deltaX < 0;
    simulateArrowKey(goLeft ? "left" : "right");
  };

  getOptions().then((loaded) => {
    options = loaded;
    window.addEventListener("wheel", handleWheel, { passive: false });
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.scrollThreshold) {
      options.scrollThreshold = changes.scrollThreshold.newValue;
    }
    if (changes.preventKeys) {
      options.preventKeys = changes.preventKeys.newValue;
    }
    if (changes.disableOnTrackpad) {
      options.disableOnTrackpad = changes.disableOnTrackpad.newValue;
    }
    if (changes.invertDirection) {
      options.invertDirection = changes.invertDirection.newValue;
    }
  });
})();
