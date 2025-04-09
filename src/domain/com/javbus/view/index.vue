<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

function importToday() {
  // TODO: 实现导入今日作品功能
  Message.info('敬请期待')
}

function openHomepage() {
  // TODO: 实现打开主页功能
  Message.info('敬请期待')
}

function openForum() {
  // TODO: 实现打开论坛功能
  Message.info('敬请期待')
}

function closePage() {
  // TODO: 实现关闭页面功能
  Message.info('敬请期待')
}
</script>

<template>
  <main class="sidebar-container">
    <!-- 卡片一 快捷操作按钮 -->
    <a-card class="action-card">
      <template #title>
        <div class="flex items-center gap-2 text-blue-600">
          <icon-select-all class="text-xl" />
          快捷操作
        </div>
      </template>
      <div class="button-grid">
        <a-button type="outline" @click="openHomepage">
          <template #icon>
            <icon-home />
          </template>
          打开主页
        </a-button>
        <a-button type="outline" @click="openForum">
          <template #icon>
            <icon-message />
          </template>
          打开论坛
        </a-button>
        <a-button type="primary" @click="importToday">
          <template #icon>
            <icon-download />
          </template>
          导入今日作品
        </a-button>
        <a-button status="danger" @click="closePage">
          <template #icon>
            <icon-close />
          </template>
          关闭页面
        </a-button>
      </div>
    </a-card>
  </main>
</template>

<style scoped>
.sidebar-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-card {
  width: 100%;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.arco-btn {
  width: 100%;
  height: 36px;
  transition: all 0.2s ease;
}

.arco-btn:hover {
  transform: scale(1.02);
}
</style>
