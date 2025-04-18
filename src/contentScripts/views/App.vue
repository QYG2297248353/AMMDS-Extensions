<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  findMatchingHandler,
  handleAutomation,
  handleFavorite,
  handleImport,
  handleSubscribe,
  message,
} from '~/domain'
import 'uno.css'
import { stateExtension } from '~/logic/storage'

const [show, toggle] = useToggle(false)

const [loading, upLoading] = useToggle(false)

// 处理自动化按钮点击
async function onAutoClick() {
  stateExtension.value.url = window.location.href
  if (loading.value) {
    message.warning('请耐心等待, 数据导入中...')
    return
  }
  upLoading()
  await handleAutomation(window.location.href).finally(() => {
    upLoading()
  })
}

// 处理导入按钮点击
async function onImportClick() {
  stateExtension.value.url = window.location.href
  if (loading.value) {
    message.warning('请耐心等待, 数据导入中...')
    return
  }
  upLoading()
  await handleImport(window.location.href).finally(() => {
    upLoading()
  })
}

// 处理收藏按钮点击
async function onFavoriteClick() {
  stateExtension.value.url = window.location.href
  if (loading.value) {
    message.warning('请耐心等待, 数据导入中...')
    return
  }
  upLoading()
  await handleFavorite(window.location.href).finally(() => {
    upLoading()
  })
}

// 处理订阅按钮点击
async function onSubscribeClick() {
  stateExtension.value.url = window.location.href
  if (loading.value) {
    message.warning('请耐心等待, 数据导入中...')
    return
  }
  upLoading()
  await handleSubscribe(window.location.href).finally(() => {
    upLoading()
  })
}

// 当前页面是否显示
const showComponent = ref(false)
async function checkIsShow() {
  stateExtension.value.url = window.location.href
  const handler = await findMatchingHandler(window.location.href)
  showComponent.value = !!handler
  return !!handler
}

// 初始检查
onMounted(async () => {
  await checkIsShow()
})

// 拖拽相关状态
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })

// 精确地计算按钮组高度和容器尺寸
const BUTTON_HEIGHT = 54 // 单个按钮高度
const BUTTON_WIDTH = 54 // 单个按钮宽度
const BUTTON_GAP = 10 // 按钮间距
const TOTAL_BUTTONS = 4 // 总按钮数
const EXPANDED_HEIGHT
  = TOTAL_BUTTONS * BUTTON_HEIGHT + (TOTAL_BUTTONS - 1) * BUTTON_GAP
const TOOLTIP_WIDTH = 120 // 提示词宽度
const SAFE_MARGIN = 20 // 安全边距

// 存储按钮信息
function savePosition() {
  localStorage.setItem(
    'ammdsPosition',
    JSON.stringify({
      x: position.value.x,
      y: position.value.y,
      show: show.value,
    }),
  )
}

// 展开方向计算 - 根据主按钮位置决定
const isTop = computed(() => {
  // 如果展开后会超出底部，则向上展开
  return (
    position.value.y + BUTTON_HEIGHT + EXPANDED_HEIGHT
    > window.innerHeight - SAFE_MARGIN
  )
})

// 修改提示词显示方向的计算逻辑
const isLeft = computed(() => {
  // 默认提示词在左侧，只有当按钮靠近屏幕左侧边缘时才在右侧显示
  return position.value.x < TOOLTIP_WIDTH + SAFE_MARGIN * 2
})

// 优化的拖拽逻辑
function startDrag(e: MouseEvent) {
  if (
    (e.target as HTMLElement).closest('.main-btn')
    || (e.target as HTMLElement).closest('.main-btn-img')
  ) {
    isDragging.value = true
    startPos.value = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y,
    }
    // 添加全局事件监听
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault()
  }
}

// 记录拖动状态
const hasMoved = ref(false)

// 完全重写调整位置函数，确保按钮组在可视区域内
function adjustPosition() {
  if (!show.value)
    return

  // 计算当前窗口尺寸
  const windowHeight = window.innerHeight

  // 计算展开后的总高度
  const totalHeight = isTop.value
    ? BUTTON_HEIGHT + EXPANDED_HEIGHT
    : BUTTON_HEIGHT

  // 垂直方向调整
  if (isTop.value) {
    // 向下展开时，确保不超出底部边界
    if (position.value.y + totalHeight > windowHeight - SAFE_MARGIN) {
      position.value.y = windowHeight - totalHeight - SAFE_MARGIN
    }
    // 同时确保不超出顶部边界
    if (position.value.y < SAFE_MARGIN) {
      position.value.y = SAFE_MARGIN
    }
  }
  // 保存新位置
  savePosition()
}

// 展开/收起逻辑
function toggleState() {
  stateExtension.value.url = window.location.href

  // 切换前预先计算展开方向
  const willBeTop
    = position.value.y + BUTTON_HEIGHT + EXPANDED_HEIGHT
    > window.innerHeight - SAFE_MARGIN
  const willBeLeft
    = position.value.x + BUTTON_WIDTH + TOOLTIP_WIDTH
    > window.innerWidth - SAFE_MARGIN

  // 如果即将展开，先调整位置
  if (!show.value) {
    // 预先调整位置，确保展开后不会超出屏幕
    if (willBeTop) {
      // 向上展开时，确保有足够空间
      if (position.value.y - EXPANDED_HEIGHT < SAFE_MARGIN) {
        // 如果向上没有足够空间，尝试向下展开
        if (
          position.value.y + BUTTON_HEIGHT + EXPANDED_HEIGHT
          < window.innerHeight - SAFE_MARGIN
        ) {
          // 可以向下展开
          position.value.y = SAFE_MARGIN
        }
        else {
          // 上下都没有足够空间，尽量居中显示
          position.value.y = (window.innerHeight - BUTTON_HEIGHT) / 2
        }
      }
    }
    else {
      // 向下展开时，确保有足够空间
      if (
        position.value.y + BUTTON_HEIGHT + EXPANDED_HEIGHT
        > window.innerHeight - SAFE_MARGIN
      ) {
        position.value.y
          = window.innerHeight - BUTTON_HEIGHT - EXPANDED_HEIGHT - SAFE_MARGIN
      }
    }

    // 水平方向同样处理
    if (willBeLeft) {
      if (position.value.x - TOOLTIP_WIDTH < SAFE_MARGIN) {
        position.value.x = TOOLTIP_WIDTH + SAFE_MARGIN
      }
    }
    else {
      if (
        position.value.x + BUTTON_WIDTH + TOOLTIP_WIDTH
        > window.innerWidth - SAFE_MARGIN
      ) {
        position.value.x
          = window.innerWidth - BUTTON_WIDTH - TOOLTIP_WIDTH - SAFE_MARGIN
      }
    }
    // 保存新位置
    savePosition()
  }

  // 切换展开状态
  toggle()

  // 在下一个渲染周期再次调整位置
  nextTick(() => {
    adjustPosition()
  })
}

// 修改初始化位置和窗口大小变化监听
onMounted(() => {
  // 从本地存储中获取上次保存的位置 - 初始化时使用
  const savedPosition = localStorage.getItem('ammdsPosition')
  if (savedPosition) {
    const { x, y, show: savedShow } = JSON.parse(savedPosition)
    position.value = { x, y }
    show.value = savedShow
  }
  else {
    // 初始位置设置为右下角，但确保不会太靠近边缘
    position.value = {
      x: window.innerWidth - BUTTON_WIDTH - SAFE_MARGIN,
      y: window.innerHeight - BUTTON_HEIGHT - SAFE_MARGIN,
    }
    // 保存初始位置
    savePosition()
  }

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    // 获取当前窗口尺寸
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 调整位置，确保不超出边界
    position.value = {
      x: Math.max(
        SAFE_MARGIN,
        Math.min(position.value.x, windowWidth - BUTTON_WIDTH - SAFE_MARGIN),
      ),
      y: Math.max(
        SAFE_MARGIN,
        Math.min(position.value.y, windowHeight - BUTTON_HEIGHT - SAFE_MARGIN),
      ),
    }
    // 保存新位置
    savePosition()

    // 如果已展开，还需要考虑展开的空间
    if (show.value) {
      // 延迟执行以确保窗口大小已经更新完成
      setTimeout(() => {
        adjustPosition()
      }, 100)
    }
  })
})

// 修改拖拽函数，确保拖拽时不超出边界
function onDrag(e: MouseEvent) {
  if (isDragging.value) {
    // 标记已经发生拖动
    hasMoved.value = true

    requestAnimationFrame(() => {
      // 计算新位置
      const newX = e.clientX - startPos.value.x
      const newY = e.clientY - startPos.value.y

      // 获取当前窗口尺寸
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // 限制在窗口范围内，确保按钮不会超出页面
      position.value = {
        x: Math.max(
          SAFE_MARGIN,
          Math.min(windowWidth - BUTTON_WIDTH - SAFE_MARGIN, newX),
        ),
        y: Math.max(
          SAFE_MARGIN,
          Math.min(windowHeight - BUTTON_HEIGHT - SAFE_MARGIN, newY),
        ),
      }

      // 实时保存位置信息
      savePosition()

      // 拖动时也要考虑展开状态
      if (show.value) {
        adjustPosition()
      }
    })
  }
}
function stopDrag(e: MouseEvent) {
  if (isDragging.value) {
    // 只有在没有拖动时才触发点击事件
    if (!hasMoved.value && e.button === 0) {
      toggleState()
    }

    // 重置状态
    isDragging.value = false
    hasMoved.value = false

    // 移除全局事件监听
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }
}
</script>

<template>
  <div
    v-if="showComponent"
    :style="{
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 999,
    }"
    class="flex flex-col gap-[10px] items-end font-sans select-none leading-[1em]"
    @mousedown="startDrag"
  >
    <!-- 主按钮 -->
    <button
      class="main-btn flex w-14 h-14 rounded-full shadow-xl cursor-move border-none ammds-btn"
      bg="gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
      style="display: flex; justify-content: center; align-items: center"
      @click.stop
    >
      <img
        src="https://file.lifebus.top/ammds/icon.svg"
        alt="power"
        class="main-btn-img block text-white text-lg h-6 w-6 object-contain relative z-10"
      >
    </button>
    <!-- 按钮组 -->
    <div v-show="show" class="flex flex-col gap-[10px]">
      <!-- 自动化 -->
      <button
        class="flex w-14 h-14 rounded-full shadow-lg cursor-pointer border-none ammds-btn ammds-tip"
        :class="{ 'tip-right': isLeft, 'tip-left': !isLeft }"
        bg="gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="自动"
        :disabled="loading"
        @click="onAutoClick"
      >
        <div
          class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-full"
        />
        <img
          src="https://file.lifebus.top/ammds/ammds-auto.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain relative z-10"
        >
      </button>

      <!-- 导入 -->
      <button
        class="flex w-14 h-14 rounded-full shadow-lg cursor-pointer border-none ammds-btn ammds-tip"
        :class="{ 'tip-right': isLeft, 'tip-left': !isLeft }"
        bg="gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="导入"
        :disabled="loading"
        @click="onImportClick"
      >
        <div
          class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-full"
        />
        <img
          src="https://file.lifebus.top/ammds/ammds-import.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain relative z-10"
        >
      </button>

      <!-- 收藏 -->
      <button
        class="flex w-14 h-14 rounded-full shadow-lg cursor-pointer border-none ammds-btn ammds-tip"
        :class="{ 'tip-right': isLeft, 'tip-left': !isLeft }"
        bg="gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="收藏"
        :disabled="loading"
        @click="onFavoriteClick"
      >
        <div
          class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-full"
        />
        <img
          src="https://file.lifebus.top/ammds/ammda-favorite.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain relative z-10"
        >
      </button>

      <!-- 订阅 -->
      <button
        class="flex w-14 h-14 rounded-full shadow-lg cursor-pointer border-none ammds-btn ammds-tip"
        :class="{ 'tip-right': isLeft, 'tip-left': !isLeft }"
        bg="gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        style="display: flex; justify-content: center; align-items: center"
        aria-label="订阅"
        :disabled="loading"
        @click="onSubscribeClick"
      >
        <div
          class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-full"
        />
        <img
          src="https://file.lifebus.top/ammds/ammda-subscribe.svg"
          alt="power"
          class="block text-white text-lg h-8 w-8 object-contain relative z-10"
        >
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ammds-btn {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%
  );
  background-size: 100px 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 10px 10px -5px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.ammds-tip {
  position: relative;
}

/* 左侧提示 - 增强视觉效果 */
.tip-left:hover::before {
  content: attr(aria-label);
  position: absolute;
  top: 50%;
  left: -7em;
  transform: translateY(-50%);
  padding: 0.6em 1.2em;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tip-left:hover::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -1.8em;
  transform: translateY(-50%);
  border-left: 6px solid rgba(0, 0, 0, 0.85);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  z-index: 20;
}

/* 右侧提示 - 增强视觉效果 */
.tip-right:hover::before {
  content: attr(aria-label);
  position: absolute;
  top: 50%;
  right: -7em;
  transform: translateY(-50%);
  padding: 0.6em 1.2em;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tip-right:hover::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -1.8em;
  transform: translateY(-50%);
  border-right: 6px solid rgba(0, 0, 0, 0.85);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  z-index: 20;
}

.main-btn {
  z-index: 10;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%
  );
  background-size: 100px 100px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after {
    opacity: 1;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
