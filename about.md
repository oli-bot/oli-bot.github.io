---
layout: default
title: 关于
permalink: /about/
---

<div class="about-page">
  <section class="about-hero">
    <div class="hero-avatar">👨‍💻</div>
    <p class="hero-path">~/about</p>
    <h1 class="hero-title">&gt; whoami<span class="hero-cursor"></span></h1>
    <p class="hero-sub">梁安邦 · 热爱技术的开发者 · 后端开发与系统架构</p>
    <div class="hero-badges">
      <img src="https://img.shields.io/github/followers/oli-bot?style=for-the-badge&label=GitHub%20Followers&color=2563eb" alt="GitHub Followers">
      <img src="https://img.shields.io/badge/Backend-Go%20%2F%20Python-3fb950?style=for-the-badge" alt="Backend">
      <img src="https://img.shields.io/badge/Blog-Jekyll-6e40c9?style=for-the-badge" alt="Blog">
      <img src="https://img.shields.io/badge/Status-Online-3fb950?style=for-the-badge" alt="Status">
    </div>
  </section>

  <section class="about-terminal" id="terminal">
    <div class="term-head">
      <div class="term-dots"><span></span><span></span><span></span></div>
      <div class="term-title">oli-bot@dev: ~/about — zsh</div>
      <button class="term-replay" id="term-replay" title="点击终端区域也可重播">↻ 重播</button>
    </div>
    <div class="term-body" id="term-body" aria-label="终端风格的自我介绍"></div>
  </section>

  <section class="about-section">
    <h2 class="sec-title"><span class="sec-prompt">~$</span> ls ~/skills</h2>
    <div class="skill-grid">
      <div class="skill-cat">
        <h3>后端开发</h3>
        <div class="skill-bar" style="--w:90%"><span>Go</span><div class="skill-fill"><i></i></div><b>90</b></div>
        <div class="skill-bar" style="--w:85%"><span>Python</span><div class="skill-fill"><i></i></div><b>85</b></div>
        <div class="skill-bar" style="--w:75%"><span>Java</span><div class="skill-fill"><i></i></div><b>75</b></div>
        <div class="skill-bar" style="--w:70%"><span>C#</span><div class="skill-fill"><i></i></div><b>70</b></div>
        <div class="skill-bar" style="--w:80%"><span>Node.js</span><div class="skill-fill"><i></i></div><b>80</b></div>
      </div>
      <div class="skill-cat">
        <h3>数据库</h3>
        <div class="skill-bar" style="--w:85%"><span>PostgreSQL</span><div class="skill-fill"><i></i></div><b>85</b></div>
        <div class="skill-bar" style="--w:80%"><span>MySQL</span><div class="skill-fill"><i></i></div><b>80</b></div>
        <div class="skill-bar" style="--w:75%"><span>Redis</span><div class="skill-fill"><i></i></div><b>75</b></div>
        <div class="skill-bar" style="--w:70%"><span>MongoDB</span><div class="skill-fill"><i></i></div><b>70</b></div>
      </div>
      <div class="skill-cat">
        <h3>云原生 &amp; DevOps</h3>
        <div class="skill-bar" style="--w:85%"><span>Docker</span><div class="skill-fill"><i></i></div><b>85</b></div>
        <div class="skill-bar" style="--w:70%"><span>Kubernetes</span><div class="skill-fill"><i></i></div><b>70</b></div>
        <div class="skill-bar" style="--w:80%"><span>CI/CD</span><div class="skill-fill"><i></i></div><b>80</b></div>
        <div class="skill-bar" style="--w:85%"><span>Linux</span><div class="skill-fill"><i></i></div><b>85</b></div>
      </div>
      <div class="skill-cat">
        <h3>其他</h3>
        <div class="skill-bar" style="--w:90%"><span>Git</span><div class="skill-fill"><i></i></div><b>90</b></div>
        <div class="skill-bar" style="--w:90%"><span>API 设计</span><div class="skill-fill"><i></i></div><b>90</b></div>
        <div class="skill-bar" style="--w:75%"><span>微服务</span><div class="skill-fill"><i></i></div><b>75</b></div>
        <div class="skill-bar" style="--w:75%"><span>分布式系统</span><div class="skill-fill"><i></i></div><b>75</b></div>
      </div>
    </div>
  </section>

  <section class="about-section">
    <h2 class="sec-title"><span class="sec-prompt">~$</span> cat ~/hobbies.txt</h2>
    <div class="hobby-chips">
      <span class="hobby-chip">💻 技术探索与开源项目</span>
      <span class="hobby-chip">📚 历史文化与人文地理</span>
      <span class="hobby-chip">🌍 旅行与摄影</span>
      <span class="hobby-chip">🎮 游戏与科技产品</span>
    </div>
  </section>

  <section class="about-section">
    <h2 class="sec-title"><span class="sec-prompt">~$</span> ./contact.sh</h2>
    <div class="social-links">
      <a href="https://github.com/oli-bot" class="social-link" target="_blank" rel="noopener">
        <span class="social-icon">GitHub</span>
        <span class="social-name">@oli-bot</span>
        <span class="social-arrow">→</span>
      </a>
      <a href="https://oli-bot.github.io" class="social-link">
        <span class="social-icon">博客</span>
        <span class="social-name">oli-bot.github.io</span>
        <span class="social-arrow">→</span>
      </a>
      <a href="{{ "/feed.xml" | absolute_url }}" class="social-link">
        <span class="social-icon">RSS</span>
        <span class="social-name">订阅博客</span>
        <span class="social-arrow">→</span>
      </a>
    </div>
    <ul class="contact-list">
      <li><span class="contact-prompt">&gt;_</span> 在博客文章下留言</li>
      <li><span class="contact-prompt">&gt;_</span> 在 <a href="https://github.com/oli-bot">GitHub</a> 上提 Issue 或 PR</li>
    </ul>
  </section>
</div>

<style>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}

/* ===== Hero ===== */
.about-hero {
  text-align: center;
  padding: 40px 0 50px;
  margin-bottom: 30px;
  border-bottom: 1px dashed var(--border-color);
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  border-radius: 12px;
}

.hero-avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 20px;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow);
  transform: rotate(-4deg);
  transition: transform 0.3s;
}

.hero-avatar:hover {
  transform: rotate(4deg) scale(1.05);
}

.hero-path {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 10px;
}

.hero-title {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 2.6rem;
  font-weight: 800;
  margin: 0 0 12px;
  color: var(--primary-color);
  background: linear-gradient(120deg, var(--primary-color), #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.15em;
  margin-left: 6px;
  background: var(--primary-color);
  vertical-align: -3px;
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink { 50% { opacity: 0; } }

.hero-sub {
  color: var(--text-light);
  font-size: 1.05rem;
  margin-bottom: 24px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.hero-badges img {
  border-radius: 6px;
}

/* ===== 终端 ===== */
.about-terminal {
  margin-bottom: 50px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #30363d;
  background: #0d1117;
  box-shadow: 0 0 50px rgba(63, 185, 80, 0.12), var(--shadow);
  animation: fadeIn 0.6s ease-out;
}

.term-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}

.term-dots {
  display: flex;
  gap: 6px;
}

.term-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.term-dots span:nth-child(1) { background: #ff5f57; }
.term-dots span:nth-child(2) { background: #febc2e; }
.term-dots span:nth-child(3) { background: #28c840; }

.term-title {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  color: #8b949e;
  flex: 1;
  text-align: center;
}

.term-replay {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  color: #3fb950;
  background: transparent;
  border: 1px solid #3fb950;
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s, background 0.2s;
}

.term-done .term-replay {
  opacity: 1;
  pointer-events: auto;
}

.term-replay:hover {
  background: rgba(63, 185, 80, 0.15);
}

.term-body {
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.9;
  color: #e6edf3;
  min-height: 260px;
  cursor: text;
  overflow-x: auto;
}

.term-line { white-space: pre-wrap; word-break: break-all; }

.term-prompt { color: #3fb950; font-weight: 700; }

.term-cmd { color: #7ee787; }

.term-out { color: #9da7b3; }

.term-url { color: #58a6ff; }

.term-done-line { color: #d29922; }

.term-sep { height: 1px; background: #21262d; margin: 8px 0; }

.term-cursor-line { color: #3fb950; }

.term-cursor {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  background: #3fb950;
  vertical-align: -2px;
  animation: blink 1s steps(1) infinite;
}

/* ===== 通用区块 ===== */
.about-section {
  margin-bottom: 50px;
}

.sec-title {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-color);
}

.sec-prompt {
  color: #3fb950;
  margin-right: 8px;
}

/* ===== 技能条 ===== */
.skill-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.skill-cat h3 {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.skill-bar {
  display: grid;
  grid-template-columns: 92px 1fr 30px;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
}

.skill-bar > span { color: var(--text-color); }

.skill-bar .skill-fill {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.skill-bar .skill-fill i {
  position: absolute;
  inset: 0;
  width: 0;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--primary-color), #7c3aed);
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.skill-bar.visible .skill-fill i { width: var(--w); }

.skill-bar > b {
  color: var(--text-light);
  font-size: 0.75rem;
  text-align: right;
}

/* ===== 兴趣 ===== */
.hobby-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hobby-chip {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
  transition: all 0.2s;
  cursor: default;
}

.hobby-chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* ===== 社交链接 ===== */
.social-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 24px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 14px 18px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.social-link:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.social-icon { font-weight: 700; color: var(--primary-color); }

.social-name {
  color: var(--text-light);
  font-size: 0.85rem;
  flex: 1;
}

.social-arrow {
  color: var(--text-light);
  transition: transform 0.2s, color 0.2s;
}

.social-link:hover .social-arrow {
  transform: translateX(4px);
  color: var(--primary-color);
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  padding: 8px 0;
  color: var(--text-color);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
}

.contact-prompt { color: #3fb950; margin-right: 8px; font-weight: 700; }

.contact-list a { color: var(--primary-color); }

@media (max-width: 600px) {
  .hero-title { font-size: 1.9rem; }
  .skill-grid { grid-template-columns: 1fr; }
  .term-body { font-size: 0.78rem; }
  .term-title { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-cursor, .term-cursor { animation: none; }
  .skill-fill i { transition: none; }
}
</style>

<script>
(function() {
  var term = document.getElementById('term-body');
  var win = document.getElementById('terminal');
  var timers = [];
  var running = false;

  var SCRIPT = [
    { t: 'out', s: 'last login: ' + new Date().toLocaleString('zh-CN') + ' on tty001' },
    { t: 'sep' },
    { t: 'cmd', s: 'whoami' },
    { t: 'out', s: '梁安邦 · oli-bot' },
    { t: 'out', s: '热爱技术的开发者，专注后端开发与系统架构设计' },
    { t: 'sep' },
    { t: 'cmd', s: 'cat ~/skills.txt' },
    { t: 'out', s: 'Languages: Go · Python · Java · C# · Node.js' },
    { t: 'out', s: 'Databases: PostgreSQL · MySQL · Redis · MongoDB' },
    { t: 'out', s: 'DevOps: Docker · Kubernetes · CI/CD · Linux' },
    { t: 'out', s: 'Others: Git · API 设计 · 微服务 · 分布式系统' },
    { t: 'sep' },
    { t: 'cmd', s: 'cat ~/hobbies.txt' },
    { t: 'out', s: '- 技术探索与开源项目' },
    { t: 'out', s: '- 历史文化与人文地理' },
    { t: 'out', s: '- 旅行与摄影' },
    { t: 'out', s: '- 游戏与科技产品' },
    { t: 'sep' },
    { t: 'cmd', s: './contact.sh --help' },
    { t: 'out', s: 'GitHub: ', u: 'https://github.com/oli-bot' },
    { t: 'out', s: 'Blog:   ', u: 'https://oli-bot.github.io' },
    { t: 'out', s: 'RSS:    ', u: 'https://oli-bot.github.io/feed.xml' },
    { t: 'sep' },
    { t: 'done', s: '✓ all systems operational · happy hacking' }
  ];

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function schedule(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
  }

  function run(instant) {
    if (running && !instant) return;
    clearTimers();
    term.innerHTML = '';
    running = true;
    win.classList.remove('term-done');
    var idx = 0;

    function emit(line) {
      if (line.t === 'sep') {
        var s = document.createElement('div');
        s.className = 'term-sep';
        term.appendChild(s);
        schedule(next, instant ? 0 : 200);
        return;
      }
      var el = document.createElement('div');
      el.className = 'term-line term-' + line.t;
      if (line.t === 'cmd') {
        var p = document.createElement('span');
        p.className = 'term-prompt';
        p.textContent = '$ ';
        el.appendChild(p);
      }
      var span = document.createElement('span');
      el.appendChild(span);
      if (line.u) {
        var u = document.createElement('a');
        u.className = 'term-url';
        u.textContent = line.u;
        u.href = line.u;
        u.target = '_blank';
        u.rel = 'noopener noreferrer';
        el.appendChild(u);
      }
      term.appendChild(el);
      term.scrollTop = term.scrollHeight;

      var chars = Array.from(line.s);
      var ci = 0;
      function type() {
        if (ci < chars.length) {
          span.textContent += chars[ci++];
          schedule(type, instant ? 0 : 24 + Math.random() * 55);
        } else {
          schedule(next, instant ? 0 : (line.p || 180));
        }
      }
      type();
    }

    function next() {
      if (idx >= SCRIPT.length) {
        var c = document.createElement('div');
        c.className = 'term-cursor-line';
        c.innerHTML = '<span class="term-cursor"></span>';
        term.appendChild(c);
        running = false;
        win.classList.add('term-done');
        return;
      }
      emit(SCRIPT[idx++]);
    }

    next();
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  run(reduced);

  document.getElementById('term-replay').addEventListener('click', function() {
    run(running ? true : false);
  });

  term.addEventListener('click', function() {
    run(running ? true : false);
  });

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar').forEach(function(b) { io.observe(b); });
})();
</script>
