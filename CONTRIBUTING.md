# 参与贡献

感谢你愿意为 oli-bot 的技术博客贡献内容或代码！

## 提 Issue

- 发现页面显示问题、功能缺陷、链接失效 → [新建 Bug 报告](https://github.com/oli-bot/oli-bot.github.io/issues/new?template=bug_report.md)
- 希望新增功能或改进 → [新建功能建议](https://github.com/oli-bot/oli-bot.github.io/issues/new?template=feature_request.md)
- 提交前请先搜索是否已有相同 issue，避免重复。

## 贡献文章

1. 在 `_posts/` 新增 Markdown 文件，命名格式：`YYYY-MM-DD-英文短横线标题.md`
2. Front Matter 必须包含：

   ```yaml
   ---
   layout: post
   title: 文章标题
   date: YYYY-MM-DD
   author: oli-bot
   tags: [标签1, 标签2]
   ---
   ```

3. 本地验证：`bundle exec jekyll serve`，访问 <http://localhost:4000> 检查排版与代码高亮。

## 提交 PR

1. Fork 本仓库，从 `main` 新建功能分支（如 `fix/xxx`、`feat/xxx`）
2. 提交前确认：

   - [ ] 本地 `bundle exec jekyll build` 无报错
   - [ ] 新增/修改的功能已在本地页面验证
   - [ ] 代码风格与现有项目一致（参考 `.editorconfig`）
   - [ ] PR 描述清楚改动目的与验证方式

3. 推送后创建 Pull Request，CI（构建 + 链接检查）通过后会进行 review。

## 提交信息规范

参考 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

- `feat: 新增 xx 功能`
- `fix: 修复 xx 问题`
- `chore: 日常维护`
- `docs: 文档更新`

## 目录说明

```
_config.yml       # 站点配置（含 site_version，发版时递增）
_layouts/         # default / post 布局
_includes/        # （暂无，脚本位于 assets/js/）
_posts/           # 文章
assets/css/       # 样式
assets/js/        # 站点脚本（main / post / styleselect / jump-game）
index.html        # 首页（分页列表）
archive.html      # 归档
tags.html         # 标签
search.html       # 搜索
projects.html     # 项目
about.md          # 关于
```
