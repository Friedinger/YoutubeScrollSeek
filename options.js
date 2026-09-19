document.addEventListener("DOMContentLoaded", () => {
  const scrollThreshold = document.getElementById("scrollThreshold");
  const keys = ["shiftKey", "ctrlKey", "altKey", "metaKey"];

  chrome.storage.local.get(
    {
      scrollThreshold: 25,
      preventKeys: keys,
      disableOnTrackpad: false,
    },
    (data) => {
      scrollThreshold.value = data.scrollThreshold;
      keys.forEach((key) => {
        document.getElementById(key).checked = data.preventKeys.includes(key);
      });
      document.getElementById("disableOnTrackpad").checked =
        data.disableOnTrackpad;
    },
  );

  const save = () => {
    const selectedKeys = keys.filter((k) => document.getElementById(k).checked);
    chrome.storage.local.set({
      scrollThreshold: parseInt(scrollThreshold.value, 10),
      preventKeys: selectedKeys,
      disableOnTrackpad: document.getElementById("disableOnTrackpad").checked,
    });
  };

  scrollThreshold.addEventListener("change", save);
  keys.forEach((key) => document.getElementById(key).addEventListener("change", save));
  document.getElementById("disableOnTrackpad").addEventListener("change", save);
});
