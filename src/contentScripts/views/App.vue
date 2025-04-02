<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import {
  findMatchingHandler,
  handleAutomation,
  handleFavorite,
  handleImport,
  handleSubscribe,
} from '~/domain'
import 'uno.css'
import { stateExtension } from '~/logic/storage'

const [show, toggle] = useToggle(false)

// 处理自动化按钮点击
async function onAutoClick() {
  stateExtension.value.url = window.location.href
  await handleAutomation(window.location.href)
}

// 处理导入按钮点击
async function onImportClick() {
  stateExtension.value.url = window.location.href
  await handleImport(window.location.href)
}

// 处理收藏按钮点击
async function onFavoriteClick() {
  stateExtension.value.url = window.location.href
  await handleFavorite(window.location.href)
}

// 处理订阅按钮点击
async function onSubscribeClick() {
  stateExtension.value.url = window.location.href
  await handleSubscribe(window.location.href)
}

// 切换状态
function toggleState() {
  stateExtension.value.url = window.location.href
  toggle()
}

// 当前页面是否显示
const isShow = computed(() => {
  stateExtension.value.url = window.location.href
  const handler = findMatchingHandler(window.location.href)
  if (handler) {
    return true
  }
  return false
})
</script>

<template>
  <div
    v-if="isShow"
    class="fixed right-0 bottom-0 m-5 z-999 flex flex-col gap-[10px] items-end font-sans select-none leading-[1em]"
  >
    <div v-show="show" class="flex flex-col gap-[10px]">
      <!-- 自动化 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="自动化"
        @click="onAutoClick()"
      >
        <img
          src="https://file.lifebus.top/ammds/ammds-auto.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 导入 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="导入"
        @click="onImportClick"
      >
        <img
          src="https://file.lifebus.top/ammds/ammds-import.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 收藏 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="收藏"
        @click="onFavoriteClick"
      >
        <img
          src="https://file.lifebus.top/ammds/ammda-favorite.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>

      <!-- 订阅 -->
      <button
        class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn ammds-tip"
        bg="blue-600 hover:blue-700"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="订阅"
        @click="onSubscribeClick"
      >
        <img
          src="https://file.lifebus.top/ammds/ammda-subscribe.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain"
        >
      </button>
    </div>
    <button
      class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none ammds-btn"
      bg="blue-600 hover:blue-700"
      style="display: flex; justify-content: center; align-items: center"
      @click="toggleState()"
    >
      <img
        src="https://file.lifebus.top/ammds/icon.svg"
        alt="power"
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
    content: "";
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
