<script setup lang="ts">
import { TransitionGroup, ref } from 'vue'
import 'uno.css'

interface MessageItem {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration: number
}

// eslint-disable-next-line unused-imports/no-unused-vars
const testData = [
  {
    id: 0,
    type: 'info',
    message: 'This is an info message',
    duration: 3000,
  },
  {
    id: 1,
    type: 'success',
    message: 'This is a success message',
    duration: 3000,
  },
  {
    id: 2,
    type: 'warning',
    message: 'This is a warning message',
    duration: 3000,
  },
  {
    id: 3,
    type: 'error',
    message: 'This is an error message',
    duration: 3000,
  },
]

const messages = ref<MessageItem[]>([])
let messageId = 0

const iconMap = {
  info: 'i-pixelarticons-info-box',
  success: 'i-pixelarticons-check',
  warning: 'i-pixelarticons-warning-box',
  error: 'i-pixelarticons-close',
}

const bgColorMap = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

function addMessage(
  type: MessageItem['type'],
  message: string,
  duration = 3000,
) {
  const id = messageId++
  messages.value.unshift({ id, type, message, duration })
  setTimeout(() => {
    removeMessage(id)
  }, duration)
}

function removeMessage(id: number) {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index !== -1)
    messages.value.splice(index, 1)
}

defineExpose({
  info: (message: string, duration?: number) =>
    addMessage('info', message, duration),
  success: (message: string, duration?: number) =>
    addMessage('success', message, duration),
  warning: (message: string, duration?: number) =>
    addMessage('warning', message, duration),
  error: (message: string, duration?: number) =>
    addMessage('error', message, duration),
})
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      left: '50%',
      top: '32px',
      transform: 'translateX(-50%)',
      zIndex: '9999',
      pointerEvents: 'none',
    }"
  >
    <TransitionGroup
      class="px-[10px] py-[6px]"
      name="message-fade"
      tag="div"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
      }"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex items-center gap-2 px-4 py-2 rounded shadow-lg text-white min-w-60 max-w-120"
        :class="bgColorMap[msg.type]"
      >
        <div class="text-xl" :class="[iconMap[msg.type]]" />
        <span>{{ msg.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="less" scoped>
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
