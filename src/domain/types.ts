// 插件作者信息元数据类型
export interface AuthorMetadata {
  // 作者姓名 (昵称, 用户名)
  name: string
  // GitHub 插件仓库链接
  github: string
  // 插件简介 (可选)
  description?: string
  // 头像链接 (可选)
  avatar?: string
  // 邮箱 (可选)
  email?: string
  // 社交链接 (可选, 个人主页)
  website?: string
  // 社交链接 (可选, Telegram)
  telegram?: string
  // 社交链接 (可选, Twitter)
  twitter?: string
}

// 影视元数据类型
export interface MovieMetadata {
  // 番号 (唯一标识、识别码)
  uniqueid: string
  // 其他番号
  numbers?: string[]
  // 影视源标题
  originalTitle: string
  // 影视中文标题
  titleCn?: string
  // 简介
  plot?: string
  // 中文简介
  plotCn?: string
  // 标语 (tagline)
  tagline?: string
  // 大纲 (outline)
  outline?: string
  // 评分 (10分制)
  rating?: number
  // 发行日期 (标准格式 YYYY-MM-DD)
  premiered?: string
  // 封面图 (文件列表 - 推荐)
  poster?: File[]
  // 封面图 (链接列表 - 可选)
  posterUrl?: string[]
  // 背景图 (文件列表 - 推荐)
  fanart?: File[]
  // 背景图 (链接列表 - 可选)
  fanartUrl?: string[]
  // 缩略图 (文件列表 - 推荐)
  thumb?: File[]
  // 缩略图 (链接列表 - 可选)
  thumbUrl?: string[]
  // 剧照 (文件列表 - 推荐)
  extrafanart?: File[]
  // 剧照 (链接列表 - 可选)
  extrafanartUrl?: string[]
  // 类型
  genres?: string[]
  // 标签
  tags?: string[]
  // 制作商
  studio?: string[]
  // 发行商
  issueStudio?: string[]
  // 时长 (分钟)
  runtime?: number
  // 语言
  languages?: string
  // 国家
  country?: string
  // 导演
  director?: string[]
  // 马赛克 (有码-true/无码-false)
  mosaic?: boolean
  // 系列
  series?: {
    // 系列名称
    name: string
    // 系列描述
    overview?: string
  }[]
  // 演员
  actors?: {
    // 演员名称
    name: string
    // 角色名称 (男优/女优 - 推荐)
    role?: string
    // 演员头像 (文件列表 - 推荐)
    thumb?: File[]
    // 演员头像 (链接列表 - 可选)
    thumbUrl?: string[]
  }[]
  // 链接 (数据源地址)
  links?: {
    // 链接名称
    name: string
    // 链接地址
    url: string
  }[]
  // 磁力链
  magnets?: {
    // 磁链名称
    name: string
    // 磁链地址
    url: string
    // 磁链大小 (字节 - 建议进行转换为字节)
    size: number
    // 磁链哈希 (便于去重)
    hash?: string
  }[]
}
