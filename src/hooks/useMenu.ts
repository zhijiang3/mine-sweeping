import { ref } from 'vue';

export default function useMenu() {
  const active = ref('');
  const isFocusMenu = ref(false);

  function clearActive() {
    isFocusMenu.value = false;
    active.value = '';
  }

  function clickActive(newActive: string) {
    if (!isFocusMenu.value) isFocusMenu.value = true;

    if (active.value === newActive) {
      clearActive();
    } else {
      active.value = newActive;
    }
  }

  function hoverActive(newActive: string) {
    if (!isFocusMenu.value) return;

    active.value = newActive;
  }

  return {
    active,
    clickActive,
    hoverActive,
    clearActive
  };
}
