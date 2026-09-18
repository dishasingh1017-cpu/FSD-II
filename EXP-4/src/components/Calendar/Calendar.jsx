import CalendarBoard from "./CalendarBoard";

function Calendar({
  useReactMemo = false,
  useCallbackOptimization = false,
  useMemoOptimization = false,
  onEdit,
}) {
  return (
    <CalendarBoard
      useReactMemo={useReactMemo}
      useCallbackOptimization={
        useCallbackOptimization
      }
      useMemoOptimization={
        useMemoOptimization
      }
      onEdit={onEdit}
    />
  );
}

export default Calendar;