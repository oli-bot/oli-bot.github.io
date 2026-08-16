// ===== /styleselect 风格选择器 =====
// 风格注册表与 assets/css/style.css 第 27 章节一一对应
(function() {
  'use strict';

  const STYLES = [
    { id: 'default', name: '终端风',   idLabel: 'terminal', desc: '极客终端 · 站点默认风格' },
    { id: 'paper',   name: '纸墨杂志', idLabel: 'paper',    desc: '衬线排版 · 米白纸感阅读' },
    { id: 'aurora',  name: '午夜极光', idLabel: 'aurora',   desc: '深蓝夜空 · 极光青紫光晕' },
    { id: 'amber',   name: '琥珀 CRT', idLabel: 'amber',    desc: '复古单色终端 · 琥珀荧光' },
    { id: 'ocean',   name: '海洋清风', idLabel: 'ocean',    desc: '清新蓝白 · 柔和圆角舒缓' },
    { id: 'cyber',   name: '赛博霓虹', idLabel: 'cyber',    desc: '霓虹灯管 · 品红青发光' },
    { id: 'warm',    name: '暖阳极简', idLabel: 'warm',     desc: '暖白大留白 · 焦糖橙点缀' },
    { id: 'print',   name: '黑白印刷', idLabel: 'print',    desc: '纯黑白高对比 · 报纸排版' },
    { id: 'sakura',  name: '樱花和风', idLabel: 'sakura',   desc: '樱粉米白 · 朱红和风点缀' },
    { id: 'forest',  name: '森林松木', idLabel: 'forest',   desc: '松绿苔藓 · 自然沉静' },
    { id: 'space',   name: '星际深空', idLabel: 'space',    desc: '星空背景 · 靛蓝科技光' }
  ];

  const html = document.documentElement;
  const overlay = document.getElementById('style-panel-overlay');
  const input = document.getElementById('style-cmd-input');
  const list = document.getElementById('style-list');
  const output = document.getElementById('style-output');
  const btn = document.getElementById('style-select-btn');
  const closeBtn = document.getElementById('style-panel-close');
  const indicator = document.getElementById('style-indicator-name');

  function getSavedStyle() {
    try { return localStorage.getItem('style') || 'default'; } catch (e) { return 'default'; }
  }

  function getSavedTheme() {
    try { return localStorage.getItem('theme') || 'light'; } catch (e) { return 'light'; }
  }

  function applyStyle(id) {
    html.setAttribute('data-style', id);
  }

  function saveStyle(id) {
    try { localStorage.setItem('style', id); } catch (e) {}
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    // 联动 Giscus 评论主题（与主题切换按钮逻辑一致）
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow.postMessage({
        giscus: { setConfig: { theme: theme !== 'light' ? 'dark' : 'light' } }
      }, 'https://giscus.app');
    }
  }

  function updateIndicator() {
    const cur = getSavedStyle();
    const meta = STYLES.find(s => s.id === cur) || STYLES[0];
    if (indicator) indicator.textContent = meta.idLabel;
  }

  // ===== 风格预览状态（顶层作用域，供面板各处调用） =====
  let previewTimer = null;
  let previewing = null;

  function stopPreview() {
    clearTimeout(previewTimer);
    previewTimer = null;
    if (previewing) {
      previewing = null;
      html.setAttribute('data-style', getSavedStyle());
    }
  }

  // 事件委托（列表只绑定一次，重渲染 innerHTML 不受影响）：
  // 快速在列表项间移动不会来回切换 data-style，避免页面闪烁；
  // 只有鼠标在某个列表项上停留超过防抖阈值才应用预览，
  // 移出列表才恢复已保存风格。
  list.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.style-item');
    if (!item) return;
    const sid = item.getAttribute('data-style-id');
    const saved = getSavedStyle();
    clearTimeout(previewTimer);
    if (sid === saved) {
      // 悬停在当前已应用风格上：取消任何预览
      stopPreview();
      return;
    }
    // 400ms 防抖：人手正常移动（每项停留 150~300ms）不会触发预览，
    // 只有真正停留在某个风格上才预览，避免连续切换造成的闪烁
    previewTimer = setTimeout(() => {
      previewing = sid;
      html.setAttribute('data-style', sid);
    }, 400);
  });

  list.addEventListener('mouseout', (e) => {
    // 仅当完全移出列表时才恢复（移到其他列表项由 mouseover 接管）
    if (!list.contains(e.relatedTarget)) {
      stopPreview();
    }
  });

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.style-item');
    if (!item) return;
    const sid = item.getAttribute('data-style-id');
    stopPreview();
    saveStyle(sid);
    applyStyle(sid);
    updateIndicator();
    output.innerHTML = '<span class="out-ok">✓ 已应用风格：' + (STYLES.find(s => s.id === sid) || {}).name + '（已记忆，下次访问生效）</span>';
    renderList('');
    input.value = '/styleselect';
  });

  function renderList(filter) {
    const cur = getSavedStyle();
    const q = (filter || '').trim().toLowerCase();
    let items = STYLES;
    if (q) {
      items = STYLES.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.includes(q) ||
        s.desc.toLowerCase().includes(q)
      );
    }
    if (items.length === 0) {
      list.innerHTML = '<p class="style-list-empty">没有匹配的风格</p>';
      return;
    }
    list.innerHTML = '<div class="style-list-head">' + (q ? '过滤结果' : '可用风格（共 ' + STYLES.length + ' 种）') + '</div>' + items.map((s, i) => {
      const active = s.id === cur;
      return '<div class="style-item' + (active ? ' active' : '') + '" data-style-id="' + s.id + '" data-preview="' + s.id + '">' +
        '<span class="style-index">[' + (i + 1) + ']</span>' +
        '<span class="style-name">' + s.name + '</span>' +
        '<span class="style-id">' + s.idLabel + '</span>' +
        '<span class="style-desc">' + s.desc + '</span>' +
        '<span class="style-check">✓ 当前</span>' +
        '</div>';
    }).join('');
  }

  // ===== 命令处理 =====
  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();

    if (!cmd) {
      output.innerHTML = '输入 <b>/styleselect</b> 查看风格列表';
      return;
    }

    if (cmd === '/styleselect' || cmd === '/style' || cmd === '/styles') {
      output.innerHTML = '可用风格列表如下，鼠标悬停预览，点击应用：';
      renderList('');
      return;
    }

    if (cmd === '/theme') {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      output.innerHTML = '<span class="out-ok">✓ 已切换为' + (next === 'dark' ? '深色' : '浅色') + '主题</span>';
      return;
    }

    if (cmd === '/reset') {
      saveStyle('default');
      applyStyle('default');
      updateIndicator();
      output.innerHTML = '<span class="out-ok">✓ 已恢复默认风格（终端风）</span>';
      renderList('');
      return;
    }

    if (cmd === '/help') {
      output.innerHTML =
        '<span class="cmd">/styleselect</span> — 查看并切换风格<br>' +
        '<span class="cmd">/theme</span> — 切换深色 / 浅色主题<br>' +
        '<span class="cmd">/reset</span> — 恢复默认终端风<br>' +
        '<span class="cmd">/help</span> — 显示本帮助<br>' +
        '快捷键 <b>/</b> 打开面板，<b>Esc</b> 关闭';
      return;
    }

    if (cmd.startsWith('/')) {
      output.innerHTML = '<span class="out-err">✗ 未知命令：' + raw.trim() + '（输入 /help 查看可用命令）</span>';
      renderList('');
      return;
    }

    // 非命令输入 → 当作风格过滤
    renderList(raw.trim());
    output.innerHTML = '按关键词过滤风格列表：';
  }

  function openPanel() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    // 打开面板时清理可能的预览残留，确保展示已保存风格
    stopPreview();
    applyStyle(getSavedStyle());
    renderList('');
    output.innerHTML = '';
    input.value = '/styleselect';
    // 聚焦并选中命令文本
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }

  function closePanel() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    // 恢复已保存的风格（丢弃预览）
    applyStyle(getSavedStyle());
  }

  // ===== 事件绑定 =====
  btn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePanel();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(input.value);
    } else if (e.key === 'Escape') {
      closePanel();
    }
  });

  input.addEventListener('input', () => {
    const v = input.value.trim();
    if (!v.startsWith('/')) {
      // 实时过滤
      renderList(v);
    }
  });

  // 全局快捷键：/ 打开面板（输入框中除外）
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !overlay.classList.contains('open')) {
      const tag = (e.target.tagName || '').toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (!isTyping) {
        e.preventDefault();
        openPanel();
      }
    } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePanel();
    }
  });

  // 初始化
  applyStyle(getSavedStyle());
  updateIndicator();
})();
