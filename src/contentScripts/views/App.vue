<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'

const [show, toggle] = useToggle(false)
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-999 flex flex-col gap-[10px] items-end font-sans select-none leading-[1em]">
    <div v-show="show" class="flex flex-col gap-[10px]">
      <!-- 自动化 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700" style="display: flex; justify-content: center; align-items: center;"
        aria-label="自动化" @click="toggle()"
      >
        <img
          src="https://file.lifebus.top/ammds/ammds-auto.svg" alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 导入 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700" style="display: flex; justify-content: center; align-items: center;"
        aria-label="导入" @click="toggle()"
      >
        <img
          src="https://file.lifebus.top/ammds/ammds-import.svg" alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 收藏 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700" style="display: flex; justify-content: center; align-items: center;"
        aria-label="收藏" @click="toggle()"
      >
        <img
          src="https://file.lifebus.top/ammds/ammda-favorite.svg" alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 订阅 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700" style="display: flex; justify-content: center; align-items: center;"
        aria-label="订阅" @click="toggle()"
      >
        <img
          src="https://file.lifebus.top/ammds/ammda-subscribe.svg" alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>
    </div>
    <button
      class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn" bg="blue-600 hover:blue-700"
      style="display: flex; justify-content: center; align-items: center;" @click="toggle()"
    >
      <img
        src="https://file.lifebus.top/ammds/icon.svg" alt="power"
        class="block text-white text-lg h-6 w-6 object-contain"
      >
    </button>
  </div>
</template>

<style lang="less" scoped>
ammds-btn {
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

// ammds-tip 鼠标悬浮后显示提示
.ammds-tip {
  position: relative;

  &:hover::before {
    content: attr(aria-label);
    position: absolute;
    top: 50%;
    left: -7em;
    transform: translateY(-50%);
    padding: 0.5em 1em;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
  }

  &:hover::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -1.5em;
    transform: translateY(-50%);
    border-left: 6px solid rgba(0, 0, 0, 0.8);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
}
</style>
