# oli-bot 的技术博客

后端开发 | 科技 | 历史文化 —— 基于 [GitHub Pages](https://pages.github.com) + Jekyll 的静态博客。

在线地址：<https://oli-bot.github.io>

## 功能特性

- Jekyll + minima 主题，GitHub Pages 官方支持的插件（feed / seo-tag / sitemap / paginate）
- 阅读进度条、代码一键复制、图片灯箱（Esc 关闭）、目录高亮跟随
- 深色/浅色主题切换（localStorage 记忆 + 评论与代码高亮联动）
- `/styleselect` 风格选择器：11 种可切换风格（终端风 / 纸墨杂志 / 午夜极光 / 琥珀 CRT / 海洋清风 / 赛博霓虹 / 暖阳极简 / 黑白印刷 / 樱花和风 / 森林松木 / 星际深空），快捷键 `/` 打开面板，悬停预览、点击生效并记忆
- 文章翻页导航、字数与阅读时间统计（按字符数，适配中文）、社交分享（微博 / Twitter / 微信二维码）
- 相关阅读推荐、文章更新时间自动标注
- Giscus 评论系统（基于 GitHub Discussions）
- 全文搜索（输入防抖）、标签归档、项目展示
- GitHub Actions 自动构建部署 + 链接检查（htmlproofer）

## 本地开发

需要 Ruby 3.x 和 Bundler。项目提供 `.tool-versions`，推荐用 [mise](https://mise.jdx.dev) 管理 Ruby 版本：

```bash
mise install          # 安装 .tool-versions 声明的 Ruby 版本
bundle install
bundle exec jekyll serve
```

然后访问 <http://localhost:4000>。（不使用 mise 的话，自备 Ruby 3.x + Bundler 2.5+ 亦可）

## 发布流程

1. 在 `_posts/` 新增 Markdown 文章（文件名格式 `YYYY-MM-DD-title.md`，含 Front Matter：`layout: post`、`title`、`tags`）
2. 推送到 `main` 分支（或提 PR）
3. `.github/workflows/check.yml` 自动做构建 + 死链检查
4. `.github/workflows/pages.yml` 自动构建并部署

发版时记得递增 `_config.yml` 中的 `site_version`（顶栏版本号 + 静态资源缓存失效标识）。

## 目录结构

```
_config.yml      # 站点配置（含 site_version）
_layouts/        # default / post 布局
_posts/          # 文章
assets/css/      # 样式（style.css）
assets/js/       # 脚本（main / post / styleselect / jump-game）
index.html       # 首页（分页列表）
archive.html     # 归档
tags.html        # 标签
search.html      # 搜索
projects.html    # 项目
about.md         # 关于
3d-galaxy.html   # 3D 太阳系演示（纯演示，不入 sitemap）
jump-game.html   # 横版跳跃游戏 demo（纯演示，不入 sitemap）
```

## 贡献

欢迎提 Issue 和 PR，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE) © oli-bot
