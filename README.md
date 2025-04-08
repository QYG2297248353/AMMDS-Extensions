# AMMDS Extension (AMMDS 助手)

AMMDS（Adult Movie MetaData Scraper）是一款私人专属数据管理平台，专注于帮助用户轻松管理和整理个人影视库。通过智能刮削元数据、演员识别、多源数据匹配等功能，打造专属的家庭影院体验。点击前往：[AMMDS仓库](https://github.com/QYG2297248353/AMMDS-Docker)

## 简介

AMMDS 助手是一个用于辅助 AMMDS 工作的浏览器扩展，旨在简化 AMMDS 的使用流程。

## 功能

- 浏览站点，快捷将页面元数据导入 AMMDS。
- 一键 `订阅`, `收藏` 影视。
- 自动化操作，自动化操作页面，批量导入元数据。

## 加入开发

1. 克隆或下载此仓库到本地。
2. 安装项目依赖：

```bash
pnpm install
```

3. 启动项目：

```bash
npm dev
```

4. 打开 Chrome 浏览器，进入扩展程序页面 (chrome://extensions/)。
5. 启用开发者模式。
6. 点击“加载已解压的扩展程序”按钮，选择构建后的 extension 文件夹 (extension)。

### 目录说明

- `extension`: 扩展程序的主要代码和资源。
- `src`: 扩展程序的源代码。
- `scripts`: 脚本。
- `src\manifest.ts`: 扩展程序的配置文件。
- `package.json`: 项目的配置文件。
- `tsconfig.json`: TypeScript 配置文件。
- `README.md`: 项目的说明文档。
- `src\domain`: 开发目录 (主要)。

### 开发流程

1. 开发功能：在 `src\domain` 目录下添加新的功能模块。
   假如你要完成对`javbus.com`的支持，你可以在`src\domain`下新建一个文件夹。
   顶级域名：`com`
   二级域名：`javbus`
   这样你就可以在`src\domain\com\javbus`下开发你的功能了。

2. 注册服务：在`src\domain\com\javbus`下你需要新建一个`index.ts`文件，
   这个文件是用来注册你的服务的。
   你需要在`src\domain\com\javbus\index.ts`中默认导出。
   这个类是用来注册你的服务的。

```ts
// 导入AMMDS的类型
import type { AuthorMetadata, MovieMetadata } from '../../index'

// 导出javbus域名处理器
export default {
  // 根据传入的参数判断是否匹配 并返回结果
  matchDomain: (url: string): boolean => {
  },

  // 获取电影元数据 并返回结果
  getMovieMetadata: async (): MovieMetadata => {
  },

  // 自动化处理函数 通过回调函数将结果返回给AMMDS
  automate: async (callback: (data: MovieMetadata) => Promise<void>) => {
  },

  // 插件开发作者信息
  author: (): AuthorMetadata => {
  },

  // 获取视图组件 并返回结果
  getView: async () => {
  },
}
```

3. 侧边栏页面：在`src\domain\com\javbus\views`下你需要新建一个`index.vue`文件，
   这个文件是用来渲染你的侧边栏页面的。
   注意：你需要在`src\domain\com\javbus\index.ts`中的`getView`导出该文件。

```ts
// 获取视图组件
getView: async () => {
  const component = await import('./view/index.vue')
  return component.default
}
```

4. 调用消息通知：在不通目录下调用的消息通知是不同的。
   在`src\domain\com\javbus\index.ts`中，您可以调用 `src\domain\message.ts` 中的 `message` 函数。
   在`src\domain\com\javbus\views\index.vue`中，您可以调用 `@arco-design/web-vue` 中的消息通知。

5. 提交项目：主仓库仅接受 PR 请求。请勿修改 `src\domain` 之外的文件。
以下文件也不可以修改：
- `src\domain\Domain.vue`
- `src\domain\index.ts`
- `src\domain\message.ts`

6. 独立发布：您可以选择独立发布您的扩展程序。
