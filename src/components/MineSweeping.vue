<template>
  <div class="mine-sweeping">
    <!-- TODO: 扫雷界面 -->
    <div v-for="(cols, rowIndex) in board" :key="rowIndex">
      <span
        v-for="(block, colIndex) in cols"
        :key="`${rowIndex}-${colIndex}`"
        class="mine-sweeping-block"
        @click="onMineSweeping(rowIndex, colIndex)"
      >{{ !isGameOver && block === M ? E : block }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useMineSweeping from '@/hooks/useMineSweeping';
import {
  MINE_SWEEPING_EMPTY as E,
  MINE_SWEEPING_MINE as M
} from '@/constant';

export default defineComponent({
  name: 'MineSweeping',
  setup(props, ctx) {
    const {
      board,
      status,
      setSettings,
      onRestart,
      onMineSweeping
    } = useMineSweeping();

    return {
      E, M,
      board,
      status,
      setSettings,
      onRestart,
      onMineSweeping
    };
  }
});
</script>

<style lang="scss" socped>
.mine-sweeping-block {
  display: inline-block;
  width: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
