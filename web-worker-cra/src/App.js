import React, { useEffect } from "react";
import { useWorker } from "./useWorker";

// The worker logic that we pass to the custom hook
const workerCode = () => {
  self.onmessage = async function (event) {
    const { url } = event.data;
    try {
      const response = await fetch(url);
      const data = await response.json();
      postMessage({ result: data });
    } catch (error) {
      postMessage({ error: error.message });
    }
  };
};

const App = () => {
  // Use the custom hook to interact with the worker
  const { data, error, postMessage } = useWorker(workerCode);

  // Only call postMessage once when the component mounts
  useEffect(() => {
    console.log("Fetching Star Wars character with web worker...");
    
    // Fetch character data from worker
    postMessage({ url: "https://swapi.dev/api/people/1" }); // Luke Skywalker
  }, [postMessage]); // Only depend on stable postMessage function

  return (
    <div className="App">
      <h1>Star Wars Character Fetcher</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <div>
          <h3>Character Name: {data.name}</h3>
          <p>Height: {data.height}</p>
          <p>Mass: {data.mass}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
