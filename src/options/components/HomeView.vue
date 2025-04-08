<template>
  <div class="content-container">
    <h1 class="text-2xl font-bold mb-6 text-center">
      欢迎使用 AMMDS - 个人影视数据管理平台
    </h1>
    <p class="text-lg mb-8 text-center max-w-3xl mx-auto text-gray-600">
      AMMDS
      是一款私人专属数据管理平台，专注于帮助用户轻松管理和整理个人影视库。通过智能刮削元数据、演员识别、多源数据匹配等功能，打造专属的家庭影院体验。
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a-card class="feature-card bg-gradient-to-br from-cyan-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <material-symbols:movie class="text-cyan-500" />
            影视管理
          </div>
        </template>
        <p class="text-gray-600">
          支持多种视频格式，自动刮削影片信息，提供封面、简介、评分等元数据，轻松管理个人影视库。
        </p>
      </a-card>
      <a-card class="feature-card bg-gradient-to-br from-pink-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <oui:app-users-roles class="text-pink-500" />
            演员识别
          </div>
        </template>
        <p class="text-gray-600">
          自动识别影视作品中的演员信息，提供详细的演员资料和作品列表，方便查找和浏览。
        </p>
      </a-card>
      <a-card class="feature-card bg-gradient-to-br from-orange-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <mdi:source-merge class="text-orange-500" />
            多源刮削
          </div>
        </template>
        <p class="text-gray-600">
          支持多个数据源获取影视信息，通过智能算法自动匹配本地文件与在线元数据，确保数据的全面性和准确性。
        </p>
      </a-card>
      <a-card class="feature-card bg-gradient-to-br from-blue-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <icon-park-solid:market-analysis class="text-blue-500" />
            数据分析
          </div>
        </template>
        <p class="text-gray-600">
          提供丰富的数据分析功能，包括观看历史统计、评分趋势、演员作品分布等，帮助您更好地了解自己的观影偏好。
        </p>
      </a-card>
      <a-card class="feature-card bg-gradient-to-br from-purple-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <fluent:share-48-filled class="text-purple-500" />
            影视分享
          </div>
        </template>
        <p class="text-gray-600">
          支持生成精美的观影报告和片单，方便与好友分享您的观影心得和推荐。支持多种社交平台一键分享。
        </p>
      </a-card>
      <a-card class="feature-card bg-gradient-to-br from-green-50 to-white">
        <template #title>
          <div class="flex items-center gap-2">
            <icon-code class="text-green-500" />
            插件集成
          </div>
        </template>
        <p class="text-gray-600">
          提供丰富的插件系统，支持自定义数据源、界面主题、数据导出等功能，让您的影视库管理更加个性化。
        </p>
      </a-card>
    </div>
    <div class="mt-12 text-center">
      <h2 class="text-xl font-bold mb-4">
        为什么选择 AMMDS
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div class="advantage-item">
          <div class="text-4xl mb-4 text-blue-500">
            🚀
          </div>
          <h3 class="font-bold mb-2">
            高效便捷
          </h3>
          <p class="text-gray-600">
            自动化处理，节省时间
          </p>
        </div>
        <div class="advantage-item">
          <div class="text-4xl mb-4 text-purple-500">
            🎯
          </div>
          <h3 class="font-bold mb-2">
            精准匹配
          </h3>
          <p class="text-gray-600">
            智能识别，准确率高
          </p>
        </div>
        <div class="advantage-item">
          <div class="text-4xl mb-4 text-green-500">
            🔒
          </div>
          <h3 class="font-bold mb-2">
            安全可靠
          </h3>
          <p class="text-gray-600">
            本地存储，隐私保护
          </p>
        </div>
        <div class="advantage-item">
          <div class="text-4xl mb-4 text-orange-500">
            🔄
          </div>
          <h3 class="font-bold mb-2">
            持续更新
          </h3>
          <p class="text-gray-600">
            功能迭代，体验升级
          </p>
        </div>
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

.feature-card {
  @apply shadow-md rounded-lg overflow-hidden;
  transition: all 0.3s ease;
}

.feature-card:hover {
  @apply shadow-lg transform -translate-y-1;
}

.advantage-item {
  @apply p-6 rounded-lg bg-white shadow-md text-center;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  @apply shadow-lg transform -translate-y-1;
}
</style>
