# oli-bot 的技术博客

后端开发 | 科技 | 历史文化 —— 基于 [GitHub Pages](https://pages.github.com) + Jekyll 的静态博客。

在线地址：<https://oli-bot.github.io>

## 功能特性

- Jekyll + minima 主题，GitHub Pages 官方支持的插件（feed / seo-tag / sitemap / paginate）
- 阅读进度条、代码一键复制、图片灯箱、目录高亮跟随
- 深色/浅色主题切换（localStorage 记忆 + 评论与代码高亮联动）
- 文章翻页导航、字数统计、社交分享（微博 / Twitter / 微信二维码）
- Giscus 评论系统（基于 GitHub Discussions）
- 全文搜索、标签归档、项目展示
- GitHub Actions 自动构建部署

## 本地开发

需要 Ruby 3.x 和 Bundler：

```bash
bundle install
bundle exec jekyll serve
```

然后访问 <http://localhost:4000>。

## 发布流程

1. 在 `_posts/` 新增 Markdown 文章（文件名格式 `YYYY-MM-DD-title.md`，含 Front Matter：`layout: post`、`title`、`tags`）
2. 推送到 `main` 分支
3. `.github/workflows/pages.yml` 自动构建并部署

## 目录结构

```
_config.yml      # 站点配置
_layouts/        # default / post 布局
_posts/          # 文章
assets/          # 样式与图片
index.html       # 首页（分页列表）
archive.html     # 归档
tags.html        # 标签
search.html      # 搜索
projects.html    # 项目
about.md         # 关于
```
