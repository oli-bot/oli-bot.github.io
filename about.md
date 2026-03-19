---
layout: default
title: 关于
permalink: /about/
---

<div class="about-page">
  <div class="about-header">
    <div class="about-avatar">👨‍💻</div>
    <h1 class="about-title">关于我</h1>
    <p class="about-subtitle">热爱技术，热爱生活</p>
  </div>
  
  <div class="about-content">
    <section class="about-section">
      <h2>👋 你好！</h2>
      <p>欢迎来到我的博客！我是一名热爱技术的开发者，专注于后端开发和系统架构设计。</p>
      <p>这个博客主要记录我的技术学习心得、项目经验和对技术的思考。希望这些内容能对你有所帮助。</p>
    </section>
    
    <section class="about-section">
      <h2>🛠️ 技术栈</h2>
      <div class="tech-stack">
        <div class="tech-category">
          <h3>后端开发</h3>
          <div class="tech-tags">
            <span class="tech-tag">Go</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Java</span>
            <span class="tech-tag">C#</span>
            <span class="tech-tag">Node.js</span>
          </div>
        </div>
        <div class="tech-category">
          <h3>数据库</h3>
          <div class="tech-tags">
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">MySQL</span>
            <span class="tech-tag">Redis</span>
            <span class="tech-tag">MongoDB</span>
          </div>
        </div>
        <div class="tech-category">
          <h3>云原生 & DevOps</h3>
          <div class="tech-tags">
            <span class="tech-tag">Docker</span>
            <span class="tech-tag">Kubernetes</span>
            <span class="tech-tag">CI/CD</span>
            <span class="tech-tag">Linux</span>
          </div>
        </div>
        <div class="tech-category">
          <h3>其他</h3>
          <div class="tech-tags">
            <span class="tech-tag">Git</span>
            <span class="tech-tag">API 设计</span>
            <span class="tech-tag">微服务</span>
            <span class="tech-tag">分布式系统</span>
          </div>
        </div>
      </div>
    </section>
    
    <section class="about-section">
      <h2>🎯 兴趣爱好</h2>
      <ul class="interests-list">
        <li>💻 技术探索与开源项目</li>
        <li>📚 历史文化与人文地理</li>
        <li>🌍 旅行与摄影</li>
        <li>🎮 游戏与科技产品</li>
      </ul>
    </section>
    
    <section class="about-section">
      <h2>🔗 社交链接</h2>
      <div class="social-links">
        <a href="https://github.com/oli-bot" class="social-link" target="_blank" rel="noopener">
          <span class="social-icon">GitHub</span>
          <span class="social-name">@oli-bot</span>
        </a>
        <a href="https://oli-bot.github.io" class="social-link">
          <span class="social-icon">博客</span>
          <span class="social-name">oli-bot.github.io</span>
        </a>
        <a href="{{ "/feed.xml" | relative_url }}" class="social-link">
          <span class="social-icon">RSS</span>
          <span class="social-name">订阅博客</span>
        </a>
      </div>
    </section>
    
    <section class="about-section">
      <h2>📫 联系我</h2>
      <p>如果你有任何问题或建议，欢迎通过以下方式联系我：</p>
      <ul class="contact-list">
        <li>在博客文章下留言</li>
        <li>在 <a href="https://github.com/oli-bot">GitHub</a> 上提 Issue 或 PR</li>
      </ul>
    </section>
  </div>
</div>

<style>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 50px;
}

.about-avatar {
  font-size: 5rem;
  margin-bottom: 20px;
}

.about-title {
  margin: 0 0 10px;
  font-size: 2rem;
}

.about-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
  margin: 0;
}

.about-content {
  animation: fadeIn 0.5s ease-out;
}

.about-section {
  margin-bottom: 40px;
}

.about-section h2 {
  color: var(--primary-color);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color);
}

.about-section p {
  line-height: 1.8;
  color: var(--text-color);
}

.tech-stack {
  display: grid;
  gap: 20px;
}

.tech-category h3 {
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 10px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
  transition: all 0.2s;
}

.tech-tag:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.interests-list {
  list-style: none;
  padding: 0;
}

.interests-list li {
  padding: 10px 0;
  color: var(--text-color);
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s;
}

.social-link:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.social-icon {
  font-weight: 600;
  color: var(--primary-color);
}

.social-name {
  color: var(--text-light);
  font-size: 0.9rem;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  padding: 8px 0;
}

.contact-list a {
  color: var(--primary-color);
}

@media (max-width: 600px) {
  .about-avatar {
    font-size: 4rem;
  }
  
  .about-title {
    font-size: 1.5rem;
  }
  
  .social-links {
    flex-direction: column;
  }
}
</style>
