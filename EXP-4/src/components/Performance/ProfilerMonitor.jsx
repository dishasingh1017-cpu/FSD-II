import { Profiler } from "react";
import {
  recordProfilerRender,
} from "../../performanceStore";

function ProfilerMonitor({ children }) {
  const handleProfiler = (
    id,
    phase,
    actualDuration
  ) => {
    recordProfilerRender(actualDuration);
  };

  return (
    <Profiler
      id="PostFlowCalendar"
      onRender={handleProfiler}
    >
      {children}
    </Profiler>
  );
}

export default ProfilerMonitor;