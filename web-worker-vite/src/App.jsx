// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from "react";

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Star Wars characters with web worker...");
        const [luke, leia] = await Promise.all([fetchPersonWithWorker(1), fetchPersonWithWorker(5)]);
        console.log("Luke:", luke);
        console.log("Leia:", leia);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Star Wars Character Fetcher with Web Workers</h1>
      <p>Open the console to see the results.</p>
    </div>
  );
};


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
