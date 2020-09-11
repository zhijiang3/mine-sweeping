import { Ref, ref, watchEffect } from 'vue';
import { MineSweepingStatus } from '@/hooks/useMineSweepingGame';

export default function useMineSweepingTime(status: Ref<MineSweepingStatus>) {
  const startTime = ref(0);
  const stopwatchTiming = ref(0);
  let stopwatchTimer: number;
  function runStopwatchTiming() {
    stopwatchTiming.value = Date.now() - startTime.value;

    stopwatchTimer = setTimeout(runStopwatchTiming, 1000);
  }
  function clearStopwatchTiming() {
    clearTimeout(stopwatchTimer);
  }
  watchEffect(() => {
    switch (status.value) {
      case MineSweepingStatus.init:
        stopwatchTiming.value = 0;
        clearStopwatchTiming();
        break;
      case MineSweepingStatus.playing:
        startTime.value = Date.now();
        runStopwatchTiming();
        break;
      case MineSweepingStatus.lose:
      case MineSweepingStatus.win:
        clearStopwatchTiming();
        break;
    }
  });

  return {
    startTime,
    stopwatchTiming
  };
}
