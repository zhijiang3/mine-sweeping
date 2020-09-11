import { reactive, watchEffect } from 'vue';

export interface MineSweepingSettings {
  cols: number;
  rows: number;
  mines: number;
}

export default function useMineSweepingSetting() {
  const settings = reactive<MineSweepingSettings>({
    cols: 8,
    rows: 8,
    mines: 10
  });

  function setSettings(options: Partial<MineSweepingSettings>) {
    if (options.mines) settings.mines = Math.max(10, options.mines);
    if (options.cols) settings.cols = Math.max(8, Math.min(30, options.cols));
    if (options.rows) settings.rows = Math.max(8, Math.min(24, options.rows));
  }

  watchEffect(() => {
    const maxMines = (settings.rows - 1) * (settings.cols - 1);

    if (settings.mines > maxMines) settings.mines = maxMines;
  });

  return {
    settings,
    setSettings
  };
}
