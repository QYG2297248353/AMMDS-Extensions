<script setup lang="ts">
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="footer-copyright">
    <div class="copyright-studio">
      © 2024-2025
      <br>
      <a href="https://blog.lifebus.top/" target="_blank">
        新疆萌森软件开发工作室
      </a>
      提供技术支持
    </div>
    <div class="copyright-btn-group">
      <div class="copyright-links">
        <a
          @click="openOptionsPage"
        >
          配置
        </a>
        <span class="divider">|</span>
        <a
          href="https://github.com/QYG2297248353/AMMDS-Extensions/issues/new/choose"
          target="_blank"
        >
          反馈
        </a>
        <span class="divider">|</span>
        <a href="https://ammds.lifebus.top/" target="_blank"> 官网 </a>
        <span class="divider">|</span>
        <a href="https://t.me/+OgCuWhS93zczZjhl" target="_blank"> Telegram </a>
        <span class="divider">|</span>
        <a href="https://qm.qq.com/q/dZ0wTXdFCw" target="_blank"> QQ </a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer-copyright {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 12px;
  line-height: 1.5;
  gap: 10px;

  .copyright-studio {
    font-weight: 400;
  }

  .copyright-btn-group {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 4px;

    .copyright-links {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    a {
      color: #666;
      text-decoration: none;
      font-weight: 300;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .divider {
      color: #999;
      margin: 0 2px;
      font-weight: 300;
    }
  }
}
</style>
