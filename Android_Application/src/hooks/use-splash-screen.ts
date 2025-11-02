import { useState, useEffect } from "react";

export function useSplash(duration = 3700) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return { showSplash, setShowSplash };
}
