document.addEventListener("DOMContentLoaded", () => {
  const scrollThreshold = document.getElementById("scrollThreshold");
  const keys = ["shiftKey", "ctrlKey", "altKey", "metaKey"];

  chrome.storage.local.get(
    {
      scrollThreshold: 25,
      preventKeys: keys,
    },
    (data) => {
      scrollThreshold.value = data.scrollThreshold;
      keys.forEach((key) => {
        document.getElementById(key).checked = data.preventKeys.includes(key);
      });
    },
  );

  const save = () => {
    const selectedKeys = keys.filter((k) => document.getElementById(k).checked);
    chrome.storage.local.set({
      scrollThreshold: parseInt(scrollThreshold.value, 10),
      preventKeys: selectedKeys,
    });
  };

  scrollThreshold.addEventListener("change", save);
  keys.forEach((key) => document.getElementById(key).addEventListener("change", save));
});
