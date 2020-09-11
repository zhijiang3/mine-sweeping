<template>
  <div class="mine-sweeping-window">
    <mine-sweeping-menu @click="onMenuClick" />

    <div class="mine-sweeping-main">
      <div class="mine-sweeping-panel">
        <div class="mine-sweeping-clock">
          <i class="iconfont icon-clock" />
          <span>{{ Math.floor(stopwatchTiming / 1000) }}s</span>
        </div>

        <div class="mine-sweeping-face">
        </div>

        <span>{{ isWinner ? '你赢了' : isLoser ? '你输啦' : '游戏中' }}</span>

        <div class="mine-sweeping-mine-count">
          <i class="iconfont icon-mine" />
          <span>{{ settings.mines - mineFlagSize }}</span>
        </div>
      </div>

      <div class="mine-sweeping-content">
        <div
          v-for="(cols, rowIndex) in board"
          :key="rowIndex"
          class="mine-sweeping-rows"
        >
          <span
            v-for="(block, colIndex) in cols"
            :key="`${rowIndex}-${colIndex}`"
            class="mine-sweeping-block"
            :class="{
              'is-block': checkIsBlock(block, rowIndex, colIndex),
              'is-dug-mine': isDugMine(block),
              'is-tap': tapBlock.has(getFlagKey(rowIndex, colIndex)),
              'is-gameover': isGameOver
            }"
            @mousedown="onMousedown($event, rowIndex, colIndex)"
            @mouseup="onMouseup(rowIndex, colIndex)"
            @contextmenu="onContextmenu"
          >
            <i
              v-if="(isWinner && isMine(block)) || !isLoser && isMineFlag(getFlagKey(rowIndex, colIndex))"
              class="mine-sweeping-flag iconfont icon-flag2"
            />
            <i
              v-if="isLoser && isMine(block)"
              class="mine-sweeping-mine iconfont icon-mine"
            />
            <i
              v-if="!(isGameOver && isMine(block)) && isUnknownFlag(getFlagKey(rowIndex, colIndex))"
            >?</i>
            <i
              v-if="isLoser && !isMine(block) && isMineFlag(getFlagKey(rowIndex, colIndex))"
            >x</i>
            <span>{{ getBlockText(block) }}</span>
          </span>
        </div>
      </div>
    </div>

    <div v-if="showSetting" class="mine-sweeping-setting">
      <h3><i class="iconfont icon-setting" />游戏设置</h3>

      <form @submit.prevent>
        <div>
          <span>行数：</span>
          <input v-model.number="settingModel.rows" />
        </div>
        <div>
          <span>列数：</span>
          <input v-model.number="settingModel.cols" />
        </div>
        <div>
          <span>地雷数：</span>
          <input v-model.number="settingModel.mines" />
        </div>
      </form>

      <div :style="{ textAlign: 'right' }">
        <button @click="showSetting = false">取消</button>
        <button @click="onSetting">确定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import useMineSweepingSetting from '@/hooks/useMineSweepingSetting';
import useMineSweepingGame from '@/hooks/useMineSweepingGame';
import useMineSweepingTime from '@/hooks/useMineSweepingTime';
import useMineSweepingView from '@/hooks/useMineSweepingView';
import MineSweepingMenu from '@/components/MineSweepingMenu.vue';

export default defineComponent({
  name: 'MineSweeping',
  components: {
    MineSweepingMenu
  },
  setup() {
    const { settings, setSettings } = useMineSweepingSetting();
    const {
      status,
      board,
      flags,
      tapBlock,
      getFlagKey,
      onRestart,
      onContextmenu,
      onMousedown,
      onMouseup
    } = useMineSweepingGame(settings);
    const { stopwatchTiming } = useMineSweepingTime(status);
    const { getBlockText, isGameOver, isLoser, isWinner, isBlock, isMine, isDugMine, isMineFlag, isNullFlag, isUnknownFlag, mineFlagSize } = useMineSweepingView(status, flags);

    const showSetting = ref(false);
    const settingModel = ref({ ...settings });
    watchEffect(() => {
      if (showSetting.value) {
        settingModel.value = { ...settings };
      }
    });
    function onSetting() {
      setSettings({ ...settingModel.value });
      onRestart();
      showSetting.value = false;
    }
    function checkIsBlock(block: string, rowIndex: number, colIndex: number) {
      if (!isLoser.value) return isBlock(block);

      if (!isMine(block) && isMineFlag(getFlagKey(rowIndex, colIndex))) return false;

      return isBlock(block) && !isMine(block);
    }

    function onMenuClick(key: string) {
      switch (key) {
        case 'easy':
          setSettings({
            rows: 8,
            cols: 8,
            mines: 10
          });
          onRestart();
          break;
        case 'middle':
          setSettings({
            rows: 16,
            cols: 16,
            mines: 40
          });
          onRestart();
          break;
        case 'hard':
          setSettings({
            rows: 16,
            cols: 30,
            mines: 99
          });
          onRestart();
          break;
        case 'custom':
          break;
        case 'restart':
          onRestart();
          break;
      }
    }

    return {
      onMenuClick,
      showSetting, settingModel, onSetting,
      board, flags, settings, stopwatchTiming, tapBlock,
      isGameOver, isLoser, isWinner,
      isMineFlag, isNullFlag, isUnknownFlag, isBlock, isMine, isDugMine, getFlagKey, getBlockText, mineFlagSize,
      onRestart, onContextmenu, onMousedown, onMouseup,
      checkIsBlock
    };
  }
});
</script>

<style lang="scss" socped>
.mine-sweeping-window {
  display: inline-block;
  position: relative;
}

.mine-sweeping-setting {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #BDBDBD;
}

.mine-sweeping-main {
  padding: 8px 18px 18px;
  background-color: #BDBDBD;

  .mine-sweeping-panel,
  .mine-sweeping-content {
    border-style: solid;
    border-width: 4px;
    border-top-color: #7B7B7B;
    border-left-color: #7B7B7B;
    border-right-color: #FEFEFE;
    border-bottom-color: #FEFEFE;
  }

  .mine-sweeping-panel {
    margin-bottom: 10px;
    padding: 6px;
  }

  .mine-sweeping-rows {
    display: flex;
  }

  .mine-sweeping-block {
    outline: none;
    border-bottom: 2px solid #7B7B7B;
    border-right: 2px solid #7B7B7B;
    width: 48px;
    height: 48px;
    font-size: 28px;
    box-sizing: border-box;
    user-select: none;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &.is-block:not(.is-gameover) {
      cursor: pointer;
    }
    &.is-block:not(.is-gameover).is-tap {
      &::after {
        border-color: transparent;
      }
    }
    &:last-child {
      border-right: none;
    }
    &.is-block::after {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      border-style: solid;
      border-width: 3px;
      border-right-width: 2px;
      border-bottom-width: 2px;
      border-left-color: #FEFEFE;
      border-top-color: #FEFEFE;
      border-right-color: #7B7B7B;
      border-bottom-color: #7B7B7B;
    }
    &.is-block:last-child::after {
      border-right-width: 3px;
    }
    &.is-dug-mine {
      color: #FC284F;
    }
  }
  .mine-sweeping-rows:last-child .mine-sweeping-block {
    border-bottom: none;
  }
  .mine-sweeping-rows:last-child .mine-sweeping-block.is-block::after {
    border-bottom-width: 3px;
  }
  .mine-sweeping-flag {
    font-size: 26px;
    color: #FC284F;
  }
  .mine-sweeping-mine {
    font-size: 28px;
  }
}
</style>
