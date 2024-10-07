// worker.js
self.onmessage = async (event) => {
  const { url } = event.data;
  try {
    const response = await fetch(url);
    const data = await response.json();
    postMessage({ result: data });
  } catch (error) {
    postMessage({ error: error.message });
  }
};
