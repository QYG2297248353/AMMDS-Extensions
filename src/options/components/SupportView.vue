<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  company: '',
  name: '',
  contact: '',
  message: '',
})

function submitForm() {
  // TODO: 实现表单提交逻辑
  console.warn('Form submitted:', form.value)
}
</script>

<template>
  <div class="content-container">
    <h1 class="text-2xl font-bold mb-6 text-center">
      支持 AMMDS 项目
    </h1>
    <p class="text-lg mb-4 text-center max-w-3xl mx-auto text-gray-600">
      AMMDS 是一个完全自主化开发的项目，旨在为影视数据分析和研究提供轻量级、高效、易用的自动化工具。
    </p>
    <p class="text-lg mb-8 text-center max-w-3xl mx-auto text-gray-600">
      我们希望通过您的支持，持续优化性能、丰富功能、完善文档，并保障服务器的持续运行。
    </p>
    <div class="pricing-section mb-12">
      <h2 class="text-xl font-bold mb-6 text-center">
        捐赠等级说明
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a-card class="pricing-card bg-gradient-to-br from-green-50 to-white">
          <template #title>
            <div class="flex items-center justify-center gap-2 text-green-600">
              🌱 小芽赞助
            </div>
          </template>
          <div class="text-center">
            <div class="text-2xl font-bold mb-4 text-green-600">
              ¥5/月
            </div>
            <ul class="text-left space-y-3 text-gray-600">
              <li class="flex items-center gap-2">
                <icon-check class="text-green-500" /> 感谢邮件
              </li>
              <li class="flex items-center gap-2">
                <icon-check class="text-green-500" /> 可选显示昵称
              </li>
            </ul>
          </div>
        </a-card>
        <a-card class="pricing-card bg-gradient-to-br from-blue-50 to-white">
          <template #title>
            <div class="flex items-center justify-center gap-2 text-blue-600">
              ☕️ 一杯咖啡赞助
            </div>
          </template>
          <div class="text-center">
            <div class="text-2xl font-bold mb-4 text-blue-600">
              ¥15/月
            </div>
            <ul class="text-left space-y-3 text-gray-600">
              <li class="flex items-center gap-2">
                <icon-check class="text-blue-500" /> 项目首页鸣谢
              </li>
              <li class="flex items-center gap-2">
                <icon-check class="text-blue-500" /> 可选显示昵称
              </li>
            </ul>
          </div>
        </a-card>
        <a-card class="pricing-card bg-gradient-to-br from-purple-50 to-white">
          <template #title>
            <div class="flex items-center justify-center gap-2 text-purple-600">
              🚀 超级赞助
            </div>
          </template>
          <div class="text-center">
            <div class="text-2xl font-bold mb-4 text-purple-600">
              ¥88+/月
            </div>
            <ul class="text-left space-y-3 text-gray-600">
              <li class="flex items-center gap-2">
                <icon-check class="text-purple-500" /> 首页鸣谢
              </li>
              <li class="flex items-center gap-2">
                <icon-check class="text-purple-500" /> 优先 issue 处理
              </li>
              <li class="flex items-center gap-2">
                <icon-check class="text-purple-500" /> 专属交流群
              </li>
            </ul>
          </div>
        </a-card>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="cooperation-section">
        <h2 class="text-xl font-bold mb-6">
          项目合作
        </h2>
        <a-card class="cooperation-card bg-gradient-to-br from-orange-50 to-white mb-4">
          <template #title>
            <div class="flex items-center gap-2 text-orange-600">
              <icon-trophy class="text-xl" />
              商业合作
            </div>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              我们欢迎各类商业合作机会，包括但不限于：
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>定制开发</li>
              <li>技术咨询</li>
              <li>数据服务</li>
              <li>广告投放</li>
            </ul>
          </div>
        </a-card>
        <a-card class="cooperation-card bg-gradient-to-br from-teal-50 to-white">
          <template #title>
            <div class="flex items-center gap-2 text-teal-600">
              <icon-code class="text-xl" /> 开源贡献
            </div>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              欢迎参与项目开发，您可以通过以下方式贡献：
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>提交 Pull Request</li>
              <li>反馈 Bug</li>
              <li>完善文档</li>
              <li>分享使用经验</li>
            </ul>
          </div>
        </a-card>
      </div>
      <div class="contact-section grid grid-cols-1 gap-6">
        <h2 class="text-xl font-bold mb-6">
          联系我们
        </h2>
        <a-card class="contact-card bg-gradient-to-br from-cyan-50 to-white mb-6">
          <template #title>
            <div class="flex items-center gap-2 text-cyan-600">
              <icon-customer-service class="text-xl" /> 联系方式
            </div>
          </template>
          <div class="space-y-6">
            <div class="contact-info space-y-4">
              <div class="contact-item">
                <icon-email class="text-cyan-500 text-xl" />
                <span class="text-gray-600">邮箱：blog@lifebus.top</span>
              </div>
              <div class="social-links flex justify-center gap-4">
                <a-button type="outline" shape="circle" class="hover:text-blue-500 hover:border-blue-500">
                  <template #icon>
                    <icon-github />
                  </template>
                </a-button>
                <a-button type="outline" shape="circle" class="hover:text-green-500 hover:border-green-500">
                  <template #icon>
                    <icon-wechat />
                  </template>
                </a-button>
                <a-button type="outline" shape="circle" class="hover:text-blue-500 hover:border-blue-500">
                  <template #icon>
                    <icon-qq />
                  </template>
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
        <a-card class="contact-card bg-gradient-to-br from-cyan-50 to-white">
          <template #title>
            <div class="flex items-center gap-2 text-cyan-600">
              <icon-message class="text-xl" /> 意向合作
            </div>
          </template>
          <div class="space-y-6">
            <a-form :model="form" class="contact-form">
              <a-form-item field="name" label="姓名" required>
                <a-input v-model="form.name" placeholder="请输入您的姓名" />
              </a-form-item>
              <a-form-item field="company" label="公司">
                <a-input v-model="form.company" placeholder="请输入您的公司名称（选填）" />
              </a-form-item>
              <a-form-item field="contact" label="联系方式" required>
                <a-input v-model="form.contact" placeholder="请输入您的联系方式" />
              </a-form-item>
              <a-form-item field="message" label="留言" required>
                <a-textarea v-model="form.message" placeholder="请输入您的留言内容" />
              </a-form-item>
              <div class="text-right">
                <a-button type="primary" long @click="submitForm">
                  提交
                </a-button>
              </div>
            </a-form>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-links {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.pricing-card,
.cooperation-card,
.contact-card {
  @apply shadow-md rounded-lg overflow-hidden;
  transition: all 0.3s ease;
}

.pricing-card:hover,
.cooperation-card:hover,
.contact-card:hover {
  @apply shadow-lg transform -translate-y-1;
}

.contact-form {
  @apply mt-6;
}
</style>
