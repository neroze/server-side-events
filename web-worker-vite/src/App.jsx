// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";

function fetchPersonWithWorker(id) {
  return new Promise((resolve, reject) => {
    // Create a new worker instance
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

    worker.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.result);
      }
      worker.terminate(); // Clean up the worker after receiving the data
    };

    worker.postMessage({ url: `https://swapi.dev/api/people/${id}` });
  });
}

const App = () => {
  const [users, setUsers] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Star Wars characters with web worker...");
        const [luke, leia] = await Promise.all([fetchPersonWithWorker(1), fetchPersonWithWorker(5)]);
        console.log("Luke:", luke);
        console.log("Leia:", leia);
        setUsers({luke, leia})
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchData();
  }, []);

  if (! users.leia) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <h1>Star Wars Character Fetcher with Web Workers</h1>
      { users?.luke &&
          <div>
          <h3>Character Name: {users.luke.name}</h3>
          <p>Height: {users.luke.height}</p>
          <p>Mass: {users.luke.mass}</p>
        </div>
      }

{ users?.leia &&
          <div>
          <h3>Character Name: {users.leia.name}</h3>
          <p>Height: {users.leia.height}</p>
          <p>Mass: {users.leia.mass}</p>
        </div>
      }
    </div>
  );
};

export default App
