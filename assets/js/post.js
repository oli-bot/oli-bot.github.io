// ===== 文章页脚本：目录生成 / 返回顶部 / 社交分享 =====
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
  function copyArticleLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ 链接已复制到剪贴板！');
    }).catch(() => {
      alert('❌ 复制失败，请手动复制链接');
    });
  }

  function showQRCode() {
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
  }

  // 分享按钮事件绑定（post.html 已去掉内联 onclick，改由 id 统一绑定）
  document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.getElementById('share-copy-link');
    if (copyBtn) copyBtn.addEventListener('click', copyArticleLink);
    const qrBtn = document.getElementById('share-qrcode');
    if (qrBtn) qrBtn.addEventListener('click', showQRCode);
  });

  // 图片 / Mermaid 图表灯箱：点击放大，Esc 或点击任意处关闭
  document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.post-content');
    if (!content) return;
    let overlay = null;
    let lastFocus = null;

    function onKey(e) {
      if (e.key === 'Escape') closeLightbox();
    }

    function closeLightbox() {
      if (!overlay) return;
      overlay.remove();
      overlay = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function openLightbox(node, captionText) {
      closeLightbox();
      lastFocus = document.activeElement;
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      const clone = node.cloneNode(true);
      if (clone.tagName === 'svg') {
        clone.style.width = '92vw';
        clone.style.height = 'auto';
        clone.style.maxWidth = '94vw';
        clone.style.maxHeight = '88vh';
      }
      overlay.appendChild(clone);
      if (captionText) {
        const cap = document.createElement('div');
        cap.className = 'lightbox-caption';
        cap.textContent = captionText;
        overlay.appendChild(cap);
      }
      overlay.addEventListener('click', closeLightbox);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    }

    content.querySelectorAll('img').forEach(function(img) {
      if (img.closest('a')) return;
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', function() { openLightbox(img, img.getAttribute('alt')); });
      img.addEventListener('keydown', function(e) { if (e.key === 'Enter') openLightbox(img, img.getAttribute('alt')); });
    });

    content.querySelectorAll('.mermaid').forEach(function(box) {
      box.setAttribute('tabindex', '0');
      function open() {
        const svg = box.querySelector('svg');
        if (svg) openLightbox(svg, null);
      }
      box.addEventListener('click', open);
      box.addEventListener('keydown', function(e) { if (e.key === 'Enter') open(); });
    });
  });
})();
