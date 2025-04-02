<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { findMatchingHandler } from './index'
import { stateExtension } from '~/logic/storage'

const currentHandler = ref()
const authorInfo = ref()
const DynamicComponent = ref()

onMounted(async () => {
  const url = stateExtension.value.url
  if (!url) {
    return
  }
  const handler = await findMatchingHandler(url)
  if (handler) {
    currentHandler.value = handler
    authorInfo.value = handler.author()
    DynamicComponent.value = await handler.getView()
  }
})
</script>

<template>
  <main class="domain-container">
    <!-- 上半部分：插件作者信息 -->
    <section v-if="authorInfo" class="author-section">
      <div class="author-info">
        <img
          v-if="authorInfo.avatar"
          :src="authorInfo.avatar"
          class="author-avatar"
          :alt="authorInfo.name"
        >
        <h2 class="author-name">
          {{ authorInfo.name }}
        </h2>
        <p v-if="authorInfo.description" class="author-description">
          {{ authorInfo.description }}
        </p>
        <div class="author-links">
          <a
            v-if="authorInfo.github"
            :href="authorInfo.github"
            target="_blank"
            class="author-link"
          >GitHub</a>
          <a
            v-if="authorInfo.website"
            :href="authorInfo.website"
            target="_blank"
            class="author-link"
          >Website</a>
          <a
            v-if="authorInfo.email"
            :href="`mailto:${authorInfo.email}`"
            class="author-link"
          >Email</a>
        </div>
      </div>
    </section>

    <!-- 下半部分：动态渲染匹配到的页面 -->
    <section class="content-section">
      <component :is="DynamicComponent" v-if="DynamicComponent" />
      <div v-else class="no-content">
        <p>未找到匹配的页面组件</p>
      </div>
    </section>
  </main>
</template>

<style lang="less" scoped>
.domain-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.author-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  .author-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 12px;
  }

  .author-name {
    font-size: 1.5rem;
    margin: 0 0 8px;
  }

  .author-description {
    color: #6c757d;
    margin: 0 0 16px;
  }

  .author-links {
    display: flex;
    gap: 16px;

    .author-link {
      color: #0d6efd;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.content-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.no-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6c757d;
}
</style>
