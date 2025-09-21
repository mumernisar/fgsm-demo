import { useEffect, useState } from "react";

const KEY = "runs_history_v1";

export function useRunsStore() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRuns(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(runs));
    } catch {}
  }, [runs]);

  function addRun(run) {
    setRuns((prev) => [run, ...prev]);
  }

  return { runs, addRun, setRuns };
}
