<template>
  <div class="mine-sweeping-menu" v-click-outside="clearActive">
    <div
      v-for="menu in menus"
      :key="menu.key"
      class="mine-sweeping-menu-item"
      :class="{
        'is-hover': active === menu.key
      }"
      @click="clickActive(menu.key)"
      @mouseenter="hoverActive(menu.key)"
    >
      <span>{{ menu.text }}</span>

      <div
        v-if="menu.sub && menu.sub.length"
        class="mine-sweeping-sub-menu"
        :class="{
          'is-show': active === menu.key
        }"
      >
        <template v-for="(submenu, index) in menu.sub">
          <div
            v-if="submenu.spacer"
            :key="index"
            class="mine-sweeping-menu-spacer"
          />
          <div
            v-else
            :key="submenu.key"
            class="mine-sweeping-menu-item"
            @click="onClickMenuItem(submenu.key)"
          >
            <span>{{ submenu.text }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useMenu from '@/hooks/useMenu';
import clickOutside from '@/directives/clickOutside';

export default defineComponent({
  name: 'MineSweepingMenu',
  directives: {
    clickOutside
  },
  setup(props, ctx) {
    const { active, clickActive, hoverActive, clearActive } = useMenu();

    const menus = ref([
      {
        text: '游戏',
        key: 'game',
        sub: [
          { text: '重新开始', key: 'restart' },
          { spacer: true },
          { text: '初级', key: 'easy' },
          { text: '中级', key: 'middle' },
          { text: '高级', key: 'hard' },
          { text: '自定义', key: 'custom' }
        ]
      },
      {
        text: '帮助',
        key: 'help',
        sub: [
          { text: '玩法介绍', key: 'gameRule' }
        ]
      }
    ]);

    function onClickMenuItem(key: string) {
      ctx.emit('click', key);
    }

    return {
      menus, onClickMenuItem,
      active, clickActive, hoverActive, clearActive
    };
  }
});
</script>

<style lang="scss" scoped>
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
    z-index: 2;
    top: 100%;
    left: 0;
    background: #D8D8D8;
    padding: 5px 0;

    &.is-show {
      display: block;
    }

    > .mine-sweeping-menu-item {
      white-space: nowrap;
      padding: 0 12px 0 20px;
      font-size: 14px;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .mine-sweeping-menu-spacer {
    display: block;
    width: 100%;
    height: 1px;
    margin: 5px 0;
    background: #BDBDBD;
  }
}
</style>
