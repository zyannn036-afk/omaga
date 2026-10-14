/* ===== Numeria Quest — Labirin Dungeon + dungeon tersebar =====
   Dimuat PALING AKHIR (setelah town.js). Tidak mengubah berkas lain selain index.html (satu baris <script>).
   - Dungeon Sang Nol (Desa Sunyi) diganti menjadi labirin besar; bos tetap Naga Parabola (E[3]), jadi quest lama tetap jalan.
   - 4 dungeon baru tersebar di dunia: Gua Akar (Hutan Rimba), Makam Pasir (Padang Pasir),
     Gua Karang (seberang laut, Pesisir), Liang Peluang (Hutan Peluang).
   - Labirin = SATU jalan berkelok selebar 4 petak (cw x ch = jumlah sel; tiap sel 5 petak). Bentuknya dari seed tetap, jadi bentuknya sama tiap kali main (dan aman untuk simpan/muat).
   - Di dalam dungeon: gelap (hanya sekitar karakter yang terlihat), peta mini berkabut (hanya area yang pernah dilewati),
     musuh muncul lagi tiap kali masuk (bos & peti tidak), peti di sudut lorong, Kristal Simpan di tengah jalur, bos menjaga peti harta (celahnya ditutup pilar). */
(function () {
  /* ---------- pengaturan yang mudah diubah ---------- */
  const LIGHT_IN = 92, // radius terang penuh di sekitar karakter (piksel)
    LIGHT_OUT = 172, // radius tempat gelap mencapai maksimum
    DARK = 0.9, // kegelapan maksimum (0..1). Isi 0 untuk mematikan efek gelap
    RESPAWN = true, // musuh biasa muncul lagi tiap kali masuk dungeon
    SEEN_R = 10; // jarak (petak) dari pintu gua supaya tandanya muncul di peta mini dunia

  const XPD = [12, 20, 32, 70], // xp & koin asli E[0..3] (baru diisi init() saat game baru)
    CND = [10, 18, 30, 60];
  /* indeks E: 0 Slime, 1 Rubah, 4 Serigala, 5 Bandit, 6 Goblin, 7 Kalajengking, 8 Mumi, 9 Kobra,
     10 Ubur-ubur, 11 Kepiting, 12 Hiu, 14 Jamur, 15 Burung Hantu, 16 Ent */
  const DG = [
    {
      id: "D", name: "Dungeon Sang Nol", cw: 8, ch: 6, seed: 20261101, tint: [60, 0, 90],
      foes: 8, chests: 5, coin: [30, 60], treasure: 120, pool: [0, 1, 6, 4, 5], boss: 3,
    },
    {
      id: "DA", name: "Gua Akar Berbisik", door: [24, 72], cw: 7, ch: 5, seed: 20261102, tint: [0, 70, 20],
      foes: 7, chests: 4, coin: [45, 80], treasure: 150, pool: [4, 5, 6, 1],
      boss: {
        b: 6, n: "Raja Goblin Akar", hp: 230, atk: 19, xp: 90, coin: 120,
        intro: "Di ujung lorong akar, Raja Goblin menggebrak singgasana kayunya. Hitunganmu akan dia kurangi sampai habis!",
        win: "Mahkota akar Raja Goblin retak. Peti harta di belakangnya terbuka untukmu.",
      },
    },
    {
      id: "DP", name: "Makam Pasir Terkubur", door: [128, 62], cw: 8, ch: 6, seed: 20261103, tint: [90, 55, 0],
      foes: 9, chests: 5, coin: [55, 95], treasure: 180, pool: [7, 8, 9],
      boss: {
        b: 8, n: "Firaun Variabel", hp: 280, atk: 21, xp: 130, coin: 160,
        intro: "Peti mati emas terbuka. Firaun Variabel bangkit, perbannya penuh persamaan yang belum terpecahkan!",
        win: "Firaun itu runtuh jadi debu emas. Harta makam kini milikmu.",
      },
    },
    {
      id: "DK", name: "Gua Karang Tenggelam", door: [301, 97], cw: 9, ch: 6, seed: 20261104, tint: [0, 60, 90],
      foes: 10, chests: 5, coin: [70, 110], treasure: 220, pool: [10, 11, 12],
      boss: {
        b: 11, n: "Raja Kepiting Rasio", hp: 340, atk: 23, xp: 170, coin: 200,
        intro: "Air menggenang di aula karang. Raja Kepiting Rasio mengangkat capit raksasanya dan menuntut perbandingan yang tepat!",
        win: "Capit raksasa itu terkulai. Harta karang berkilau di balik aula.",
      },
    },
    {
      id: "DL", name: "Liang Peluang Purba", door: [377, 94], cw: 10, ch: 7, seed: 20261105, tint: [40, 0, 80],
      foes: 11, chests: 6, coin: [80, 130], treasure: 260, pool: [14, 15],
      boss: {
        b: 16, n: "Ent Purba Himpunan", hp: 400, atk: 25, xp: 220, coin: 250,
        intro: "Akar-akar purba bergerak. Ent Purba Himpunan membuka matanya, dan setiap soal terasa seperti undian!",
        win: "Ent Purba itu kembali tidur di bawah tanah. Harta liang terbuka.",
      },
    },
  ];
  const DNG = {};
  DG.forEach((d) => (DNG[d.id] = d));

  /* ---------- utilitas ---------- */
  const rng = (s) => () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const clone = (idx, d, over) => {
    const b = E[idx];
    E.push({
      ...b,
      xp: Math.round((b.xp || XPD[idx]) * 1.15),
      coin: Math.round((b.coin || CND[idx]) * 1.15),
      intro: `${b.n} menghadang di lorong ${d.name}. Jawab dengan benar untuk lolos!`,
      win: `${b.n} tumbang. Lorong di depan terbuka lagi.`,
      ...over,
    });
    return E.length - 1;
  };

  /* ---------- pembuat labirin: SATU jalan berkelok, lebar 4 petak ---------- */
  function build(d) {
    const R = rng(d.seed), cw = d.cw, ch = d.ch, P = 5, // tiap sel = lorong 4 petak + 1 petak tembok
      w = P * cw + 1, h = P * ch + 1;
    const g = [...Array(h)].map(() => Array(w).fill("#"));
    const shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(R() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    // jalur melewati semua sel tepat sekali: mulai dari ular lurus, lalu dikocok ("backbite") supaya berkelok acak
    let path = [];
    for (let r = 0; r < ch; r++) for (let i = 0; i < cw; i++) path.push([r % 2 ? cw - 1 - i : i, ch - 1 - r]);
    for (let n = 0; n < cw * ch * 30; n++) {
      const [hx, hy] = path[path.length - 1], [dx, dy] = D4[Math.floor(R() * 4)], nx = hx + dx, ny = hy + dy;
      if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue;
      const i = path.findIndex(([x, y]) => x === nx && y === ny);
      if (i === path.length - 2) continue;
      path = path.slice(0, i + 1).concat(path.slice(i + 1).reverse());
    }
    const conn = (a, b) => {
      // 4 petak penghubung (lubang di tembok) antara dua sel bertetangga
      const t = [];
      for (let k = 1; k <= 4; k++) t.push(a[1] === b[1] ? [P * Math.max(a[0], b[0]), P * a[1] + k] : [P * a[0] + k, P * Math.max(a[1], b[1])]);
      return t;
    };
    path.forEach(([x, y], k) => {
      for (let j = 1; j <= 4; j++) for (let i = 1; i <= 4; i++) g[P * y + j][P * x + i] = ".";
      if (k) conn(path[k - 1], [x, y]).forEach(([tx, ty]) => (g[ty][tx] = "."));
    });
    const L = path.length, ents = [];
    // slot sepanjang jalur: Kristal di tengah, sisanya peti & musuh (acak)
    const N = d.foes + d.chests + 1,
      slots = [...Array(N)].map((_, i) => path[Math.round(2 + ((L - 5) * (i + 0.5)) / N)]),
      mid = Math.floor(N / 2),
      rest = shuffle([...Array(N).keys()].filter((i) => i !== mid)),
      chestSet = new Set(rest.slice(0, d.chests));
    const at = ([cx, cy], corner) =>
      corner
        ? [P * cx + (R() < 0.5 ? 1 : 4), P * cy + (R() < 0.5 ? 1 : 4)]
        : [P * cx + 2 + Math.floor(R() * 2), P * cy + 2 + Math.floor(R() * 2)];
    const kinds = ["po", "fp", "po", "sc", "fp", "po"], foeIdx = [];
    let ci = 0;
    slots.forEach((c, i) => {
      if (i === mid) {
        const [x, y] = at(c);
        ents.push({ t: "crystal", x, y });
      } else if (chestSet.has(i)) {
        const [x, y] = at(c, 1), lo = d.coin[0], hi = d.coin[1];
        ents.push({ t: "chest", id: d.id + "c" + ci, x, y, coin: lo + Math.round(((hi - lo) * ci) / Math.max(1, d.chests - 1)), [kinds[ci % kinds.length]]: 1 });
        ci++;
      } else {
        const [x, y] = at(c), bi = d.pool[Math.floor(R() * d.pool.length)], idx = clone(bi, d, {});
        foeIdx.push(idx);
        ents.push({ t: "foe", i: idx, x, y, sp: E[bi].sp });
      }
    });
    // ruang harta di ujung jalur; bos berdiri di celah masuk, tiga petak lainnya ditutup pilar
    const gate = conn(path[L - 2], path[L - 1]), bk = 1 + Math.floor(R() * 2), bt = gate[bk];
    gate.forEach(([x, y], k) => k !== bk && (g[y][x] = "Z"));
    const [fx, fy] = path[L - 1],
      corners = [[1, 1], [4, 1], [1, 4], [4, 4]].map(([i, j]) => [P * fx + i, P * fy + j]);
    corners.sort((a, b) => Math.abs(b[0] - bt[0]) + Math.abs(b[1] - bt[1]) - Math.abs(a[0] - bt[0]) - Math.abs(a[1] - bt[1]));
    ents.push({ t: "chest", id: d.id === "D" ? "e" : d.id + "t", x: corners[0][0], y: corners[0][1], coin: d.treasure, po: 1, fp: 1 });
    let bossIdx;
    if (d.boss === 3) bossIdx = 3; // Naga Parabola asli (quest "Kalahkan Naga")
    else bossIdx = clone(d.boss.b, d, d.boss);
    ents.push({ t: "foe", i: bossIdx, x: bt[0], y: bt[1], sp: E[bossIdx].sp });
    // pintu keluar di tembok bawah, tepat di bawah sel awal
    g[h - 1][2] = ".";
    return { w, h, g: g.map((r) => r.join("")), ents, foeIdx, bossIdx, ex: 2 };
  }

  /* ---------- pasang dungeon ke dunia ---------- */
  const setT = (x, y, c) => {
    const r = MP.O.g[y];
    MP.O.g[y] = r.slice(0, x) + c + r.slice(x + 1);
  };
  const okSpot = (x, y) => {
    for (let j = y - 1; j <= y + 2; j++)
      for (let i = x - 1; i <= x + 1; i++)
        if ((MP.O.g[j] || "")[i] !== "." || EN.O.some((e) => e.x === i && e.y === j)) return false;
    return true;
  };
  const findSpot = (X, Y) => {
    if (okSpot(X, Y)) return [X, Y];
    for (let r = 1; r <= 20; r++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++)
          if (Math.max(Math.abs(dx), Math.abs(dy)) === r && okSpot(X + dx, Y + dy)) return [X + dx, Y + dy];
    return [X, Y];
  };
  DG.forEach((d) => {
    const m = build(d);
    d.foes = m.foeIdx; // daftar indeks musuh biasa (untuk respawn)
    MN[d.id] = d.name;
    MP[d.id] = { th: "d", w: m.w, h: m.h, g: m.g, dng: d.id, tint: d.tint };
    let door;
    if (d.door) {
      const [X, Y] = findSpot(d.door[0], d.door[1]);
      [[X - 1, Y - 1], [X, Y - 1], [X + 1, Y - 1], [X - 1, Y], [X + 1, Y]].forEach(([x, y]) => setT(x, y, "M"));
      setT(X, Y, "D");
      EN.O.push({ t: "portal", x: X, y: Y, to: d.id, tx: m.ex, ty: m.h - 2, f: [0, -1], dng: d.id });
      door = { to: "O", tx: X, ty: Y + 1, f: [0, 1] };
      d.ox = X;
      d.oy = Y;
    } else {
      const e = EN.O.find((p) => p.t === "portal" && p.to === d.id);
      Object.assign(e, { tx: m.ex, ty: m.h - 2, f: [0, -1], dng: d.id });
      door = { to: "O", tx: e.x, ty: e.y + 1, f: [0, 1] };
      d.ox = e.x;
      d.oy = e.y;
    }
    EN[d.id] = [{ t: "portal", x: m.ex, y: m.h - 1, ...door }, ...m.ents];
  });

  /* ---------- musik: semua dungeon memakai lagu dungeon ---------- */
  {
    const _m = SND.music;
    SND.music = function (n) {
      return _m.call(SND, DNG[n] ? "D" : n);
    };
  }

  /* ---------- musuh biasa muncul lagi tiap masuk ---------- */
  {
    const _p = H.portal;
    H.portal = (e) => {
      if (RESPAWN && DNG[e.to]) DNG[e.to].foes.forEach((i) => delete F.done[i]);
      _p(e);
    };
  }

  /* ---------- tanda pintu gua di peta mini dunia (muncul setelah kamu mendekat) ---------- */
  {
    const _os = onStep;
    onStep = function () {
      _os();
      if (mp !== "O") return;
      const s = (F.dsn = F.dsn || {});
      DG.forEach((d) => {
        if (!s[d.id] && Math.abs(px - d.ox) + Math.abs(py - d.oy) <= SEEN_R) s[d.id] = 1;
      });
    };
  }

  /* ---------- peta mini berkabut di dalam dungeon ---------- */
  {
    const _mini2 = mini2;
    const paint = (m, x, y) => {
      const c = m.g[y][x];
      m.fk.fillStyle = c === "#" || c === "Z" ? "#3a3858" : "#9a96c4";
      m.fk.fillRect(x, y, 1, 1);
    };
    mini2 = function (id) {
      const m = MP[id];
      if (!m.dng) return _mini2(id);
      const n = m.w * m.h,
        fg = (F.fog = F.fog || {});
      let s = fg[id];
      if (typeof s !== "string" || s.length !== n) {
        s = "0".repeat(n);
        fg[id] = s;
      }
      if (!m.fc) {
        const c = document.createElement("canvas");
        c.width = m.w;
        c.height = m.h;
        m.fc = c;
        m.fk = c.getContext("2d");
        m.fs = null;
      }
      if (m.fs !== s) {
        m.fk.clearRect(0, 0, m.w, m.h);
        for (let i = 0; i < n; i++) if (s[i] === "1") paint(m, i % m.w, (i / m.w) | 0);
        m.fs = s;
      }
      if (id === mp) {
        let a = null;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const x = px + dx, y = py + dy;
            if (dx * dx + dy * dy > 5 || x < 0 || y < 0 || x >= m.w || y >= m.h) continue;
            const i = y * m.w + x;
            if ((a || s)[i] === "0") {
              a = a || s.split("");
              a[i] = "1";
              paint(m, x, y);
            }
          }
        if (a) {
          s = a.join("");
          fg[id] = s;
          m.fs = s;
        }
      }
      return m.fc;
    };
  }

  /* ---------- gelap + peta mini ditaruh di atas kegelapan ---------- */
  {
    let pend = null;
    const _dm = drawMini;
    drawMini = function (mw, mh, CX, CY, fx, fy, t) {
      if (MP[mp].dng) {
        pend = [mw, mh, CX, CY, fx, fy, t];
        return;
      }
      _dm(mw, mh, CX, CY, fx, fy, t);
      if (mp === "O" && F.dsn) {
        const S = Math.min(1, 84 / mw), ox = Math.round(VW - mw * S - 4), oy = 4;
        ctx.globalAlpha = 1;
        DG.forEach((d) => {
          if (!F.dsn[d.id]) return;
          const X = Math.round(ox + d.ox * S) - 1, Y = Math.round(oy + d.oy * S) - 1;
          ctx.fillStyle = "#000";
          ctx.fillRect(X - 1, Y - 1, 5, 5);
          ctx.fillStyle = "#c77dff";
          ctx.fillRect(X, Y, 3, 3);
        });
      }
    };
    const _wd = W.draw;
    W.draw = function (t) {
      pend = null;
      _wd(t);
      const m = MP[mp];
      if (!m.dng) return;
      const mw = m.w, mh = m.h,
        fx = mv ? px + (mv.dx * mv.t) / 8 : px,
        fy = mv ? py + (mv.dy * mv.t) / 8 : py,
        CX = mw * 16 <= VW ? -Math.floor((VW - mw * 16) / 2) : clamp(Math.round(fx * 16 + 8 - VW / 2), 0, mw * 16 - VW),
        CY = mh * 16 + OY <= VH ? -Math.floor((VH - mh * 16 - OY) / 2) : clamp(Math.round(fy * 16 + OY + 8 - VH / 2), 0, mh * 16 + OY - VH),
        sx = fx * 16 + 8 - CX,
        sy = fy * 16 + OY + 8 - CY;
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${m.tint.join(",")},0.12)`;
      ctx.fillRect(0, 0, VW, VH);
      if (DARK > 0) {
        const k = Math.max(0, Math.min(1, (150 - zl) / 60)), // gelap baru penuh setelah tulisan nama wilayah lewat
          fl = rm ? 0 : 1,
          r0 = LIGHT_IN + fl * 3 * Math.sin(t / 180),
          r1 = LIGHT_OUT + fl * 4 * Math.sin(t / 230),
          gr = ctx.createRadialGradient(sx, sy, r0, sx, sy, r1);
        gr.addColorStop(0, "rgba(4,2,14,0)");
        gr.addColorStop(1, `rgba(4,2,14,${(DARK * k).toFixed(3)})`);
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, VW, VH);
      }
      if (pend) _dm(...pend);
    };
  }
})();
