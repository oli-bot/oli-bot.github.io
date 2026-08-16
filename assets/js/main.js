// ===== 站点通用脚本：阅读进度 / 代码复制 / 图片灯箱 / 目录高亮 / 主题切换 / 提示块 =====
(function() {
  'use strict';

  // ===== 1. 阅读进度条 =====
  const progressBar = document.getElementById('reading-progress-bar');

  function updateReadingProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateReadingProgress);
  updateReadingProgress();

  // ===== 1.5 移动端悬浮按钮：向下滚动隐藏、向上滚动恢复（避免遮挡内容） =====
  let lastScrollY = window.scrollY;
  let scrollTicking = false;

  function updateFloatButtons() {
    const y = window.scrollY;
    const delta = y - lastScrollY;
    lastScrollY = y;
    // 向下滚动超过 8px 且非页面顶部 → 隐藏；向上滚动或回到顶部 → 显示
    if (delta > 8 && y > 80) {
      document.body.classList.add('scrolling-down');
    } else if (delta < -8 || y <= 80) {
      document.body.classList.remove('scrolling-down');
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateFloatButtons);
      scrollTicking = true;
    }
  }, { passive: true });

  // ===== 2. 代码复制按钮 =====
  document.querySelectorAll('.post-content pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.textContent = '复制';

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || pre.textContent;

      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = '复制';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        btn.textContent = '复制失败';
        setTimeout(() => btn.textContent = '复制', 2000);
      }
    });

    pre.appendChild(btn);
  });

  // ===== 3. 图片灯箱效果 + 懒加载（灯箱图片在首次点击时才创建，页面不常驻 <img>） =====
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    // 可访问性：dialog 语义 + 焦点管理（Esc 关闭、打开聚焦关闭按钮、关闭恢复焦点）
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', '图片预览');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    if (lightboxClose) lightboxClose.setAttribute('tabindex', '-1');

    let lightboxImg = null;
    let lastFocused = null;

    function openLightbox(img) {
      if (!lightboxImg) {
        lightboxImg = document.createElement('img');
        lightbox.appendChild(lightboxImg);
      }
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement;
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.removeAttribute('src');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        lastFocused = null;
      }
    }

    document.querySelectorAll('.post-content img').forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('click', () => openLightbox(img));
    });

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ===== 4. 目录高亮跟随 =====
  const tocLinks = document.querySelectorAll('.toc-content a');
  const headings = document.querySelectorAll('.post-content h2, .post-content h3');

  if (tocLinks.length > 0 && headings.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.5 });

    headings.forEach(heading => observer.observe(heading));
  }

  // ===== 5. 主题切换 =====
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  // 5.2 Giscus 评论主题跟随切换
  function setGiscusTheme() {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage({
      giscus: { setConfig: { theme: html.getAttribute('data-theme') !== 'light' ? 'dark' : 'light' } }
    }, 'https://giscus.app');
  }

  // giscus iframe 就绪前发送的消息会被丢弃：等它首次回信后再应用主题
  let giscusPending = true;
  window.addEventListener('message', e => {
    if (e.origin === 'https://giscus.app' && e.data && e.data.giscus) {
      if (giscusPending) {
        giscusPending = false;
        setGiscusTheme();
      }
    }
  });

  themeToggle.addEventListener('click', function() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    giscusPending = true;
    setGiscusTheme();
  });

  // ===== 6. GitHub 风格提示块（> [!NOTE] / [!TIP] / [!WARNING] 等） =====
  document.querySelectorAll('.post-content blockquote').forEach(bq => {
    const firstP = bq.querySelector('p:first-child');
    if (!firstP) return;
    const match = firstP.textContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
    if (!match) return;
    bq.classList.add('callout', 'callout-' + match[1].toLowerCase());
    firstP.innerHTML = firstP.innerHTML.replace(/^\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
  });
})();
