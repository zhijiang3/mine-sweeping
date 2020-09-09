<template>
  <div class="mine-sweeping-window">
    <div
      class="mine-sweeping-menu"
      v-click-outside="clearActive"
    >
      <div
        class="mine-sweeping-menu-item"
        :class="{
          'is-hover': active === 'game'
        }"
        @click="clickActive('game')"
        @mouseenter="hoverActive('game')"
      >
        <span>游戏</span>

        <div
          class="mine-sweeping-sub-menu"
          :class="{
            'is-show': active === 'game'
          }"
        >
          <div class="mine-sweeping-menu-item" @click="onRestart">
            <span>重新开始</span>
          </div>
        </div>
      </div>
      <div
        class="mine-sweeping-menu-item"
        :class="{
          'is-hover': active === 'setting'
        }"
        @click="clickActive('setting')"
        @mouseenter="hoverActive('setting')"
      >
        <span>设置</span>

        <div
          class="mine-sweeping-sub-menu"
          :class="{
            'is-show': active === 'setting'
          }"
        >
          <div class="mine-sweeping-menu-item" @click="showSetting = true">
            <span>游戏设置</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mine-sweeping-main">
      <div class="mine-sweeping-panel">
        <span>时间：{{ Math.floor(stopwatchTiming / 1000) }}s</span>
        <span>{{ isWinner ? '你赢了' : isLoser ? '你输啦' : '游戏中' }}</span>
        <span>地雷：{{ settings.mines - flags.size }}</span>
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
              'is-block': isBlock(block),
              'is-flag': isBlock(block) && flags.has(getFlagKey(rowIndex, colIndex)),
              'is-gameover': isGameOver,
              'is-mine': isGameOver && isMine(block)
            }"
            @click="onMineSweeping(rowIndex, colIndex)"
            @contextmenu="onMarkFlag($event, rowIndex, colIndex)"
          >{{ getBlockText(block) }}</span>
        </div>
      </div>
    </div>

    <div v-if="showSetting" class="mine-sweeping-setting">
      <h3>游戏设置</h3>

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
import { defineComponent, ref, watchEffect, reactive } from 'vue';
import {
  useMineSweepingSetting,
  useMineSweepingGame,
  useMineSweepingView
} from '@/hooks/useMineSweeping';
import useMenu from '@/hooks/useMenu';

export default defineComponent({
  name: 'MineSweeping',
  setup() {
    const { active, clickActive, hoverActive, clearActive } = useMenu();
    const { settings, setSettings } = useMineSweepingSetting();
    const { board, flags, status, stopwatchTiming, getFlagKey, onRestart, onMineSweeping, onMarkFlag } = useMineSweepingGame(settings);
    const { getBlockText, isGameOver, isLoser, isWinner, isBlock, isMine } = useMineSweepingView(status);

    onRestart();

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

    return {
      showSetting, settingModel, onSetting,
      active, clickActive, hoverActive, clearActive,
      board, flags, settings, stopwatchTiming,
      isGameOver, isLoser, isWinner,
      isBlock, isMine, getFlagKey, getBlockText, setSettings,
      onRestart, onMarkFlag, onMineSweeping
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

.mine-sweeping-menu {
  padding: 10px 8px 0;
  display: flex;
  position: relative;
  background: #BDBDBD;

  > .mine-sweeping-menu-item {
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    cursor: default;
    position: relative;

    &.is-hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  .mine-sweeping-sub-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #D8D8D8;
    padding: 4px 0;

    &.is-show {
      display: block;
    }

    > .mine-sweeping-menu-item {
      white-space: nowrap;
      padding: 0 10px 0 20px;
      font-size: 14px;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
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
    display: flex;
    justify-content: space-between;
  }

  .mine-sweeping-rows {
    display: flex;
  }

  .mine-sweeping-block {
    border-bottom: 2px solid #7B7B7B;
    border-right: 2px solid #7B7B7B;
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 28px;
    box-sizing: border-box;
    user-select: none;
    position: relative;

    &.is-block:not(.is-gameover) {
      cursor: pointer;
    }
    &.is-block:not(.is-gameover):hover {
      background: rgba(255, 255, 255, 0.3);
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
    &.is-flag {
      background: rgba(0, 0, 0, 0.2);
      border-color: red;
    }
    &.is-mine {
      color: red;
    }
  }
  .mine-sweeping-rows:last-child .mine-sweeping-block {
    border-bottom: none;
  }
  .mine-sweeping-rows:last-child .mine-sweeping-block.is-block::after {
    border-bottom-width: 3px;
  }
}
</style>
