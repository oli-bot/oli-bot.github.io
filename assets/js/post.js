// ===== 文章页脚本：目录生成 / 返回顶部 / 社交分享 / 代码高亮 =====
(function() {
  'use strict';

  // ===== 1. 自动生成目录 + 返回顶部 =====
  document.addEventListener('DOMContentLoaded', function() {
    const postContent = document.querySelector('.post-content');
    const tocContent = document.querySelector('.toc-content');

    if (postContent && tocContent) {
      const headings = postContent.querySelectorAll('h2, h3');
      if (headings.length > 0) {
        const ul = document.createElement('ul');
        headings.forEach((heading, index) => {
          const id = 'heading-' + index;
          heading.id = id;

          const li = document.createElement('li');
          li.className = heading.tagName.toLowerCase();

          const a = document.createElement('a');
          a.href = '#' + id;
          a.textContent = heading.textContent;

          li.appendChild(a);
          ul.appendChild(li);
        });
        tocContent.appendChild(ul);
      } else {
        document.getElementById('toc').style.display = 'none';
      }
    }

    // 返回顶部按钮
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // ===== 2. 社交分享 =====
  window.copyArticleLink = function() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ 链接已复制到剪贴板！');
    }).catch(() => {
      alert('❌ 复制失败，请手动复制链接');
    });
  };

  window.showQRCode = function() {
    const url = window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      cursor: pointer;
    `;

    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
        <img src="${qrUrl}" alt="二维码" style="margin-bottom: 15px;">
        <p style="margin: 0; color: #333;">微信扫码阅读</p>
      </div>
    `;

    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
  };

  // ===== 3. 代码高亮（highlight.js 由 default.html 在 post 页加载，defer 执行时已就绪） =====
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  }
})();
