<script setup lang="ts">
import { ref } from 'vue'
import ClientSide from './components/ClientSide.vue'
import SupportView from './components/SupportView.vue'
import HomeView from './components/HomeView.vue'
import Footer from '~/components/Footer.vue'
import logo from '~/assets/logo_header.png?inline'

const currentKey = ref('1')
const currentComponent = ref(HomeView)
function handleMenuClick(key: string) {
  currentKey.value = key
  switch (key) {
    case '1':
      currentComponent.value = HomeView
      break
    case '2':
      currentComponent.value = ClientSide
      break
    case '4':
      currentComponent.value = SupportView
      break
    default:
      currentComponent.value = HomeView
      break
  }
}
</script>

<template>
  <main class="flex flex-col min-h-screen text-gray-700 dark:text-gray-200">
    <a-layout class="min-h-screen">
      <a-layout-header class="flex items-center justify-between px-8">
        <div class="ms-header">
          <a-space>
            <img :src="logo" alt="logo" class="w-26">
            <a-divider direction="vertical" />
            <span class="text-lg font-medium ms-header-title">AMMDS</span>
          </a-space>
        </div>
        <a-menu
          mode="horizontal"
          :selected-keys="[currentKey]"
          @menu-item-click="handleMenuClick"
        >
          <a-menu-item key="1">
            主页
          </a-menu-item>
          <a-menu-item key="2">
            设备管理
          </a-menu-item>
          <a-menu-item key="3">
            历史记录
          </a-menu-item>
          <a-menu-item key="4">
            关于
          </a-menu-item>
        </a-menu>
        <div class="flex items-center space-x-2">
          <a-button type="text" shape="circle">
            <template #icon>
              <icon-github />
            </template>
          </a-button>
          <a-button type="text" shape="circle">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
          <a-button type="text" shape="circle">
            <template #icon>
              <icon-question-circle />
            </template>
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content class="p-6">
        <component :is="currentComponent" v-if="currentKey !== '0'" />
      </a-layout-content>
      <a-layout-footer class="mt-auto">
        <Footer />
      </a-layout-footer>
    </a-layout>
  </main>
</template>

<style scoped>
.ms-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  padding: 0 16px;

  .ms-header-title {
    /* 主标题 */
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    /* identical to box height, or 133% */
    letter-spacing: -0.01em;
    /* 主色/主色-1 */
    color: #1890ff;
  }
}

.arco-layout-header {
  height: 64px;
  line-height: 64px;
  background: #fff;
}

.arco-layout-footer {
  padding: 0;
  background: transparent;
}

.arco-layout-content {
  background: #fff;
}
</style>
