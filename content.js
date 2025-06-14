(function () {
	const getOptions = () =>
		new Promise((resolve) => {
			chrome.storage.sync.get(
				{
					scrollThreshold: 25,
					seekTime: 5,
					preventKeys: ["shiftKey", "ctrlKey", "altKey", "metaKey"],
				},
				resolve
			);
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
