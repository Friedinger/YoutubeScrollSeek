(function () {
	const getOptions = () =>
		new Promise((resolve) => {
			chrome.storage.local.get(null, (result) => {
				const options = {
					scrollThreshold: result?.scrollThreshold ?? 25,
					seekTime: result?.seekTime ?? 5,
					preventKeys: result?.preventKeys ?? [
						"shiftKey",
						"ctrlKey",
						"altKey",
						"metaKey",
					],
				};
				if (
					!result.scrollThreshold &&
					!result.seekTime &&
					!result.preventKeys
				) {
					chrome.storage.local.set(options);
				}
				resolve(options);
			});
		});

	const shouldPrevent = (event, preventKeys) =>
		preventKeys.some((key) => event[key]);

	const handleWheel = (options) => (event) => {
		const video = document.querySelector("video");
		if (!video) return;
		if (shouldPrevent(event, options.preventKeys)) return;
		if (Math.abs(event.deltaX) < options.scrollThreshold) return;
		event.preventDefault();
		video.currentTime +=
			event.deltaX > 0 ? options.seekTime : -options.seekTime;
	};

	getOptions().then((options) => {
		window.addEventListener("wheel", handleWheel(options), {
			passive: false,
		});
	});
})();
