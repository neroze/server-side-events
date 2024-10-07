import { useState, useEffect, useCallback } from "react";

// Helper function to create a worker from a blob
function createWorkerFromCode(workerCode) {
  const blob = new Blob([`(${workerCode.toString()})()`], {
    type: "application/javascript",
  });
  return new Worker(URL.createObjectURL(blob));
}

// Custom hook to manage worker
export function useWorker(workerCode) {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Initialize worker when the hook is first used
  useEffect(() => {
    const newWorker = createWorkerFromCode(workerCode);
    setWorker(newWorker);

    return () => {
      if (newWorker) {
        newWorker.terminate(); // Terminate worker when component unmounts
      }
    };
  }, [workerCode]);

  // Use useCallback to ensure postMessage is stable across renders
  const postMessage = useCallback(
    (message) => {
      if (worker) {
        worker.postMessage(message);
      }
    },
    [worker]
  );

  // Handle messages from the worker
  useEffect(() => {
    if (worker) {
      worker.onmessage = (event) => {
        if (event.data.error) {
          setError(event.data.error);
        } else {
          setData(event.data.result);
        }
      };

      worker.onerror = (e) => {
        setError(e.message);
      };
    }
  }, [worker]);

  // Reset state (if needed)
  const resetWorkerState = () => {
    setError(null);
    setData(null);
  };

  return { data, error, postMessage, resetWorkerState };
}
