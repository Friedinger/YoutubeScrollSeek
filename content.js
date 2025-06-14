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
				};
				if (!result.scrollThreshold && !result.preventKeys) {
					chrome.storage.local.set(options);
				}
				resolve(options);
			});
		});

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

	const handleWheel = (options) => (event) => {
		const video = document.querySelector("video");
		if (!video) return;
		if (shouldPrevent(event, options.preventKeys)) return;
		if (Math.abs(event.deltaX) < options.scrollThreshold) return;
		event.preventDefault();
		if (event.deltaX < 0) {
			simulateArrowKey("left");
		} else {
			simulateArrowKey("right");
		}
	};

	getOptions().then((options) => {
		window.addEventListener("wheel", handleWheel(options), {
			passive: false,
		});
	});
})();
