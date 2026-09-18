import { useEffect, useMemo, useState } from "react";

function LiveClock({ useMemoOptimization }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const memoizedClock = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);
  }, [now]);

  const directClock = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  const displayClock = useMemoOptimization
    ? memoizedClock
    : directClock;

  return (
    <div className="live-clock">
      <span className="clock-dot" />
      <span>{displayClock}</span>
    </div>
  );
}

export default LiveClock;