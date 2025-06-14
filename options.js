document.addEventListener("DOMContentLoaded", () => {
	const scrollThreshold = document.getElementById("scrollThreshold");
	const seekTime = document.getElementById("seekTime");
	const keys = ["shiftKey", "ctrlKey", "altKey", "metaKey"];

	chrome.storage.local.get(
		{
			scrollThreshold: 25,
			seekTime: 5,
			preventKeys: keys,
		},
		(data) => {
			scrollThreshold.value = data.scrollThreshold;
			seekTime.value = data.seekTime;
			keys.forEach((key) => {
				document.getElementById(key).checked =
					data.preventKeys.includes(key);
			});
		}
	);

	document.getElementById("save").addEventListener("click", () => {
		const selectedKeys = keys.filter(
			(k) => document.getElementById(k).checked
		);
		const options = {
			scrollThreshold: parseInt(scrollThreshold.value, 10),
			seekTime: parseInt(seekTime.value, 10),
			preventKeys: selectedKeys,
		};
		chrome.storage.local.set(options, () => {
			document.getElementById("status").textContent =
				"Saved! Reload page to apply.";
			setTimeout(
				() => (document.getElementById("status").textContent = ""),
				1500
			);
		});
	});
});
