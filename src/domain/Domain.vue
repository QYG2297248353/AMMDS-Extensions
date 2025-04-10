<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AuthorMetadata } from './types'
import { findMatchingHandler } from './index'
import { stateExtension } from '~/logic/storage'

const currentHandler = ref()
const authorInfo = ref()
const DynamicComponent = ref()

function getAvatarUrl(authorInfo: AuthorMetadata) {
  if (authorInfo.avatar && authorInfo.avatar.startsWith('http')) {
    return authorInfo.avatar
  }
  const githubUrl = authorInfo.github
  if (githubUrl) {
    const match = githubUrl.match(/github\.com\/([^/]+)/)
    if (match && match[1]) {
      return `https://github.com/${match[1]}.png`
    }
  }
  return 'https://github.com/identicons/guest.png'
}

function reCheck() {
  window.location.reload()
}

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
    <!-- 插件作者信息 -->
    <section v-if="authorInfo" class="author-section">
      <!-- 基础信息 -->
      <div class="author-info">
        <img
          :src="getAvatarUrl(authorInfo)"
          class="author-avatar"
          :alt="authorInfo.name"
        >
        <div class="author-info-right">
          <h2 class="author-name">
            {{ authorInfo.name }}
          </h2>
          <p v-if="authorInfo.description" class="author-description">
            {{ authorInfo.description }}
          </p>
        </div>
      </div>
      <!-- 快捷链接 -->
      <div class="author-links">
        <a
          v-if="authorInfo.github"
          :href="authorInfo.github"
          target="_blank"
          class="author-link"
        >
          <line-md:github-loop />
        </a>
        <a
          v-if="authorInfo.website"
          :href="authorInfo.website"
          target="_blank"
          class="author-link"
        >
          <gg:website />
        </a>
        <a
          v-if="authorInfo.email"
          :href="`mailto:${authorInfo.email}`"
          target="_blank"
          class="author-link"
        >
          <line-md:email-twotone />
        </a>
        <a
          v-if="authorInfo.telegram"
          :href="authorInfo.telegram"
          target="_blank"
          class="author-link"
        >
          <line-md:telegram />
        </a>
        <a
          v-if="authorInfo.twitter"
          :href="authorInfo.twitter"
          target="_blank"
          class="author-link"
        >
          <line-md:twitter-x />
        </a>
      </div>
    </section>

    <!-- 动态渲染匹配到的页面 -->
    <section class="content-section">
      <component :is="DynamicComponent" v-if="DynamicComponent" />
      <div v-else class="no-content">
        <p>未找到匹配的页面组件</p>
        <p class="re-check" @click="reCheck">
          重新检查
        </p>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 16px;

  .author-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 20px;
  }

  .author-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .author-avatar:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .author-avatar:active {
    transform: scale(0.65);
    transition: transform 0.2s;
  }

  .author-info-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;

    .author-name {
      font-size: 1.5rem;
    }

    .author-description {
      color: #6c757d;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .author-links {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 22px;
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
  flex-direction: column;
  gap: 10px;

  .re-check {
    cursor: pointer;
    color: #007bff;
  }
}
</style>
