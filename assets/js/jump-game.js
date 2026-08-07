/* 田野跳跃 · 横版跳跃 Demo
 * 纯前端 Canvas 游戏，无外部依赖。
 * 操作：← → / A D 移动，空格 / ↑ / W 跳跃，R 重新开始
 * 移动端：屏幕下方三个触控按钮。
 */
(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540;

  // ---- 视口自适应缩放 ----
  function fit() {
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.96;
    canvas.style.width = Math.floor(W * scale) + 'px';
    canvas.style.height = Math.floor(H * scale) + 'px';
  }
  window.addEventListener('resize', fit);
  fit();

  // ---- 输入 ----
  const keys = {};
  const touch = { left: false, right: false, jump: false };
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyD', 'KeyW'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });
  function bind(id, k) {
    const el = document.getElementById(id);
    if (!el) return;
    const down = e => { e.preventDefault(); touch[k] = true; };
    const up = () => { touch[k] = false; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('pointercancel', up);
  }
  bind('btn-left', 'left');
  bind('btn-right', 'right');
  bind('btn-jump', 'jump');

  const left  = () => keys.ArrowLeft  || keys.KeyA || touch.left;
  const right = () => keys.ArrowRight || keys.KeyD || touch.right;
  const jumpHeld = () => keys.Space || keys.ArrowUp || keys.KeyW || touch.jump;

  // ---- 简易音效（WebAudio 合成，无需素材）----
  let ac = null;
  function beep(freq, dur, type = 'square', vol = 0.12, delay = 0) {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + delay;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = freq;
      o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur);
    } catch (e) { /* 静默失败 */ }
  }

  // ---- 种子随机（保证关卡/背景每次一致）----
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(20260807);

  // ---- 常量 ----
  const STEP = 1 / 60;
  const GRAV = 1900, MOVE = 265, JUMP_V = -720, MAX_FALL = 950;
  const groundY = 420;

  // ---- 状态 ----
  let state = 'ready';            // ready | playing | dead | win
  let last = performance.now(), acc = 0, prevJump = false;
  let camX = 0, time = 0, runDust = 0, stats = { coins: 0, distance: 0 };

  // ---- 玩家 ----
  const player = { x: 0, y: 0, w: 34, h: 46, vx: 0, vy: 0, onGround: false, coyote: 0, jumpBuf: 0, facing: 1, anim: 0, stretch: 0 };

  function resetPlayer() {
    player.x = 60; player.y = groundY - player.h;
    player.vx = 0; player.vy = 0; player.onGround = true;
    player.coyote = 0; player.jumpBuf = 0; player.facing = 1;
    player.anim = 0; player.stretch = 0;
    camX = 0; stats = { coins: 0, distance: 0 };
  }

  // ---- 关卡 ----
  const platforms = [];
  const coins = [];
  let levelW = 0;
  const flagX = 5550;

  function addGround(x, w) {
    platforms.push({ x, y: groundY, w, h: H - groundY, solid: true });
    // 地面金币
    for (let cx = x + 70; cx < x + w - 60; cx += 260) {
      coins.push({ x: cx, y: groundY - 92, r: 13, taken: false, ph: rng() * 6.28 });
    }
  }
  function addPlat(x, y, w) {
    platforms.push({ x, y, w, h: 22, solid: true });
    coins.push({ x: x + w / 2, y: y - 40, r: 13, taken: false, ph: rng() * 6.28 });
  }

  function buildLevel() {
    platforms.length = 0; coins.length = 0;
    addGround(0, 850);
    addPlat(1020, 345, 130);
    addGround(920, 700);
    addPlat(1760, 300, 140);
    addGround(1690, 650);
    addPlat(2460, 330, 130); addPlat(2810, 245, 120);
    addGround(2420, 800);
    addPlat(3380, 310, 140);
    addGround(3310, 600);
    addPlat(4110, 260, 130); addPlat(4350, 335, 130);
    addGround(4010, 750);
    addPlat(4920, 285, 150); addPlat(5190, 355, 120);
    addGround(4870, 720);
    levelW = flagX + 260;
  }

  function resetGame() {
    buildLevel();
    resetPlayer();
    particles.length = 0;
    state = 'ready';
  }

  // ---- 粒子 ----
  const particles = [];
  function puff(x, y, n, color, spd = 120, life = 0.5) {
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2, v = spd * (0.4 + rng() * 0.8);
      particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - spd * 0.3, life, max: life, size: 3 + rng() * 4, color, grav: 500 });
    }
  }

  // ---- 物理 ----
  function collide(p, pl) {
    return p.x < pl.x + pl.w && p.x + p.w > pl.x && p.y < pl.y + pl.h && p.y + p.h > pl.y;
  }

  function stepPhysics() {
    const p = player;
    const move = (right() ? 1 : 0) - (left() ? 1 : 0);
    p.vx = move * MOVE;
    if (move) p.facing = move;

    // 跳跃缓冲 + 土狼时间
    const held = jumpHeld();
    if (held && !prevJump) p.jumpBuf = 0.12;
    prevJump = held;

    p.vy = Math.min(p.vy + GRAV * STEP, MAX_FALL);
    if (p.onGround) p.coyote = 0.08; else p.coyote -= STEP;

    if (p.jumpBuf > 0 && p.coyote > 0) {
      p.vy = JUMP_V; p.onGround = false; p.coyote = 0; p.jumpBuf = 0;
      p.stretch = 0.22;
      beep(300, 0.1, 'sine', 0.1);
      puff(p.x + p.w / 2, p.y + p.h, 5, 'rgba(255,255,255,0.7)', 80, 0.35);
    }
    // 松手切跳跃高度
    if (!held && p.vy < 0) p.vy *= 1 - 10 * STEP;

    // X 轴
    const prevX = p.x;
    p.x += p.vx * STEP;
    for (const pl of platforms) {
      if (collide(p, pl)) {
        p.x = p.vx > 0 ? pl.x - p.w : pl.x + pl.w;
        p.vx = 0;
      }
    }
    if (p.x < 0) p.x = 0;
    if (p.x > levelW - p.w) p.x = levelW - p.w;

    // Y 轴
    const prevBottom = p.y + p.h;
    p.y += p.vy * STEP;
    p.onGround = false;
    for (const pl of platforms) {
      if (collide(p, pl)) {
        if (p.vy >= 0 && prevBottom <= pl.y + 4) {
          p.y = pl.y - p.h; p.vy = 0; p.onGround = true;
          p.stretch = Math.min(p.stretch, -0.18);
        } else if (p.vy < 0) {
          p.y = pl.y + pl.h; p.vy = 0;
        }
      }
    }

    // 奔跑动画 / 落地灰尘
    p.anim += Math.abs(p.vx) * STEP * 0.16;
    if (p.onGround && Math.abs(p.vx) > 0) {
      runDust -= STEP;
      if (runDust <= 0) { runDust = 0.08; puff(p.x + p.w / 2 - p.facing * 12, p.y + p.h, 1, 'rgba(200,190,170,0.55)', 50, 0.4); }
    }
    // 拉伸回弹
    p.stretch *= 1 - 9 * STEP;

    // 金币
    for (const c of coins) {
      if (c.taken) continue;
      const dx = (p.x + p.w / 2) - c.x, dy = (p.y + p.h / 2) - c.y;
      if (dx * dx + dy * dy < (c.r + 24) * (c.r + 24)) {
        c.taken = true; stats.coins++;
        beep(988, 0.07, 'square', 0.09); beep(1319, 0.1, 'square', 0.09, 0.07);
        puff(c.x, c.y, 8, '#ffd24a', 170, 0.5);
      }
    }

    // 相机跟随
    const target = p.x + p.w / 2 - W * 0.38;
    camX += (target - camX) * Math.min(1, 8 * STEP);
    camX = Math.max(0, Math.min(camX, levelW - W));

    // 掉出屏幕
    if (p.y > camX + H + 120) {
      state = 'dead';
      beep(200, 0.4, 'sawtooth', 0.12);
    }
    // 到达终点
    if (p.x + p.w / 2 >= flagX) {
      state = 'win';
      beep(523, 0.12, 'square', 0.1);
      beep(659, 0.12, 'square', 0.1, 0.12);
      beep(784, 0.2, 'square', 0.1, 0.24);
    }

    stats.distance = Math.max(stats.distance, Math.floor((p.x - 60) / 28));
  }

  // ---- 绘制 ----
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawBackground() {
    // 天空
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#8fd0ff');
    sky.addColorStop(0.6, '#d9f2ff');
    sky.addColorStop(1, '#eefaff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // 太阳
    ctx.fillStyle = 'rgba(255,236,160,0.95)';
    ctx.beginPath(); ctx.arc(820, 86, 38, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,248,214,0.5)';
    ctx.beginPath(); ctx.arc(820, 86, 54, 0, 7); ctx.fill();

    // 远山（视差 0.15）
    ctx.fillStyle = '#a9c6e6';
    drawHills(0.15, 78, 260, 6);
    // 中景山丘（视差 0.4）
    ctx.fillStyle = '#8fc79a';
    drawHills(0.4, 62, 300, 10);

    // 云（视差 0.25）
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < 6; i++) {
      const sx = ((i * 437 + 120) - camX * 0.25) % (W + 240);
      const px = (sx + W + 240) % (W + 240) - 120;
      const py = 60 + (i * 73) % 130;
      const cw = 60 + ((i * 53) % 50);
      rr(px, py, cw, 22, 11); ctx.fill();
      rr(px + cw * 0.25, py - 12, cw * 0.5, 18, 9); ctx.fill();
    }

    // 近处草地（视差 0.65）
    ctx.fillStyle = '#67b96b';
    drawHills(0.65, 40, 396, 14);
  }

  function drawHills(par, amp, baseY, step) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 14) {
      const wx = (x + camX * par);
      const y = baseY - Math.sin(wx * 0.004) * amp - Math.sin(wx * 0.011 + 2) * amp * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawPlatforms() {
    for (const pl of platforms) {
      const x = pl.x - camX;
      if (x + pl.w < -40 || x > W + 40) continue;
      if (pl.h > 100) {
        // 地面
        ctx.fillStyle = '#7e5638';
        ctx.fillRect(x, pl.y, pl.w, pl.h);
        ctx.fillStyle = '#5d3d26';
        for (let gx = x; gx < x + pl.w; gx += 40) {
          ctx.fillRect(gx + 8, pl.y + 26, 20, 4);
        }
        ctx.fillStyle = '#58b368';
        ctx.fillRect(x, pl.y, pl.w, 16);
        ctx.fillStyle = '#7ed57f';
        ctx.fillRect(x, pl.y, pl.w, 6);
      } else {
        // 浮空平台
        rr(x, pl.y, pl.w, pl.h, 6);
        ctx.fillStyle = '#6d9b6a';
        ctx.fill();
        ctx.fillStyle = '#58b368';
        ctx.fillRect(x, pl.y, pl.w, 7);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        rr(x + 5, pl.y + pl.h - 4, pl.w - 10, 4, 3); ctx.fill();
      }
    }
  }

  function drawCoins() {
    for (const c of coins) {
      if (c.taken) continue;
      const x = c.x - camX;
      if (x < -30 || x > W + 30) continue;
      const bob = Math.sin(time * 3 + c.ph) * 3;
      const px = x, py = c.y + bob;
      ctx.fillStyle = '#ffb300';
      ctx.beginPath(); ctx.arc(px, py, c.r, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd24a';
      ctx.beginPath(); ctx.arc(px - 2, py - 2, c.r - 4, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(px - 4, py - 4, c.r * 0.35, 0, 7); ctx.fill();
    }
  }

  function drawFlag() {
    const x = flagX - camX;
    if (x < -80 || x > W + 80) return;
    ctx.fillStyle = '#7e7e8a';
    ctx.fillRect(x - 2, groundY - 120, 5, 120);
    ctx.fillStyle = '#ff5d5d';
    ctx.beginPath();
    ctx.moveTo(x + 3, groundY - 120);
    ctx.lineTo(x + 46, groundY - 105);
    ctx.lineTo(x + 3, groundY - 88);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d84343';
    ctx.beginPath(); ctx.arc(x + 3, groundY - 120, 7, 0, 7); ctx.fill();
  }

  function drawPlayer() {
    const p = player;
    const cx = p.x + p.w / 2 - camX, cy = p.y + p.h / 2;
    const stretch = p.stretch;
    const sy = 1 + stretch;
    const sx = 1 - stretch * 0.7;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);

    // 影子
    if (p.onGround) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath(); ctx.ellipse(0, p.h / 2 - 2, 20, 5, 0, 0, 7); ctx.fill();
    }

    // 腿
    const running = p.onGround && Math.abs(p.vx) > 0;
    const swing = running ? Math.sin(p.anim * 3) * 7 : 0;
    ctx.fillStyle = '#e0631a';
    rr(-9, p.h / 2 - 8, 9, 10, 3); ctx.fill();
    rr(0, p.h / 2 - 8, 9, 10, 3); ctx.fill();
    ctx.fillStyle = '#5d3d26';
    rr(-10 + swing * 0.4, p.h / 2 - 2, 11, 5, 2); ctx.fill();
    rr(-1 - swing * 0.4, p.h / 2 - 2, 11, 5, 2); ctx.fill();

    // 身体
    ctx.fillStyle = '#ff8c42';
    rr(-p.w / 2, -p.h / 2, p.w, p.h - 4, 10);
    ctx.fill();
    ctx.fillStyle = '#ffa668';
    rr(-p.w / 2 + 3, -p.h / 2 + 3, p.w - 6, p.h - 10, 8);
    ctx.fill();

    // 眼睛
    const eyeY = -p.h / 2 + 13;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(3 * p.facing, eyeY, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#2b2b2b';
    ctx.beginPath(); ctx.arc(4.5 * p.facing, eyeY + 1, 3.4, 0, 7); ctx.fill();

    ctx.restore();
  }

  function drawParticles() {
    for (const pt of particles) {
      const a = pt.life / pt.max;
      ctx.globalAlpha = a;
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x - camX - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawHUD() {
    ctx.textBaseline = 'middle';
    // 金币
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath(); ctx.arc(40, 34, 14, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffb300';
    ctx.beginPath(); ctx.arc(40, 34, 12, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd24a';
    ctx.beginPath(); ctx.arc(37, 31, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#3a3a3a';
    ctx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('× ' + stats.coins, 64, 36);

    // 距离
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(stats.distance + ' m', W - 24, 36);
    ctx.textAlign = 'left';
  }

  function drawTextOverlay(title, lines) {
    ctx.fillStyle = 'rgba(20,28,40,0.42)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 46px "Segoe UI", system-ui, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8;
    ctx.fillText(title, W / 2, H * 0.38);
    ctx.shadowBlur = 0;
    ctx.font = '19px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    lines.forEach((ln, i) => ctx.fillText(ln, W / 2, H * 0.38 + 44 + i * 30));
    ctx.textAlign = 'left';
  }

  function draw() {
    drawBackground();
    drawFlag();
    drawPlatforms();
    drawCoins();
    drawPlayer();
    drawParticles();

    if (state === 'ready') {
      drawTextOverlay('🏃 田野跳跃', ['← → / A D 移动 · 空格 / ↑ / W 跳跃', '按下空格或点击任意键开始']);
    } else if (state === 'playing') {
      drawHUD();
    } else if (state === 'dead') {
      drawHUD();
      drawTextOverlay('💨 摔下去了…', ['本次跑了 ' + stats.distance + ' m，收集 ' + stats.coins + ' 枚金币', '按 R 或点击重新开始']);
    } else if (state === 'win') {
      drawHUD();
      drawTextOverlay('🎉 到达终点！', ['收获 ' + stats.coins + ' 枚金币 · 全程 ' + stats.distance + ' m', '按 R 或点击再来一次']);
    }
  }

  // ---- 主循环 ----
  function step() {
    time += STEP;
    if (state === 'playing') stepPhysics();

    // 粒子更新（任何状态都更新）
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.vy += pt.grav * STEP;
      pt.x += pt.vx * STEP; pt.y += pt.vy * STEP;
      pt.life -= STEP;
      if (pt.life <= 0) particles.splice(i, 1);
    }

    // 状态切换输入
    if (state === 'ready' && (jumpHeld() || right() || left())) {
      state = 'playing';
    }
    if ((state === 'dead' || state === 'win') && (keys.KeyR || (state !== 'ready' && (jumpHeld() || right() || left())))) {
      // 防止死亡瞬间的跳跃键误触重启：需要 R 或一次新的按键
      if (keys.KeyR) { resetGame(); }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    acc += dt;
    let n = 0;
    while (acc >= STEP && n < 5) { step(); acc -= STEP; n++; }
    draw();
  }

  // 死亡/胜利后点击或按空格重开
  window.addEventListener('pointerdown', () => {
    if (state === 'dead' || state === 'win') resetGame();
  });
  window.addEventListener('keydown', e => {
    if ((state === 'dead' || state === 'win') && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Enter')) {
      e.preventDefault();
      resetGame();
    }
  });

  resetGame();
  requestAnimationFrame(frame);
})();
