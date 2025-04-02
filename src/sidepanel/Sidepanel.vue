<script setup lang="ts">
import Domain from '~/domain/Domain.vue'
</script>

<template>
  <main class="sidepanel-container">
    <!-- 内部页面由匹配页面提供 -->
    <div class="content-area">
      <Domain />
    </div>

    <!-- 底部信息 -->
    <div class="footer-container">
      <Footer />
    </div>
  </main>
</template>

<style lang="less" scoped>
.sidepanel-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  position: relative;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  width: 100%;
}

.footer-container {
  width: 100%;
  background-color: #f8f8f8;
}
</style>
