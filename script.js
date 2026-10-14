/* resolusi piksel game: 480 x 270 */
const VW = 480,
  VH = 270,
  GY = 180; // garis tanah arena battle (sisa bawah ditutup panel perintah)
const $ = (s) => document.querySelector(s),
  R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
  P = (a) => a[R(0, a.length - 1)];
const gcd = (a, b) => (b ? gcd(b, a % b) : a),
  fr = (n, d) => {
    const g = gcd(Math.abs(n), d);
    n /= g;
    d /= g;
    return d === 1 ? "" + n : n + "/" + d;
  };
const rp = (n) => "Rp" + n.toLocaleString("id-ID"),
  clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mk = (t, val, expl, hint, show) => ({
  t,
  val,
  expl,
  hint,
  show: show ?? String(val),
});
const TN = {
  arit: "Aritmetika",
  pecahan: "Pecahan",
  persen: "Persen",
  geom: "Geometri",
  alj: "Aljabar",
};

/* ---------- Generator soal (template per topik, level 1-5) ---------- */
const G = {
  arit: (d) => {
    if (d == 1) {
      const a = R(3, 15),
        b = R(3, 15);
      return mk(
        `${a} + ${b} = ?`,
        a + b,
        `Jumlahkan: ${a} + ${b} = ${a + b}.`,
        "Hitung satuannya dulu.",
      );
    }
    if (d == 2) {
      const a = R(3, 12),
        b = R(3, 12);
      return mk(
        `${a} × ${b} = ?`,
        a * b,
        `${a} × ${b} = ${a * b}.`,
        "Ingat tabel perkalian.",
      );
    }
    if (d == 3) {
      const a = R(300, 900),
        b = R(120, 290);
      return R(0, 1)
        ? mk(
            `${a} − ${b} = ?`,
            a - b,
            `${a} − ${b} = ${a - b}.`,
            "Kurangi ratusan, lalu puluhan, lalu satuan.",
          )
        : mk(
            `${a} + ${b} = ?`,
            a + b,
            `${a} + ${b} = ${a + b}.`,
            "Jumlahkan ratusan, puluhan, lalu satuan.",
          );
    }
    if (d == 4) {
      const a = R(12, 25),
        b = R(11, 19);
      return mk(
        `${a} × ${b} = ?`,
        a * b,
        `${a} × ${b} = ${a}×10 + ${a}×${b - 10} = ${a * 10} + ${a * (b - 10)} = ${a * b}.`,
        `Pecah ${b} menjadi 10 + ${b - 10}.`,
      );
    }
    const a = R(5, 20),
      b = R(5, 20),
      c = R(3, 9),
      e = R(5, 30),
      v = (a + b) * c - e;
    return mk(
      `(${a} + ${b}) × ${c} − ${e} = ?`,
      v,
      `Kurung dulu: ${a + b}. Lalu × ${c} = ${(a + b) * c}. Lalu − ${e} = ${v}.`,
      "Kerjakan yang di dalam kurung lebih dulu.",
    );
  },
  pecahan: (d) => {
    const den = P([4, 5, 6, 8, 10]);
    if (d == 1) {
      const a = R(1, den - 2),
        b = R(1, den - a - 1);
      return mk(
        `${a}/${den} + ${b}/${den} = ?`,
        (a + b) / den,
        `Penyebut sama, jumlahkan pembilang: ${a}+${b}=${a + b}. Hasil ${fr(a + b, den)}.`,
        "Penyebut sama: jumlahkan pembilangnya saja. Tulis seperti 3/4.",
        fr(a + b, den),
      );
    }
    if (d == 2) {
      const a = R(3, den - 1),
        b = R(1, a - 1);
      return mk(
        `${a}/${den} − ${b}/${den} = ?`,
        (a - b) / den,
        `Kurangkan pembilang: ${a}−${b}=${a - b}. Hasil ${fr(a - b, den)}.`,
        "Penyebut sama: kurangkan pembilangnya. Sederhanakan jika bisa.",
        fr(a - b, den),
      );
    }
    if (d == 3) {
      const d1 = P([2, 3]),
        d2 = d1 * 2,
        a = R(1, d1 - 1),
        b = R(1, d2 - 1),
        n = 2 * a + b;
      return mk(
        `${a}/${d1} + ${b}/${d2} = ?`,
        n / d2,
        `Samakan penyebut: ${a}/${d1} = ${2 * a}/${d2}. Lalu ${2 * a}/${d2} + ${b}/${d2} = ${fr(n, d2)}.`,
        `Ubah ${a}/${d1} menjadi penyebut ${d2}.`,
        fr(n, d2),
      );
    }
    const n1 = R(1, 4),
      d1 = R(2, 5),
      n2 = R(1, 4),
      d2 = R(2, 5);
    if (d == 4)
      return mk(
        `${n1}/${d1} × ${n2}/${d2} = ?`,
        (n1 * n2) / (d1 * d2),
        `Kalikan pembilang (${n1 * n2}) dan penyebut (${d1 * d2}): ${fr(n1 * n2, d1 * d2)}.`,
        "Pembilang × pembilang, penyebut × penyebut.",
        fr(n1 * n2, d1 * d2),
      );
    return mk(
      `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
      (n1 * d2) / (d1 * n2),
      `Bagi = kali kebalikan: ${n1}/${d1} × ${d2}/${n2} = ${fr(n1 * d2, d1 * n2)}.`,
      "Balik pecahan kedua, lalu kalikan.",
      fr(n1 * d2, d1 * n2),
    );
  },
  persen: (d) => {
    if (d == 1) {
      const p = P([10, 25, 50]),
        b = P([20, 40, 60, 80, 100, 200]);
      return mk(
        `${p}% dari ${b} = ?`,
        (p * b) / 100,
        `${p}% × ${b} = ${(p * b) / 100}.`,
        `${p}% sama dengan ${p}/100.`,
      );
    }
    if (d == 2) {
      const p = P([5, 15, 20, 30, 40]),
        b = R(1, 10) * 20;
      return mk(
        `${p}% dari ${b} = ?`,
        (p * b) / 100,
        `${p}/100 × ${b} = ${(p * b) / 100}.`,
        "Kalikan bilangan dengan persen/100.",
      );
    }
    if (d == 3) {
      const h = R(5, 20) * 10000,
        p = P([10, 20, 25, 30, 50]),
        v = (h * (100 - p)) / 100;
      return mk(
        `Harga ${rp(h)} didiskon ${p}%. Berapa harga akhir (Rp)?`,
        v,
        `Diskon = ${p}% × ${h} = ${(h * p) / 100}. Harga akhir = ${h} − ${(h * p) / 100} = ${v}.`,
        "Hitung diskon dulu, lalu kurangkan dari harga.",
      );
    }
    if (d == 4) {
      const a = R(1, 10) * 20,
        p = P([10, 25, 50]),
        b = (a * (100 + p)) / 100;
      return mk(
        `Harga naik dari ${a} menjadi ${b}. Berapa persen kenaikannya?`,
        p,
        `Kenaikan = ${b - a}. Persen = ${b - a}/${a} × 100 = ${p}%.`,
        "Persen naik = selisih ÷ harga awal × 100.",
      );
    }
    const h = R(1, 5) * 100000,
      m = (h * 8) / 10,
      v = (m * 9) / 10;
    return mk(
      `Harga ${rp(h)} diskon 20%, lalu diskon 10% lagi dari harga baru. Harga akhir (Rp)?`,
      v,
      `${h} × 0,8 = ${m}. Lalu × 0,9 = ${v}.`,
      "Diskon kedua dihitung dari harga setelah diskon pertama.",
    );
  },
  geom: (d) => {
    if (d == 1) {
      const s = R(3, 15);
      return mk(
        `Keliling persegi dengan sisi ${s} cm (cm)?`,
        4 * s,
        `Keliling = 4 × ${s} = ${4 * s}.`,
        "Keliling persegi = 4 × sisi.",
      );
    }
    if (d == 2) {
      const p = R(4, 15),
        l = R(3, 12);
      return mk(
        `Luas persegi panjang ${p} cm × ${l} cm (cm²)?`,
        p * l,
        `Luas = ${p} × ${l} = ${p * l}.`,
        "Luas = panjang × lebar.",
      );
    }
    if (d == 3) {
      const a = 2 * R(2, 10),
        t = R(3, 12);
      return mk(
        `Luas segitiga alas ${a} cm, tinggi ${t} cm (cm²)?`,
        (a * t) / 2,
        `Luas = ½ × ${a} × ${t} = ${(a * t) / 2}.`,
        "Luas segitiga = ½ × alas × tinggi.",
      );
    }
    if (d == 4) {
      const t = P([
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [6, 8, 10],
        [9, 12, 15],
        [7, 24, 25],
      ]);
      return mk(
        `Segitiga siku-siku dengan sisi tegak ${t[0]} dan ${t[1]}. Panjang sisi miringnya?`,
        t[2],
        `${t[0]}² + ${t[1]}² = ${t[0] ** 2} + ${t[1] ** 2} = ${t[2] ** 2}, akarnya ${t[2]}.`,
        "Pythagoras: c² = a² + b².",
      );
    }
    const k = R(1, 3),
      r = 7 * k;
    return mk(
      `Luas lingkaran jari-jari ${r} cm, π = 22/7 (cm²)?`,
      (22 * r * r) / 7,
      `Luas = 22/7 × ${r} × ${r} = ${(22 * r * r) / 7}.`,
      "Luas lingkaran = π × r × r.",
    );
  },
  alj: (d) => {
    if (d == 1) {
      const a = R(2, 15),
        x = R(2, 20);
      return mk(
        `x + ${a} = ${x + a}. Nilai x?`,
        x,
        `x = ${x + a} − ${a} = ${x}.`,
        "Pindahkan angka ke ruas kanan.",
      );
    }
    if (d == 2) {
      const a = R(2, 9),
        x = R(2, 12);
      return mk(
        `${a}x = ${a * x}. Nilai x?`,
        x,
        `x = ${a * x} ÷ ${a} = ${x}.`,
        `Bagi kedua ruas dengan ${a}.`,
      );
    }
    if (d == 3) {
      const a = R(2, 6),
        x = R(1, 10),
        b = R(1, 15);
      return mk(
        `${a}x + ${b} = ${a * x + b}. Nilai x?`,
        x,
        `${a}x = ${a * x + b} − ${b} = ${a * x}, jadi x = ${x}.`,
        "Kurangi konstanta dulu, baru bagi.",
      );
    }
    if (d == 4) {
      const p = R(1, 6),
        q = R(1, 6);
      return mk(
        `x² − ${p + q}x + ${p * q} = 0. Akar terbesar?`,
        Math.max(p, q),
        `Faktorkan: (x − ${p})(x − ${q}) = 0. Akarnya ${p} dan ${q}.`,
        `Cari dua bilangan: jumlah ${p + q}, hasil kali ${p * q}.`,
      );
    }
    const x = R(3, 12),
      y = R(1, x - 1);
    return mk(
      `x + y = ${x + y} dan x − y = ${x - y}. Nilai x?`,
      x,
      `Jumlahkan kedua persamaan: 2x = ${2 * x}, jadi x = ${x}.`,
      "Jumlahkan kedua persamaan agar y hilang.",
    );
  },
};

/* ---------- Pixel art (hero 16x24, hero battle 32x36, monster 16x16 dunia + 32x32 battle) ---------- */
const SP = {
  hero: {
    p: {
      K: "#1a1530",
      B: "#4a5be0",
      b: "#34318f",
      h: "#8c9bff",
      Y: "#ffd166",
      S: "#f4c9a1",
      s: "#d99f78",
      M: "#c2504a",
      C: "#2fcf9f",
      c: "#1f9c78",
      W: "#d9fff2",
      G: "#b8863b",
      L: "#6b4a35",
      E: "#ffffff",
    },
    m: [
      "....KKKKKKKK....",
      "..KKBBhhBBBBKK..",
      ".KBBBhBBBBBBBbK.",
      ".KBBBBBBBBBBBbK.",
      ".KbYYYYYYYYYYbK.",
      ".KbSSSSSSSSSSbK.",
      ".KSSEKSSSSEKSSK.",
      ".KSSEKSSSSEKSSK.",
      "..KsSSSSSSSSsK.Y",
      "...KSSSMMSSSK.YG",
      "....KKsSSsKK..KG",
      "...KKCCCCCCKK.KG",
      "..KCCCCWWCCCcKSG",
      ".KCCCCWWWWCCCcKG",
      ".KSCCCCWWCCCcKSG",
      ".KSCCCCCCCCCcK.G",
      "..KGGGGYYGGGGK.G",
      "..KbbbbbbbbbbK.G",
      "..KbbbbbbbbbbK.K",
      "...KbbbKKbbbK...",
      "...KbbbK.KbbK...",
      "...KbbbK.KbbK...",
      "..KLLLLK.KLLLK..",
      "..KKKKKK.KKKKK..",
    ],
    f: [
      0,
      [
        "...KbbbK.KbbbK..",
        "...KbbK..KbbK...",
        "..KLLLK..KLLLK..",
        "..KKKKK..KKKKK..",
      ],
      [
        "...KbbbK.KbbbK..",
        "....KbbK.KbbK...",
        "...KLLLK.KLLLK..",
        "...KKKKK.KKKKK..",
      ],
    ],
    oy: 8,
  },
  heroB: {
    p: {
      K: "#1a1530",
      B: "#4a5be0",
      b: "#34318f",
      h: "#8c9bff",
      Y: "#ffd166",
      S: "#f4c9a1",
      s: "#d99f78",
      M: "#c2504a",
      C: "#2fcf9f",
      c: "#1f9c78",
      W: "#d9fff2",
      R: "#c2504a",
      r: "#8e332f",
      T: "#b8863b",
      P: "#3d3a7a",
      p: "#5a56a8",
      L: "#6b4a35",
      l: "#4a3223",
      E: "#ffffff",
    },
    m: [
      "...................KhhK.........",
      ".............KKKKKKhhBhK........",
      "...........KKhhhhhhhBBbK........",
      "..........KhhhBBBBBBBBbK........",
      ".........KhhBBBBBBBBBBBhK.......",
      "..KKK...KhhBBBBBBBBBBBBBhK......",
      ".KhhhKKKhhBBBBBBBBBBBBBBbK......",
      "..KhBhhhhBBBBBBBBBBBBBBBbhK.....",
      "...KhBBBBBBBBBBBSSBBBBBbbK......",
      "....KhBYYYYYYYYYYYYYYYYYYYK.....",
      "..KKYYYYYYYYYYYYYYYYYYYYYYK.....",
      ".KYYYYYYYBBBBBSSSSSSKKKKKK......",
      "KYYYKhYYBBBBBBSSSSSSKSSSsK......",
      "YKKhhYYBBBBBBBSSSSSSSEKKsK......",
      "K.KhYBBBbbBBBBSsSSSSSEEKsKK.....",
      ".KYKKhbbbKhBBBBsSSSSSEEKKKsK....",
      "KYK..KKKhKKhbBBBSSSSSssK..K.....",
      ".K......K..KKhbbbSSSSsKKK.......",
      "...........KKKKKKSSSSsMMMK......",
      "..........KCCCCCCSSSSSCCK.......",
      ".........KRCCCCCCCCCCCCcK.......",
      "........KRRCCCCCCWWWWCCcK.......",
      ".......KRRRCCCCCCWWWWCCcK.......",
      "......KRRRRCCCCCWWWYWWCcK.......",
      ".....KRRRRRRCCCCWWYYYWCCCK......",
      "....KRRRRRRRCCCCCWWWWCCCcK......",
      "...KRRRRRRRRCCCCCWWWWCCCcK......",
      "..KRRRRRRRRRCCCCCCCCCCCCcK......",
      "..KRRRRRRRRRTTTTTTYYYTTTTK......",
      ".KRRRRRRRRrrTTTTTTYYYTTTTK......",
      ".KRRRRRRRrrKPPPPpKKPPPPPpK......",
      ".KRRRRRrrrKKPPPPpK.KPPPPpK......",
      ".KRRrrrrKK.KPPPPpK.KPPPPPPKKK...",
      "KRrrrKKK..KLLLLLLLKKLLLLLLLLLK..",
      "KRKKK.....KLLLLLLlKKLLLLLLLLlK..",
      ".K........KLllllllKKLllllllllK..",
    ],
  },
  slime: {
    p: { K: "#0f1f4a", G: "#4aa8ff", H: "#d2ecff", D: "#2b6fd6", W: "#fff" },
    m: [
      "................",
      "................",
      ".....KKKKKK.....",
      "...KKGGGGGGKK...",
      "..KGGHHGGGGGGK..",
      ".KGGHGGGGGGGGGK.",
      ".KGWWGGGGGWWGGK.",
      ".KGWKGGGGGWKGGK.",
      ".KGGGGGGGGGGGGK.",
      ".KGGGGKKKKGGGGK.",
      "KGGGGGGGGGGGGGGK",
      "KDGGGGGGGGGGGGDK",
      "KDDDDDDDDDDDDDDK",
      ".KKKKKKKKKKKKKK.",
      "................",
      "................",
    ],
    a: [
      [
        "................",
        "................",
        ".....KKKKKK.....",
        "...KKGGGGGGKK...",
        "..KGGHHGGGGGGK..",
        ".KGGHGGGGGGGGGK.",
        ".KGWWGGGGGWWGGK.",
        ".KGWKGGGGGWKGGK.",
        ".KGGGGGGGGGGGGK.",
        ".KGGGGKKKKGGGGK.",
        "KGGGGGGGGGGGGGGK",
        "KDGGGGGGGGGGGGDK",
        "KDDDDDDDDDDDDDDK",
        ".KKKKKKKKKKKKKK.",
        "................",
        "................",
      ],
      [
        "................",
        "................",
        "................",
        "....KKKKKKKK....",
        "..KKGGGGGGGGKK..",
        ".KGGHHGGGGGGGGK.",
        ".KGWWGGGGGWWGGK.",
        ".KGWKGGGGGWKGGK.",
        ".KGGGGGGGGGGGGK.",
        "KGGGGGKKKKGGGGGK",
        "KGGGGGGGGGGGGGGK",
        "KDGGGGGGGGGGGGDK",
        "KDDDDDDDDDDDDDDK",
        "KKKKKKKKKKKKKKKK",
        "................",
        "................",
      ],
    ],
  },
  fox: {
    p: { K: "#2a1830", O: "#f4f0f8", P: "#ffb3c1", W: "#ffffff" },
    m: [
      "..KK........KK..",
      ".KOOK......KOOK.",
      ".KOPOK....KOPOK.",
      ".KOOOKKKKKKOOOK.",
      ".KOOOOOOOOOOOOK.",
      "KOOKKOOOOOOKKOOK",
      "KOOOOOOOOOOOOOOK",
      "KOOWWWWWWWWWWOOK",
      ".KOWWWWKKWWWWOK.",
      ".KOOWWWWWWWWOOK.",
      "..KOOOWWWWOOOK..",
      "...KKOOOOOOKK...",
      "....KKKKKKKK....",
      "................",
      "................",
      "................",
    ],
    a: [
      [
        "..KK........KK..",
        ".KOOK......KOOK.",
        ".KOPOK....KOPOK.",
        ".KOOOKKKKKKOOOK.",
        ".KOOOOOOOOOOOOK.",
        "KOOKKOOOOOOKKOOK",
        "KOOOOOOOOOOOOOOK",
        "KOOWWWWWWWWWWOOK",
        ".KOWWWWKKWWWWOK.",
        ".KOOWWWWWWWWOOK.",
        "..KOOOWWWWOOOK..",
        "...KKOOOOOOKK...",
        "....KKKKKKKK....",
        "................",
        "................",
        "................",
      ],
      [
        "...KK......KK...",
        ".KOOK......KOOK.",
        ".KOPOK....KOPOK.",
        ".KOOOKKKKKKOOOK.",
        ".KOOOOOOOOOOOOK.",
        "KOOOOOOOOOOOOOOK",
        "KOOOOOOOOOOOOOOK",
        "KOOWWWWWWWWWWOOK",
        ".KOWWWWKKWWWWOK.",
        ".KOOWWWWWWWWOOK.",
        "..KOOOWWWWOOOK..",
        "...KKOOOOOOKK...",
        "....KKKKKKKK....",
        "................",
        "................",
        "................",
      ],
    ],
  },
  golem: {
    p: { K: "#161c18", S: "#8a9486", D: "#5d6a5a", Y: "#4fd8ff" },
    m: [
      "....KKKKKKKK....",
      "...KSSSSSSSSK...",
      "...KSYYSSYYSK...",
      "...KSYKSSKYSK...",
      "...KSSSSSSSSK...",
      "...KSSKKKKSSK...",
      ".KKKKSSSSSSKKKK.",
      "KSSSKSDSSDSKSSSK",
      "KSDSKSSSSSSKSDSK",
      "KSSSKSSDDSSKSSSK",
      ".KKKKSSSSSSKKKK.",
      "...KSSSSSSSSK...",
      "...KSSSKKSSSK...",
      "...KSSSK.KSSSK..",
      "..KKKKKK.KKKKKK.",
      "................",
    ],
    a: [
      [
        "....KKKKKKKK....",
        "...KSSSSSSSSK...",
        "...KSYYSSYYSK...",
        "...KSYKSSKYSK...",
        "...KSSSSSSSSK...",
        "...KSSKKKKSSK...",
        ".KKKKSSSSSSKKKK.",
        "KSSSKSDSSDSKSSSK",
        "KSDSKSSSSSSKSDSK",
        "KSSSKSSDDSSKSSSK",
        ".KKKKSSSSSSKKKK.",
        "...KSSSSSSSSK...",
        "...KSSSKKSSSK...",
        "...KSSSK.KSSSK..",
        "..KKKKKK.KKKKKK.",
        "................",
      ],
      [
        "....KKKKKKKK....",
        "...KSSSSSSSSK...",
        "...KSKKSSKKSK...",
        "...KSSSSSSSSK...",
        "...KSSSSSSSSK...",
        "...KSSKKKKSSK...",
        ".KKKKSSSSSSKKKK.",
        "KSSSKSDSSDSKSSSK",
        "KSDSKSSSSSSKSDSK",
        "KSSSKSSDDSSKSSSK",
        ".KKKKSSSSSSKKKK.",
        "...KSSSSSSSSK...",
        "...KSSSKKSSSK...",
        "...KSSSK.KSSSK..",
        "..KKKKKK.KKKKKK.",
        "................",
      ],
    ],
  },
  dragon: {
    p: { K: "#0e0610", P: "#7a1f2e", D: "#3a1a28", Y: "#ffe14d", W: "#fff" },
    m: [
      "..KK........KK..",
      ".KPPK......KPPK.",
      ".KPPPKKKKKKPPPK.",
      ".KPPPPPPPPPPPPK.",
      "KPPPYKPPPPKYPPPK",
      "KPPPPPPPPPPPPPPK",
      "KPPPPPPPPPPPPPPK",
      ".KPPWWWWWWWWPPK.",
      ".KPPWKWKKWKWPPK.",
      "..KPPWWWWWWPPK..",
      "KKKPPPPPPPPPPKKK",
      "KDDKPPPPPPPPKDDK",
      "KDDDKPPPPPPKDDDK",
      ".KDDKPPKKPPKDDK.",
      "..KKK.KKKK.KKK..",
      "................",
    ],
    a: [
      [
        "..KK........KK..",
        ".KPPK......KPPK.",
        ".KPPPKKKKKKPPPK.",
        ".KPPPPPPPPPPPPK.",
        "KPPPYKPPPPKYPPPK",
        "KPPPPPPPPPPPPPPK",
        "KPPPPPPPPPPPPPPK",
        ".KPPWWWWWWWWPPK.",
        ".KPPWKWKKWKWPPK.",
        "..KPPWWWWWWPPK..",
        "KKKPPPPPPPPPPKKK",
        "KDDKPPPPPPPPKDDK",
        "KDDDKPPPPPPKDDDK",
        ".KDDKPPKKPPKDDK.",
        "..KKK.KKKK.KKK..",
        "................",
      ],
      [
        "..KK........KK..",
        ".KPPK......KPPK.",
        ".KPPPKKKKKKPPPK.",
        ".KPPPPPPPPPPPPK.",
        "KPPPYKPPPPKYPPPK",
        "KPPPPPPPPPPPPPPK",
        "KPPPPPPPPPPPPPPK",
        ".KPPWWWWWWWWPPK.",
        ".KPPWKWKKWKWPPK.",
        "KDKPPWWWWWWPPKDK",
        "KDDKPPPPPPPPKDDK",
        ".KDKPPPPPPPPKDK.",
        "..KKKPPPPPPKKK..",
        ".KDDKPPKKPPKDDK.",
        "..KKK.KKKK.KKK..",
        "................",
      ],
    ],
  },
  slimeL: {
    p: {
      K: "#0f1f4a",
      G: "#4aa8ff",
      H: "#d2ecff",
      D: "#2b6fd6",
      d: "#1f55a8",
      W: "#ffffff",
      C: "#1a3f8a",
      M: "#0f1f4a",
      T: "#ff8aa0",
      X: "#a8d8ff",
    },
    m: [
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "................................",
      "............KKKKKKKK............",
      "..........KKHHHHHHHHKK..........",
      "........KKHHHGGGGGCCCHKK........",
      ".......KHHHGGGGGGGCGGGHHK.......",
      "......KHWWWWGXGGGGCGGGGGHK......",
      ".....KHHWWWWGGGGGGGCGGGGGHK.....",
      "....KHHGWWWWWGGGGGGWWWWGGGHK....",
      "....KHGGWWWWWGGGGGCWWWWGGGDK....",
      "...KHHGGWWWWWWGGGGWWWWWWGGGHK...",
      "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
      "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
      "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
      "...KHGGGGWWWWGGGGGGWWWWGGGGDK...",
      "...KHGGGGWWWWGGGGGGWWWWGGGGDK...",
      "...KHGGGGGGGGGGGGGGGGGGGGGGDK...",
      "..KHHGGGGGGGGGGGGGGGGGGGGGGGHK..",
      ".KHHGGGXGGGGMMGGGGMMMGGGGXGGGHK.",
      ".KHGGGGGGGGGGGMMMMMGGGGGGGGGGDK.",
      ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
      ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
      ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
      ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
      ".KHDDDDDDDDDDDDDDDDDDDDDDDDDDDK.",
      "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
    ],
    a: [
      [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "............KKKKKKKK............",
        "..........KKHHHHHHHHKK..........",
        "........KKHHHGGGGGCCCHKK........",
        ".......KHHHGGGGGGGCGGGHHK.......",
        "......KHWWWWGXGGGGCGGGGGHK......",
        ".....KHHWWWWGGGGGGGCGGGGGHK.....",
        "....KHHGWWWWWGGGGGGWWWWGGGHK....",
        "....KHGGWWWWWGGGGGCWWWWGGGDK....",
        "...KHHGGWWWWWWGGGGWWWWWWGGGHK...",
        "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
        "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
        "...KHGGGWKKWWWGGGGWKKWWWGGGDK...",
        "...KHGGGGWWWWGGGGGGWWWWGGGGDK...",
        "...KHGGGGWWWWGGGGGGWWWWGGGGDK...",
        "...KHGGGGGGGGGGGGGGGGGGGGGGDK...",
        "..KHHGGGGGGGGGGGGGGGGGGGGGGGHK..",
        ".KHHGGGXGGGGMMGGGGMMMGGGGXGGGHK.",
        ".KHGGGGGGGGGGGMMMMMGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHDDDDDDDDDDDDDDDDDDDDDDDDDDDK.",
        "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      ],
      [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........KKKKKKKKKK...........",
        "........KKKHHHHHHHHHHKKK........",
        ".......KHHHHGGGGGGCCCHHHK.......",
        ".....KKHHGGGGGGGGGCGGGGGHKK.....",
        "....KHHHWWWWWXGGGGCWWWWGGHHK....",
        "...KHHGGWWWWWGGGGGGWWWWGGGGHK...",
        "...KHGGGWWWWWWGGGGWWWWWWGGGDK...",
        "..KHHGGGWKKWWWGGGGWKKWWWGGGGHK..",
        "..KHGGGGWKKWWWGGGGWKKWWWGGGGDK..",
        "..KHGGGGWKKWWWGGGGWKKWWWGGGGDK..",
        "..KHGGGGGWWWWGGGGGGWWWWGGGGDDK..",
        "..KKHGGGGWWWWGGGGGCWWWWGGGGDKK..",
        ".KHHHGGGGGGGGGGGGGGGGGGGGGGGHHK.",
        "KHHGGGGGGGGGGGGGGGGGGGGGGGGGGGHK",
        "KHGGGGGXGGGGMMGGGGMMMGGGGXGGGDDK",
        ".KHGGGGGGGGGGGMMMMMGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHDDDDDDDDDDDDDDDDDDDDDDDDDDDK.",
        "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      ],
      [
        "................................",
        "................................",
        "................................",
        "................................",
        ".............KKKKKK.............",
        "...........KKHHHHHHKK...........",
        ".........KKHHHGGGGCCCKK.........",
        "........KHHHGGGGGGCGGHHK........",
        ".......KWWWWGXGGGGCGGGGHK.......",
        "......KHWWWWGGGGGGGCGGGGHK......",
        "......KHWWGGGGGGGGGCCGGGDK......",
        ".....KHHKKKGGGGGGGCGGKKKKHK.....",
        ".....KHGGGKKKGGGGGCKKKGGGDK.....",
        "....KHHGGWWWWKGGGGCKWWWGGGHK....",
        "....KHGGWWWWWWGGGGWWWWWWGGDK....",
        "....KHGGWKKWWWGGGGWKKWWWGGDK....",
        "....KHGGWKKWWWGGGGWKKWWWGGDK....",
        "....KHGGWWWWWWGGGGWWWWWWGGDK....",
        "....KHGGGWWWWGGGGGGWWWWGGGDK....",
        "....KHGGGGGGGGGGGGGGGGGGGGDK....",
        "....KHGGGGGGGMMMMMMGGGGGGGDK....",
        "...KHHGGGGGGWWMMMMWWGGGGGGGHK...",
        "..KHHGGXGGGGMMMMMMMMGGGGGXGGHK..",
        "..KHGGGGGGGGMTTTTTTMGGGGGGGGDK..",
        ".KHHGGGGGGGGMTTTTTTMGGGGGGGGGHK.",
        ".KHGGGGGGGGGGMMMMMMGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHGGGGGGGGGGGGGGGGGGGGGGGGGGDK.",
        ".KHDDDDDDDDDDDDDDDDDDDDDDDDDDDK.",
        "..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
      ],
    ],
  },
  foxL: {
    p: {
      K: "#2a1830",
      O: "#f4f0f8",
      o: "#cfc6dc",
      H: "#ffffff",
      W: "#ffffff",
      w: "#d8d0e6",
      P: "#ffb3c1",
      E: "#e0243c",
      R: "#c8283e",
      T: "#ff6b8b",
    },
    m: [
      "...K....................K.......",
      "..KHK..................KHK......",
      "..KHHK................KHoK......",
      "..KHOHK..............KHHoK......",
      "..KHPOHK..KKKKKKKK..KHHPoK......",
      ".KHHPPOHKKHHHHHHHHKKHHPPoK......",
      ".KHPPPPOHHHOORROOOHHHPPPPHKKKK..",
      ".KHPPPOOOOOOOROOOOOOOOPPPOWWWWK.",
      ".KHPPOOOOOOOOROOOOOOOOOPPOWWWWWK",
      ".KHoOKKKOOOOOROOOOOOKKKKOOWWWWWW",
      ".KHKHOOOKKKOOOROOKKKOOOOOOWWWWWw",
      "..KHHOOOOOOKOOOROKOOOOOOOWWWWWWw",
      "..KHOOEEWKEOOOOOOEKWEEOOOWWWWWWw",
      ".KKHOOEEKKEOOOOOOEKKEEOOOWWWWWWw",
      "KWKHOOEEKKEWWWWWWEKKEEOOOWWWWWWw",
      "KWWWWOOOOWWWWWWWWWWOOOWWWWWWWWWw",
      ".KWWWWWOWWWWWKKKWWWWOWWWWWWWWWWo",
      ".KWWwwOOWWWWWKKKWWWWOOWWWWWWWWOo",
      ".KWWwKHoWWWWWWWWWWWwoOOWWWOOOOoo",
      ".KWwwKKKHWWWKKWKKKWoKHOWWWOOOOoK",
      "..KWK..KHOWWWWKKWWOoKHOOWOOOOOoK",
      "...K..KHHOOWWWWWWOOOHHOOOOOOOooK",
      ".....KHHOOOWWWWWWOOOOOOOOOOOOoK.",
      ".....KHOOOWWWWWWWWOOOOOOOOOOooK.",
      ".....KHOOOWWWWWWWWOOOOOOOOOooK..",
      ".....KHOOOWWWWWWWWOOOOOOOOooK...",
      ".....KHOOOWWWWWWWWOOOOOOOooK....",
      ".....KHOOOOOWWWWOOOOOOOOooK.....",
      "......KHOOOOWWWWOOOOOOOooK......",
      "......KHOOOOWWWWOOOOooooK.......",
      "......KWWWWwwwwwWWWWwKKK........",
      "......KWwwwwKKKKWwwwwK..........",
    ],
    a: [
      [
        "...K....................K.......",
        "..KHK..................KHK......",
        "..KHHK................KHoK......",
        "..KHOHK..............KHHoK......",
        "..KHPOHK..KKKKKKKK..KHHPoK......",
        ".KHHPPOHKKHHHHHHHHKKHHPPoK......",
        ".KHPPPPOHHHOORROOOHHHPPPPHKKKK..",
        ".KHPPPOOOOOOOROOOOOOOOPPPOWWWWK.",
        ".KHPPOOOOOOOOROOOOOOOOOPPOWWWWWK",
        ".KHoOKKKOOOOOROOOOOOKKKKOOWWWWWW",
        ".KHKHOOOKKKOOOROOKKKOOOOOOWWWWWw",
        "..KHHOOOOOOKOOOROKOOOOOOOWWWWWWw",
        "..KHOOEEWKEOOOOOOEKWEEOOOWWWWWWw",
        ".KKHOOEEKKEOOOOOOEKKEEOOOWWWWWWw",
        "KWKHOOEEKKEWWWWWWEKKEEOOOWWWWWWw",
        "KWWWWOOOOWWWWWWWWWWOOOWWWWWWWWWw",
        ".KWWWWWOWWWWWKKKWWWWOWWWWWWWWWWo",
        ".KWWwwOOWWWWWKKKWWWWOOWWWWWWWWOo",
        ".KWWwKHoWWWWWWWWWWWwoOOWWWOOOOoo",
        ".KWwwKKKHWWWKKWKKKWoKHOWWWOOOOoK",
        "..KWK..KHOWWWWKKWWOoKHOOWOOOOOoK",
        "...K..KHHOOWWWWWWOOOHHOOOOOOOooK",
        ".....KHHOOOWWWWWWOOOOOOOOOOOOoK.",
        ".....KHOOOWWWWWWWWOOOOOOOOOOooK.",
        ".....KHOOOWWWWWWWWOOOOOOOOOooK..",
        ".....KHOOOWWWWWWWWOOOOOOOOooK...",
        ".....KHOOOWWWWWWWWOOOOOOOooK....",
        ".....KHOOOOOWWWWOOOOOOOOooK.....",
        "......KHOOOOWWWWOOOOOOOooK......",
        "......KHOOOOWWWWOOOOooooK.......",
        "......KWWWWwwwwwWWWWwKKK........",
        "......KWwwwwKKKKWwwwwK..........",
      ],
      [
        "..K.....................K.......",
        ".KHK...................KHK......",
        ".KHHK.................KHoK......",
        ".KHOHK...............KHHoK......",
        ".KHPOHK...KKKKKKKK..KHHPoK......",
        ".KHPPOHKKKHHHHHHHHKKHHPPoK......",
        ".KHPPPOHHHHOORROOOHHHPPPPHK.KKKK",
        ".KHPPPOOOOOOOROOOOOOOOPPPoKKWWWW",
        ".KHPPOOOOOOOOROOOOOOOOOPPoKWWWWw",
        ".KHoOKKKOOOOOROOOOOOKKKKoOWWWWWw",
        ".KHKHOOOKKKOOOROOKKKOOOoKHWWWWWw",
        "..KHHOOOOOOKOOOROKOOOOOOHKWWWWWw",
        "..KHOOEEWKEOOOOOOEKWEEOOOWWWWWWw",
        ".KKHOOEEKKEOOOOOOEKKEEOOOWWWWWWw",
        "KWKHOOEEKKEWWWWWWEKKEEOOOWWWWWWw",
        "KWWWWOOOOWWWWWWWWWWOOOWWWWWWWWWw",
        ".KWWWWWOWWWWWKKKWWWWOWWWWWWWWWWw",
        ".KWWwwOOWWWWWKKKWWWWOOWWWWOWWWWw",
        ".KWWwKHoWWWWWWWWWWWwooOWWWOOOOOo",
        ".KWwwKKKHWWWKKWKKKWoKKHWWWOOOOOo",
        "..KWK..KHOWWWWKKWWOoKKHOWOOOOOOo",
        "...K..KHHOOWWWWWWOOOHHHOOOOOOOoo",
        ".....KHHOOOWWWWWWOOOOOOOOOOOOooK",
        ".....KHOOOWWWWWWWWOOOOOOOOOOooK.",
        ".....KHOOOWWWWWWWWOOOOOOOOOOoK..",
        ".....KHOOOWWWWWWWWOOOOOOOOOooK..",
        ".....KHOOOWWWWWWWWOOOOOOOoooK...",
        ".....KHOOOOOWWWWOOOOOOOOooKK....",
        "......KHOOOOWWWWOOOOOOOooK......",
        "......KHOOOOWWWWOOOOooooK.......",
        "......KWWWWwwwwwWWWWwKKK........",
        "......KWwwwwKKKKWwwwwK..........",
      ],
      [
        "...K....................K.......",
        "..KHK..................KHK......",
        "..KHHK................KHoK......",
        "..KHOHK..............KHHoK......",
        "..KHPOHK............KHHPoK......",
        ".KHHPPOHK.KKKKKKKK.KHHPPoK......",
        ".KHPPPPOHKHHHHHHHHKHHPPPPHKKK...",
        ".KHPPPPPOHHOORROOOHHPPPPPOWWWK..",
        ".KHPPOOOOOOOOROOOOOOOOPPPOWWWWK.",
        ".KHoOOOOOOOOOROOOOOOOOOOOOWWWWHK",
        ".KHKHKKKOOOOOROOOOOOKKKKWOWWWWwK",
        "..KKHOOOKKKOOOROOKKKOOOOWWWWWWwK",
        "..KHHOOOOOOKOOOROKOOOOOOOWWWWWwK",
        "..KHOOTTWKTOOOOOOTKWTTOOOWWWWWwK",
        ".KKHOOTTKKTOOOOOOTKKTTOOOWWWWWwK",
        "KWKHOOTTKKTWWWWWWTKKTTOOOWWWWWwK",
        "KWWWWOOOOWWWWWWWWWWOOOWWWWWWWWoK",
        ".KWWWWWOWWWWWKKKWWWWOWWWWWWWWOoK",
        ".KWWwwOOWWWWWKKKWWWWOOWWWWOOOOoK",
        ".KWWwKHoWWWWWWWWWWWWOOOWWWOOOooK",
        ".KWwwKKKHWWKKKKKKWWOOOOWWWOOOoK.",
        "..KWK.KHHOWWKKKKKWOOOOOOWOOOOoK.",
        "...K.KHHOOOKTTTTKOOOOOOOOOOOooK.",
        ".....KHOOOWKKKKKKWOOOOOOOOOooK..",
        ".....KHOOOWWWWWWWWOOOOOOOOOoK...",
        ".....KHOOOWWWWWWWWOOOOOOOOooK...",
        ".....KHOOOWWWWWWWWOOOOOOOooK....",
        ".....KHOOOOOWWWWOOOOOOOOooK.....",
        "......KHOOOOWWWWOOOOOOOooK......",
        "......KHOOOOWWWWOOOOooooK.......",
        "......KWWWWwwwwwWWWWwKKK........",
        "......KWwwwwKKKKWwwwwK..........",
      ],
    ],
  },
  golemL: {
    p: {
      K: "#161c18",
      S: "#8a9486",
      s: "#aab4a2",
      D: "#5d6a5a",
      d: "#414c40",
      Y: "#4fd8ff",
      y: "#bff4ff",
      M: "#4aa86a",
      m: "#2f7a48",
      R: "#4fd8ff",
      r: "#1f7a9a",
    },
    m: [
      "...........KssssssssK...........",
      "..........KssSSSSSSSsK..........",
      "..........KsSSSSSSSSDK..........",
      "..........KsKKKSSKKKDK..........",
      "..........KsYYYSSYYYDK..........",
      "..........KsYYYSSYYYDK..........",
      "..........KsSSSSSSSSDK..........",
      "....KKKK..KsSSKSKSKSDK..KKKK....",
      "..KKssssKKKsSKKKKKKSDKKKssssKK..",
      ".KsMsSSSsMssSSSSSSSSSssssSSSssK.",
      ".KMSMSSSMmSSSSSSSSSSSSSSMMSSSDK.",
      ".KsmSSSSSKSSSSSSSSSSSSSSSSSSSDK.",
      ".KsSSSSSSKKSSSSSSSSSSSSSSSSSSDK.",
      ".KsSSSSSSSKSSSSddSSSSSSSSSSSSDK.",
      ".KsSSSSSSSKKSSdRRdSSSSSSSSSSSDK.",
      ".KsSSSSSSSKRRRRRYRdRRRSSSSSSSDK.",
      ".KsSSSSKSSKSSdRYRRdSSSSSKSSSSDK.",
      ".KsSSSSddddddSdRRdSSSSSSKSSSSDK.",
      ".KsSSSSKSSSSSSSddSSSSSSSKSddddK.",
      ".KsddddKSSSSSSSSSSSSddddddSSSDK.",
      ".KsSSSDKsSSSSSSSSSSSSSSDKsSSSDK.",
      ".KsSSSDKsSSSdSSSRSSSdSKKKsSSSDK.",
      "KssSSSSKsSSSdSSSRSSSdKKSKsSSSSsK",
      "ssSSSSSKSSSSdSDDRSSSdKSSKSSSSSSs",
      "sSSSSSSSSSSSSSDKKsSSSKSSSSSSSSSD",
      "sSSSSSSSSSSSSSDKKsSSSSSSSSSSSSSD",
      "sSSSSSSDDSdSSSDKKsSSSSdDSSSSSSDD",
      "KsSSSSSDKsdSSSDKKsSSSSdKsSSSSDDK",
      ".KsDDDDSssdSSSSsssSSSSdsDDDDDDK.",
      "..KKKKKsSSSSSSSSSSSSSSSSDKKKKK..",
      "......KsDSSSSDDDDDSSSSDDDK......",
      ".......KKsDDDDKKKKsDDDDKK.......",
    ],
    a: [
      [
        "...........KssssssssK...........",
        "..........KssSSSSSSSsK..........",
        "..........KsSSSSSSSSDK..........",
        "..........KsKKKSSKKKDK..........",
        "..........KsYYYSSYYYDK..........",
        "..........KsYYYSSYYYDK..........",
        "..........KsSSSSSSSSDK..........",
        "....KKKK..KsSSKSKSKSDK..KKKK....",
        "..KKssssKKKsSKKKKKKSDKKKssssKK..",
        ".KsMsSSSsMssSSSSSSSSSssssSSSssK.",
        ".KMSMSSSMmSSSSSSSSSSSSSSMMSSSDK.",
        ".KsmSSSSSKSSSSSSSSSSSSSSSSSSSDK.",
        ".KsSSSSSSKKSSSSSSSSSSSSSSSSSSDK.",
        ".KsSSSSSSSKSSSSddSSSSSSSSSSSSDK.",
        ".KsSSSSSSSKKSSdRRdSSSSSSSSSSSDK.",
        ".KsSSSSSSSKRRRRRYRdRRRSSSSSSSDK.",
        ".KsSSSSKSSKSSdRYRRdSSSSSKSSSSDK.",
        ".KsSSSSddddddSdRRdSSSSSSKSSSSDK.",
        ".KsSSSSKSSSSSSSddSSSSSSSKSddddK.",
        ".KsddddKSSSSSSSSSSSSddddddSSSDK.",
        ".KsSSSDKsSSSSSSSSSSSSSSDKsSSSDK.",
        ".KsSSSDKsSSSdSSSRSSSdSKKKsSSSDK.",
        "KssSSSSKsSSSdSSSRSSSdKKSKsSSSSsK",
        "ssSSSSSKSSSSdSDDRSSSdKSSKSSSSSSs",
        "sSSSSSSSSSSSSSDKKsSSSKSSSSSSSSSD",
        "sSSSSSSSSSSSSSDKKsSSSSSSSSSSSSSD",
        "sSSSSSSDDSdSSSDKKsSSSSdDSSSSSSDD",
        "KsSSSSSDKsdSSSDKKsSSSSdKsSSSSDDK",
        ".KsDDDDSssdSSSSsssSSSSdsDDDDDDK.",
        "..KKKKKsSSSSSSSSSSSSSSSSDKKKKK..",
        "......KsDSSSSDDDDDSSSSDDDK......",
        ".......KKsDDDDKKKKsDDDDKK.......",
      ],
      [
        "...........KssssssssK...........",
        "..........KssSSSSSSSsK..........",
        "..........KsSSSSSSSSDK..........",
        "..........KsKKKSSKKKDK..........",
        "..........KsyyySSyyyDK..........",
        "..........KsyyySSyyyDK..........",
        "....KKKK..KsSSSSSSSSDK..KKKK....",
        "..KKssssKKKsSSKSKSKSDKKKssssKK..",
        ".KsssSSSssKsSKKKKKKSDKsssSSSssK.",
        ".KsMSSSSSMssSSSSSSSSSssSSSSSSDK.",
        ".KMSMSSSMmSSSSSSSSSSSSSSMMSSSDK.",
        ".KsmSSSSSKSSSSSSSSSSSSSSSSSSSDK.",
        ".KsSSSSSSKKSSSSSSSSSSSSSSSSSSDK.",
        ".KsSSSSSSSKSSSSddSSSSSSSSSSSSDK.",
        ".KsSSSSSSSKKSSdrrdSSSSSSSSSSSDK.",
        ".KsSSSSKSSKrrrrrYrdrrrSSKSSSSDK.",
        ".KsSSSSKSSKSSdrYrrdSSSSSKSSSSDK.",
        ".KsSSSSddddddSdrrdSSSSSSKSddddK.",
        ".KsddddKSSSSSSSddSSSSSSSKSSSSDK.",
        ".KsSSSDKSSSSSSSSSSSSddddddSSSDK.",
        ".KsSSSDKsSSSSSSSSSSSSSSDKsSSSDK.",
        "KssSSSSKsSSSdSSSrSSSdSKKKsSSSSsK",
        "ssSSSSSKSSSSdSSSrSSSdKKSKSSSSSSs",
        "sSSSSSSSSSSSdSDDrSSSdKSSSSSSSSSD",
        "sSSSSSSSSSSSSSDKKsSSSKSSSSSSSSSD",
        "sSSSSSSDDSSSSSDKKsSSSSDDSSSSSSDD",
        "KsSSSSDDKsdSSSDKKsSSSSdKsSSSSDDK",
        ".KsDDDDKKsdSSSDKKsSSSSdKKsDDDDK.",
        "..KKKKKsssdSSSSsssSSSSdssKKKKK..",
        "......KsSSSSSSSSSSSSSSSSDK......",
        "......KsDSSSSDDDDDSSSSDDDK......",
        ".......KKsDDDDKKKKsDDDDKK.......",
      ],
      [
        "...........KssssssssK...........",
        "..........KssSSSSSSSsK..........",
        "..........KsSSSSSSSSDK..........",
        "..........KsKKKSSKKKDK..........",
        "....KKKK..KsYYYSSYYYDK..KKKK....",
        "..KKssssKKKsYYYSSYYYDKKKssssKK..",
        ".KsssSSSssKsSSSSSSSSDKsssSSSssK.",
        ".KsSSSSSSDKsSSKKKKSSDKsSSSSSSDK.",
        ".KsSSSSSSDKsSKKKKKKSDKsSSSSSSDK.",
        ".KsMSSSSSMssSSSSSSSSSssSSSSSSDK.",
        ".KMSMSSSMmSSSSSSSSSSSSSSMMSSSDK.",
        ".KsmSSSKSKSSSSSSSSSSSSSSKSSSSDK.",
        ".KsSSSSKSKKSSSSSSSSSSSSSKSSSSDK.",
        ".KsSSSSKSSKSSSSddSSSSSSSKSddddK.",
        ".KsddddKSSKKSSdRRdSSSSSSKSSSSDK.",
        ".KsSSSSKSSKRRRRRYRdRRRSSKSSSSDK.",
        ".KsSSSSKSSKSSdRYRRdSSSSSKSSSSDK.",
        "KssSSSSddddddSdRRdSSSSSSKSSSSSsK",
        "ssSSSSSKSSSSSSSddSSSSSSSKSSSSSSs",
        "sSSSSSSSSSSSSSSSSSSSddddddSSSSSD",
        "sSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSD",
        "sSSSSSSSSSSSdSSSRSSSdSKKSSSSSSDD",
        "KsSSSSDDSSSSdSSSRSSSdKKDDSSSSDDK",
        ".KsDDDDKsSSSdSDDRSSSdKDDKsDDDDK.",
        "..KKKKK.KsSSSSDKKsSSSKDK.KKKKK..",
        "........KsSSSSDKKsSSSSDK........",
        "........KsdSSSDKKsSSSSdK........",
        ".......KKsdSSSDKKsSSSSdKK.......",
        "......KsssdSSSSsssSSSSdssK......",
        "......KsSSSSSSSSSSSSSSSSDK......",
        "......KsDSSSSDDDDDSSSSDDDK......",
        ".......KKsDDDDKKKKsDDDDKK.......",
      ],
    ],
  },
  dragonL: {
    p: {
      K: "#0e0610",
      P: "#7a1f2e",
      p: "#b03a4c",
      D: "#3a1a28",
      d: "#241018",
      Y: "#ffe14d",
      W: "#ffffff",
      B: "#f0d0c8",
      b: "#d09890",
      F: "#ff8a2b",
      f: "#ffd166",
      H: "#e8d8d0",
      w: "#9a2a3c",
      N: "#1a0a14",
    },
    m: [
      ".....KHK.......KK......KKHK.....",
      "......KHKK....KDDK....KHHK......",
      "......KHHHK.KKDDDDKK.KHHHK......",
      "......KHHHKKpppPPPppKKHHHK......",
      ".K.....KHKpppPPPPPPPppKHK....KK.",
      "KDK.....KpKKPPPPPPPKKKpK....KDDK",
      "KwDK....KpPPKKPPPKKPPPDK...KDdK.",
      "KwDDK..KppPYKYKPPKYKYPPpK.KDDdK.",
      "wwwDK..KpPPYKYPPPPYKYPPDK.KDwwwK",
      "wwwwDK.KpPPYKYPPPPYKYPPDKKDwwwdK",
      "wwwwDDKKpPPPPPPPPPPPPPDDKDDwwwdK",
      "wwwwwDDKKpPPPPPPPPPPPPDKDDwwwwdK",
      "wwwwwwDKKpPPPPPPPPPPPDDKDwwwwddK",
      "KwDwwwwDKKpPPPKPPPKPDDKDwwwwDDK.",
      "KwwDwwwDDKKpPPPPPPPPDKDDwwwDdK..",
      ".KwdDDwwDwKpPPPPPPPPPwDwwDDddK..",
      "..KwKDDwwDKpKKKKKKKKKDwwDDDdK...",
      "...KKwDDwwppWPWPPPWPWPwDDdKK....",
      ".....KwDDPPPPPPPPPPPPPPDdK......",
      ".....KwwPPPPbbPPPPbbPPPPdK...K..",
      ".....KwwPPPPBBBBBBBBPPPDdK..KDK.",
      "......KwPPPBbbbbbbbbbPPDK.KKpDK.",
      "......KwPPPBBBBBBBBBBPPDKKppDDK.",
      ".......KpPPBbbbbbbbbbPPPpppDDK..",
      ".......KpPPBBBBBBBBBBPPPPPPDK...",
      ".......KpPPBbbbbbbbbbPPPPPDDK...",
      ".......KpPPPPBBBBBBPPPPPPDDK....",
      "......KppPPPPPbbbbPPPPPPPDK.....",
      ".....KppPPPPPPPBBPPPPPPPDDK.....",
      "......KpPPPPPPBBBBPPPPPDDK......",
      ".......KpDDDDDDDDDDDDDDDK.......",
      ".......KWKWKWKKKKKKWKWKWK.......",
    ],
    a: [
      [
        ".....KHK.......KK......KKHK.....",
        "......KHKK....KDDK....KHHK......",
        "......KHHHK.KKDDDDKK.KHHHK......",
        "......KHHHKKpppPPPppKKHHHK......",
        ".K.....KHKpppPPPPPPPppKHK....KK.",
        "KDK.....KpKKPPPPPPPKKKpK....KDDK",
        "KwDK....KpPPKKPPPKKPPPDK...KDdK.",
        "KwDDK..KppPYKYKPPKYKYPPpK.KDDdK.",
        "wwwDK..KpPPYKYPPPPYKYPPDK.KDwwwK",
        "wwwwDK.KpPPYKYPPPPYKYPPDKKDwwwdK",
        "wwwwDDKKpPPPPPPPPPPPPPDDKDDwwwdK",
        "wwwwwDDKKpPPPPPPPPPPPPDKDDwwwwdK",
        "wwwwwwDKKpPPPPPPPPPPPDDKDwwwwddK",
        "KwDwwwwDKKpPPPKPPPKPDDKDwwwwDDK.",
        "KwwDwwwDDKKpPPPPPPPPDKDDwwwDdK..",
        ".KwdDDwwDwKpPPPPPPPPPwDwwDDddK..",
        "..KwKDDwwDKpKKKKKKKKKDwwDDDdK...",
        "...KKwDDwwppWPWPPPWPWPwDDdKK....",
        ".....KwDDPPPPPPPPPPPPPPDdK......",
        ".....KwwPPPPbbPPPPbbPPPPdK...K..",
        ".....KwwPPPPBBBBBBBBPPPDdK..KDK.",
        "......KwPPPBbbbbbbbbbPPDK.KKpDK.",
        "......KwPPPBBBBBBBBBBPPDKKppDDK.",
        ".......KpPPBbbbbbbbbbPPPpppDDK..",
        ".......KpPPBBBBBBBBBBPPPPPPDK...",
        ".......KpPPBbbbbbbbbbPPPPPDDK...",
        ".......KpPPPPBBBBBBPPPPPPDDK....",
        "......KppPPPPPbbbbPPPPPPPDK.....",
        ".....KppPPPPPPPBBPPPPPPPDDK.....",
        "......KpPPPPPPBBBBPPPPPDDK......",
        ".......KpDDDDDDDDDDDDDDDK.......",
        ".......KWKWKWKKKKKKWKWKWK.......",
      ],
      [
        ".....KHK.......KK......KKHK.....",
        "......KHKK....KDDK....KHHK......",
        "......KHHHK.KKDDDDKK.KHHHK......",
        "......KHHHKKpppPPPppKKHHHK......",
        ".......KHKpppPPPPPPPppKHK.......",
        "........KpKKPPPPPPPKKKpK........",
        "........KpPPKKPPPKKPPPDK........",
        ".......KppPYKYKPPKYKYPPpK.......",
        ".......KpPPYKYPPPPYKYPPDK.......",
        ".K.....KpPPYKYPPPPYKYPPDK....K..",
        "KwK....KpPPPPPPPPPPPPPDDK...KwK.",
        "KDDKK...KpPPPPPPPPPPPPDK..KKDDDK",
        "KwDDwK..KpPPPPPPPPPPPDDK.KwDDdK.",
        "KwwwDDKK.KpPPPKPPPKPDDKKKDDwwdK.",
        "wwwwwDDwK.KpPPPPPPPPDKKwDDwwwwwK",
        "wwwwwwwDDKKpPPPPPPPPDKDDwwwwwwdK",
        "wwwwwwwwDDKpKKKKKKKKKDDwwwwwwwdK",
        "wwwwwwwwwwppWPWPPPWPWPwwwwwwwwdK",
        "wwwwwwwwwPPPPPPPPPPPPPPwwwwwwddK",
        "KwDDDDDDPPPPbbPPPPbbPPPPDDDDDDK.",
        ".KwwwwwwPPPPBBBBBBBBPPPPwwwddDK.",
        "..KwdDDDPPPBbbbbbbbbbPPPDDwdKDpK",
        "...KKDddPPPBBBBBBBBBBPPPdKDPpDDK",
        ".....KKKpPPBbbbbbbbbbPPPPppPDDK.",
        ".......KpPPBBBBBBBBBBPPPPPPDDK..",
        ".......KpPPBbbbbbbbbbPPPPPDDK...",
        ".......KpPPPPBBBBBBPPPPPPDDK....",
        "......KppPPPPPbbbbPPPPPPPDK.....",
        ".....KppPPPPPPPBBPPPPPPPDDK.....",
        "......KpPPPPPPBBBBPPPPPDDK......",
        ".......KpDDDDDDDDDDDDDDDK.......",
        ".......KWKWKWKKKKKKWKWKWK.......",
      ],
      [
        ".....KHK.......KK......KKHK.....",
        "......KHKK....KDDK....KHHK......",
        "......KHHHK.KKDDDDKK.KHHHK......",
        ".K....KHHHKKpppPPPppKKHHHK...KK.",
        "KDK....KHKpppPPPPPPPppKHK...KDDK",
        "KwDK....KpKKPPPPPPPKKKpK...KDDK.",
        "KwDDK...KpPPKKPPPKKPPPDK...KDdK.",
        "wwwDK..KppPYKYKPPKYKYPPpK.KDwwwK",
        "wwwwDK.KpPPYKYPPPPYKYPPDKKDDwwdK",
        "wwwwDDKKpPPYKYPPPPYKYPPDKwDwwwdK",
        "wwwwwDKKpPPPPPPPPPPPPPDDKDwwwwdK",
        "wwwwwwDKKpPPPPPPPPPPPPDKDDwwwddK",
        "KwDwwwDDKpPPPPPPPPPPPDDwDwwwDDK.",
        "KwwDwwwDKKpPPPKPPPKPDDKDwwwDdK..",
        ".KwdDwwwDKKpPNNNNNNPDKDDwwDddK..",
        "..KwKDwwDDKpWNWNNNWNWwDwwDDdK...",
        "...KKwDwwDKNNNFFFFNNNDwwDdKK....",
        ".....KDDwwpNNFffffFNNPwDDK......",
        ".....KwDDPPPNFffffFNPPPDdK......",
        ".....KwwPPPPbNFFFFNbPPPPdK...K..",
        ".....KwwPPPPBBBBBBBBPPPDdK..KDK.",
        "......KwPPPBbbbbbbbbbPPDK.KKpDK.",
        "......KwPPPBBBBBBBBBBPPDKKppDDK.",
        ".......KpPPBbbbbbbbbbPPPpppDDK..",
        ".......KpPPBBBBBBBBBBPPPPPPDK...",
        ".......KpPPBbbbbbbbbbPPPPPDDK...",
        ".......KpPPPPBBBBBBPPPPPPDDK....",
        "......KppPPPPPbbbbPPPPPPPDK.....",
        ".....KppPPPPPPPBBPPPPPPPDDK.....",
        "......KpPPPPPPBBBBPPPPPDDK......",
        ".......KpDDDDDDDDDDDDDDDK.......",
        ".......KWKWKWKKKKKKWKWKWK.......",
      ],
    ],
  },
};

/* ---------- Data musuh ---------- */
const E = [
  {
    n: "Slime Retak",
    sp: "slime",
    hp: 60,
    atk: 8,
    topics: ["arit"],
    weak: "arit",
    d: [1, 3],
    s: 3,
    bg: ["#1d3b2f", "#2d5a3d", "#173d28", "#bfe8a3"],
    intro:
      "Desa Satuan diserang! Slime ini retak karena hitungan di tubuhnya kacau. Jawab benar untuk memukulnya.",
    win: "Serpihan Kristal Aksioma pertama kembali bersinar.",
  },
  {
    n: "Rubah Pecah-Pecah",
    sp: "fox",
    hp: 90,
    atk: 10,
    topics: ["pecahan", "persen"],
    weak: "pecahan",
    d: [1, 4],
    s: 3,
    bg: ["#2a1f4d", "#4b2f6e", "#2b1b45", "#ffd7a0"],
    intro:
      "Hutan Pecahan. Rubah ini terbelah jadi pecahan-pecahan. Pecahan lemah terhadap serangan pecahan!",
    win: "Rubah itu kembali utuh dan berlari pergi. Kristal kedua bersinar.",
  },
  {
    n: "Golem Segi Banyak",
    sp: "golem",
    hp: 130,
    atk: 14,
    topics: ["geom", "arit"],
    weak: "geom",
    d: [2, 5],
    s: 5,
    bg: ["#2c3550", "#44527a", "#222a42", "#d7e6ff"],
    intro:
      "Kota Bangun. Golem menjaga jembatan yang ukurannya salah. Geometri adalah kelemahannya.",
    win: "Jembatan kembali lurus. Tiga kristal sudah ditemukan.",
  },
  {
    n: "Naga Parabola",
    sp: "dragon",
    hp: 200,
    atk: 18,
    topics: ["alj", "geom", "pecahan", "persen"],
    weak: "alj",
    d: [3, 5],
    s: 5,
    bg: ["#2a0f3d", "#5a1a5e", "#190825", "#ff9ad8"],
    intro:
      "Boss pertama! Naga Parabola menyemburkan soal campuran. Di balik bayangannya, ada sosok bernama Sang Nol.",
    win: "Naga itu tenang. Sang Nol menatap dari kejauhan... (Bersambung)",
  },
];

/* ---------- State ---------- */
let cv = $("#c"),
  ctx = cv.getContext("2d"),
  rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
let Pl,
  S,
  ST,
  lvl,
  Hh,
  wrongT,
  mode,
  cur,
  timer,
  left = 0,
  ts = 1,
  an = {
    se: 0,
    sp: 0,
    fl: [],
    pt: [],
    ch: [],
    T: 0,
    wt: 0,
    pa: 0,
    a: null,
    lg: 0,
    fx: 0,
  };
const say = (t) => ($("#pi").textContent = t),
  ui = (h) => ($("#ui").innerHTML = h);
function nextD(h, c) {
  const l = h.slice(-4);
  if (l.length < 3) return c;
  const r = l.filter(Boolean).length / l.length;
  return r >= 0.85 ? Math.min(5, c + 1) : r <= 0.4 ? Math.max(1, c - 1) : c;
}
function parse(s) {
  s = String(s).trim().replace(",", ".").replace(/\s/g, "");
  if (/^-?\d+\/\d+$/.test(s)) {
    const [a, b] = s.split("/").map(Number);
    return b ? a / b : NaN;
  }
  return /^-?\d*\.?\d+$/.test(s) ? Number(s) : NaN;
}
function newGame() {
  Pl = {
    hp: 100,
    fp: 0,
    combo: 0,
    max: 0,
    hints: 2,
    lv: 1,
    xp: 0,
    coin: 0,
    pot: 1,
    fpot: 0,
    hb: 0,
    atk: 0,
    pn: 0,
    gl: 0,
    eq: {},
    own: {},
  };
  ST = {};
  lvl = {};
  Hh = {};
  wrongT = [];
  W.init();
}
function start(i) {
  const e = E[i];
  S = { i, e, ehp: e.hp, dead: 0 };
  an.a = null;
  an.wt = 0;
  an.pa = 0;
  an.ch = [];
  an.lg = 0;
  ts = 1;
  Pl.hints = 2 + Pl.hb;
  Pl.combo = 0;
  bars();
  SND.music(i === 3 ? "boss" : "battle");
  SND.sfx("start");
  SND.mon(e.sp, "appear");
  say(e.intro);
  ui(
    `<div class="row" style="margin-top:8px"><button class="b" id="go">Mulai battle</button>${i < 3 ? '<button class="b g" id="fl">Kabur</button>' : ""}</div>`,
  );
  $("#go").onclick = menu;
  $("#go").focus();
  if ($("#fl")) $("#fl").onclick = () => W.back(null);
  mode = "i";
}
function bars() {
  const e = S.e;
  $("#php").style.width = Pl.hp + "%";
  $("#pfp").style.width = Pl.fp + "%";
  $("#pn").textContent =
    `Penjaga Angka Lv${Pl.lv} — HP ${Pl.hp}, Fokus ${Pl.fp}`;
  $("#cb").textContent = Pl.combo > 1 ? `Combo ×${Pl.combo}` : "";
  $("#ehp").style.width = (S.ehp / e.hp) * 100 + "%";
  $("#en").textContent = `${e.n} — HP ${Math.max(0, S.ehp)}`;
  $("#ch").textContent = `Kelemahan: ${TN[e.weak]}`;
}
function menu() {
  mode = "m";
  bars();
  say("Pilih aksi. Serangan Kuat memakai soal lebih sulit, damage ×2.");
  ui(
    `<div class="card"><div class="row"><button class="b" data-a="atk">Serang</button><button class="b" data-a="pow" ${Pl.fp < 30 ? "disabled" : ""}>Serangan Kuat (30 FP)</button><button class="b" data-a="heal" ${Pl.fp < 25 ? "disabled" : ""}>Penyembuh (25 FP)</button>${Pl.pot ? `<button class="b g" data-a="pot">Ramuan HP (${Pl.pot})</button>` : ""}${Pl.fpot ? `<button class="b g" data-a="fpot">Ramuan Fokus (${Pl.fpot})</button>` : ""}</div></div>`,
  );
  document
    .querySelectorAll("#ui .b")
    .forEach((b, i) => (b.textContent = `${i + 1}. ${b.textContent}`));
  document
    .querySelectorAll("[data-a]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          b.dataset.a === "pot"
            ? usePot()
            : b.dataset.a === "fpot"
              ? useF()
              : ask(b.dataset.a)),
    );
}
function mkQ(act) {
  const e = S.e;
  const tp =
    wrongT.length && Math.random() < 0.25 ? wrongT.shift() : P(e.topics);
  const base = clamp(lvl[tp] ?? e.d[0], e.d[0], e.d[1]),
    d = Math.min(5, base + (act === "pow" ? 1 : 0)),
    q = G[tp](d);
  q.tp = tp;
  q.d = d;
  if (d <= 2 && !q.show.includes("/")) {
    const v = q.val,
      s = new Set([v]);
    while (s.size < 4) {
      const o = v + P([-10, -2, -1, 1, 2, 10, R(3, 9), -R(3, 9)]);
      if (o >= 0 && o !== v) s.add(o);
    }
    q.opts = [...s].sort(() => Math.random() - 0.5);
  }
  return q;
}
function ask(act) {
  mode = "q";
  const q = mkQ(act);
  cur = { q, act, used: 0 };
  say("Jawab dengan tepat!");
  const body = q.opts
    ? `<div class="opts">${q.opts.map((o, i) => `<button class="b" data-o="${o}">${i + 1}. ${o}</button>`).join("")}</div>`
    : `<div class="ar"><input class="in" id="ans" inputmode="decimal" autocomplete="off" placeholder="${q.show.includes("/") ? "Jawaban, mis. 3/4" : "Jawaban"}"><button class="b" id="sub">Jawab</button></div>`;
  ui(
    `<div class="card"><div class="qm">${TN[q.tp]} · Level ${q.d}${act === "pow" ? " · Serangan Kuat" : act === "heal" ? " · Penyembuh" : ""}</div><div class="qt">${q.t}</div>${body}<div class="tm" id="tw"><i id="tb"></i></div><div class="row hr"><button class="b g" id="hint" ${Pl.hints ? "" : "disabled"}>Petunjuk (${Pl.hints})</button><div id="hh" class="qm"></div></div></div>`,
  );
  document
    .querySelectorAll("[data-o]")
    .forEach((b) => (b.onclick = () => answer(b.dataset.o)));
  const inp = $("#ans");
  if (inp) {
    inp.focus();
    inp.onkeydown = (e) => {
      if (e.key === "Enter") answer(inp.value);
    };
    $("#sub").onclick = () => answer(inp.value);
  }
  $("#hint").onclick = hint;
  startTimer(15 + 5 * q.d);
}
function hint() {
  if (mode !== "q" || !Pl.hints) return;
  Pl.hints--;
  SND.sfx("hint");
  cur.used++;
  $("#hh").textContent = "Petunjuk: " + cur.q.hint;
  $("#hint").textContent = `Petunjuk (${Pl.hints})`;
  if (!Pl.hints) $("#hint").disabled = true;
  if (cur.q.opts) {
    const w = [...document.querySelectorAll("[data-o]")].filter(
      (b) => +b.dataset.o !== cur.q.val && !b.disabled,
    );
    if (w.length > 1) {
      const b = P(w);
      b.disabled = true;
    }
  }
}
let tk = 0;
function startTimer(sec) {
  clearInterval(timer);
  left = 0;
  if (!$("#tmr").checked) {
    $("#tw").style.display = "none";
    return;
  }
  let t0 = Date.now(),
    last = t0;
  left = 1;
  timer = setInterval(() => {
    const now = Date.now();
    if (UIX.open) {
      t0 += now - last; // timer berhenti selama Pengaturan/Misi terbuka
      last = now;
      return;
    }
    last = now;
    left = 1 - (now - t0) / (sec * 1000);
    if (left < 0.3 && left > 0 && ++tk % 6 === 0) SND.sfx("tick");
    const b = $("#tb");
    if (b) b.style.width = Math.max(0, left * 100) + "%";
    if (left <= 0) {
      clearInterval(timer);
      answer(null, true);
    }
  }, 100);
}
function record(tp, ok) {
  ST[tp] = ST[tp] || { ok: 0, n: 0 };
  ST[tp].n++;
  if (ok) ST[tp].ok++;
  Hh[tp] = (Hh[tp] || []).concat(ok);
  const c = lvl[tp] ?? S.e.d[0],
    n = nextD(Hh[tp], c);
  if (n !== c) Hh[tp] = [];
  lvl[tp] = n;
  if (!ok && !wrongT.includes(tp) && wrongT.length < 3) wrongT.push(tp);
}
function answer(u, to) {
  if (mode !== "q") return;
  mode = "r";
  clearInterval(timer);
  const { q, act } = cur,
    e = S.e;
  const ok = !to && Math.abs(parse(u) - q.val) < 1e-6,
    cost = act === "pow" ? 30 : act === "heal" ? 25 : 0;
  record(q.tp, ok);
  ts = 1;
  if (ok) {
    SND.sfx(act === "heal" ? "heal" : "correct");
    Pl.combo++;
    Pl.max = Math.max(Pl.max, Pl.combo);
    Pl.fp = Math.min(100, Math.max(0, Pl.fp - cost) + 10);
    bars();
    ui("");
    if (act === "heal") {
      Pl.hp = Math.min(100, Pl.hp + 30);
      flo("+30 HP", "h", "#7ef0c8");
      burst(102, 165, "#7ef0c8");
      say("Benar! Kamu pulih 30 HP.");
      bars();
      setTimeout(enemyTurn, 1000);
    } else {
      const dm = 1 + 0.25 * (q.d - 1),
        sp = 1 + 0.25 * left,
        cb = 1 + Math.min(0.5, 0.1 * (Pl.combo - 1)),
        wk = q.tp === e.weak ? 1.3 : 1,
        dmg = Math.round(
          (12 + 2 * Pl.lv + Pl.atk + bon("atk")) *
            dm *
            sp *
            cb *
            wk *
            (act === "pow" ? 2 : 1),
        );
      say("Benar! Pukulan dilepas!");
      an.a = {
        t: 0,
        w: -Math.min(1, an.wt / 30),
        cb: () => {
          S.ehp -= dmg;
          SND.sfx("hit");
          SND.mon(e.sp, "hurt");
          an.se = 14;
          an.fx = 3;
          burst(348, 165, "#ffd166");
          burst(348, 165, "#fff");
          flo("-" + dmg, "e", "#ffd166");
          say(
            `Benar! ${dmg} damage${wk > 1 ? " (kena kelemahan!)" : ""}${Pl.combo > 1 ? ` · combo ×${Pl.combo}` : ""}`,
          );
          bars();
          if (S.ehp <= 0) setTimeout(win, 900);
          else setTimeout(() => partyAttack(enemyTurn), 900);
        },
      };
    }
  } else {
    an.wt = 0;
    SND.sfx("wrong");
    burst(90, 170, "#8a88a8");
    Pl.combo = 0;
    Pl.fp = Math.max(0, Pl.fp - cost - 5);
    bars();
    say(to ? "Waktu habis!" : "Belum tepat.");
    ui(
      `<div class="card"><b class="no">${to ? "Waktu habis." : "Belum tepat."}</b> Jawaban: <b>${q.show}</b><br>${q.expl}<div class="row" style="margin-top:8px"><button class="b" id="nx">Lanjut</button></div></div>`,
    );
    $("#nx").onclick = enemyTurn;
    $("#nx").focus();
  }
}
/* anggota party ikut menyerang setelah serangan pemain yang benar */
function partyAttack(done) {
  if (!F.party) return done();
  let i = 0;
  const next = () => {
    if (i >= PM.length) return setTimeout(done, 300);
    const k = i++,
      m = PM[k];
    an.al = { i: k, t: 0 };
    SND.sfx("whoosh");
    setTimeout(() => {
      const dmg = Math.max(
        1,
        Math.round(
          (3 + Math.floor(Pl.lv / 2) + m.atk) * (0.9 + Math.random() * 0.2),
        ),
      );
      S.ehp -= dmg;
      SND.sfx("hit");
      SND.mon(S.e.sp, "hurt");
      an.se = 8;
      burst(348, 165, m.o.B);
      flo("-" + dmg, "e", m.o.h);
      say(`${m.n} (${m.r}) ikut menyerang! ${dmg} damage`);
      bars();
      if (S.ehp <= 0) return setTimeout(win, 800);
      setTimeout(next, 450);
    }, 160);
  };
  next();
}
function enemyTurn() {
  const e = S.e,
    d = Math.max(1, R(e.atk - 2, e.atk + 2) - Pl.lv + 1 - bon("def"));
  an.lg = 18;
  an.wt = 0;
  SND.mon(e.sp, "atk");
  say(`${e.n} menyerang!`);
  ui("");
  setTimeout(() => {
    Pl.hp = Math.max(0, Pl.hp - d);
    an.sp = 12;
    an.fx = 2;
    SND.sfx("hurt");
    burst(102, 170, "#ff6b8b");
    flo("-" + d, "h", "#ff6b8b");
    say(`${e.n} menyerang! −${d} HP`);
    bars();
    if (!Pl.hp) setTimeout(lose, 900);
    else setTimeout(menu, 900);
  }, 170);
}
function lose() {
  mode = "x";
  SND.music(null);
  SND.sfx("lose");
  say(
    "Kamu terjatuh... tapi tidak apa-apa. Belajar dari soal tadi, lalu coba lagi.",
  );
  Pl.hp = 100;
  Pl.combo = 0;
  S.ehp = S.e.hp;
  bars();
  ui(
    `<div class="card"><div class="row"><button class="b" id="rt">Coba lagi</button><button class="b g" id="rm2">Kembali ke peta</button></div></div>`,
  );
  $("#rt").onclick = () => {
    SND.music(S.i === 3 ? "boss" : "battle");
    menu();
  };
  $("#rm2").onclick = () => W.back(null);
}
function win() {
  mode = "w";
  SND.music(null);
  SND.sfx("win");
  SND.mon(S.e.sp, "die");
  S.dead = performance.now();
  say(S.e.win);
  const e = S.e;
  Pl.xp += e.xp;
  Pl.coin += e.coin;
  let up = "";
  while (Pl.xp >= Pl.lv * 30) {
    Pl.xp -= Pl.lv * 30;
    Pl.lv++;
    Pl.hp = 100;
    up += ` Naik ke Level ${Pl.lv}! HP pulih.`;
  }
  if (up) setTimeout(() => SND.sfx("level"), 1300);
  W.defeated(S.i);
  ui(
    `<div class="card"><b class="ok">${e.n} dikalahkan!</b> +${e.xp} XP, +${e.coin} koin.${up}<div class="row" style="margin-top:8px"><button class="b" id="nx">Lanjut</button></div></div>`,
  );
  $("#nx").onclick = () => W.back(S.i);
  $("#nx").focus();
}
function flo(t, w, c) {
  an.fl.push({ x: w === "h" ? 105 : 345, y: 100, t, c, l: 60 });
}

/* ---------- Render canvas ---------- */
function spr(k, x, y, s, al = 1, tint, fr = 0, fl = 0, mm) {
  const o = SP[k],
    m =
      mm ||
      (fr && o.f && o.f[fr]
        ? o.m.slice(0, o.m.length - o.f[fr].length).concat(o.f[fr])
        : o.m),
    n = m[0].length;
  y -= (o.oy || 0) * s;
  ctx.globalAlpha = al;
  m.forEach((r, j) => {
    for (let i = 0; i < n; i++) {
      const ii = fl ? n - 1 - i : i,
        c = r[ii];
      if (c === "." || c === undefined) continue;
      const X = x + i * s,
        Y = y + j * s;
      ctx.fillStyle = tint || o.p[c];
      ctx.fillRect(X, Y, s, s);
      if (s >= 3 && o.m.length <= 16 && !tint && c !== "K") {
        const u = m[j - 1]?.[ii],
          d = m[j + 1]?.[ii],
          h = Math.ceil(s / 3);
        if (!u || u === "." || u === "K") {
          ctx.fillStyle = "rgba(255,255,255,.28)";
          ctx.fillRect(X, Y, s, h);
        }
        if (!d || d === "." || d === "K") {
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.fillRect(X, Y + s - h, s, h);
        }
      }
    }
  });
  ctx.globalAlpha = 1;
}
function burst(x, y, c) {
  if (rm) return;
  for (let i = 0; i < 16; i++)
    an.pt.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 4.5 - 1.5,
      l: 30,
      c,
    });
}
function scene(b, t, sd) {
  const H = GY; // tinggi langit; lantai dari GY sampai dasar kanvas
  ctx.fillStyle = b[0];
  ctx.fillRect(0, 0, VW, H);
  ctx.fillStyle = b[1];
  for (let i = 1; i < 9; i++) {
    ctx.globalAlpha = i / 9;
    ctx.fillRect(0, Math.round((i * H) / 13), VW, Math.ceil(H / 13));
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = b[3];
  for (let k = 0; k < 45; k++) {
    ctx.globalAlpha = rm ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(t / 500 + k));
    ctx.fillRect(
      (k * 97 + sd * 13) % VW,
      (k * 53) % 100,
      k % 3 ? 1 : 2,
      k % 3 ? 1 : 2,
    );
  }
  ctx.globalAlpha = 1;
  for (let dy = -16; dy <= 16; dy += 2) {
    const w = Math.round(Math.sqrt(256 - dy * dy) * 2);
    ctx.fillRect(402 - w / 2, 52 + dy, w, 2);
  }
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.16;
  for (let k = 0; k < 3; k++) {
    const x = (((rm ? 0 : t * 0.01) * (k + 1) + k * 180) % 560) - 60,
      y = 28 + k * 28;
    ctx.fillRect(Math.round(x + 12), y, 42, 6);
    ctx.fillRect(Math.round(x), y + 6, 66, 6);
  }
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.22;
  for (let x = 0; x < VW; x += 6) {
    const top = Math.round(
      H -
        4 -
        (50 + 26 * Math.sin(x * 0.024 + sd) + 14 * Math.sin(x * 0.06 + sd * 2)),
    );
    ctx.fillRect(x, top, 6, H - top);
  }
  ctx.globalAlpha = 0.4;
  for (let x = 0; x < VW; x += 6) {
    const top = Math.round(H - (20 + 11 * Math.sin(x * 0.04 + sd * 3)));
    ctx.fillRect(x, top, 6, H - top);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = b[2];
  ctx.fillRect(0, H, VW, VH - H);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.07;
  for (let x = 0; x < VW; x += 48) ctx.fillRect(x, H + 6, 24, VH - H - 6);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = b[3];
  ctx.fillRect(0, H, VW, 3);
  ctx.globalAlpha = 1;
}
function heroB(x, y, a, col, hs = 3) {
  const k = hs / 3, // 3 = ukuran asli; battle layar penuh memakai skala lebih besar
    q = (v) => Math.round(v / 2) * 2,
    r = (v) => Math.round(v * k),
    ln = Math.round(a * 4 * k),
    fl = an.sp > 6; // berkedip putih saat terkena serangan
  spr("heroB", x + ln, y, hs, 1, fl ? "#fff" : null);
  HAT && hatDraw(x + ln, y, hs, 0);
  // posisi tangan; a<0 = ancang-ancang, a>0 = menebas ke depan
  const fx = q(x + ln + 42 * k + a * (a < 0 ? 10 : 20) * k),
    fy = q(y + 42 * k - a * 6 * k),
    ang = -1.35 + 0.95 * a, // arah bilah pedang
    cx = Math.cos(ang),
    cy = Math.sin(ang),
    st = 3.2 * k,
    edge =
      globalThis.fistC && globalThis.fistC !== "#ffd166"
        ? globalThis.fistC
        : SP.heroB.p.b,
    each = (f) => {
      for (let i = 0; i <= 10; i++)
        f(Math.round(fx + cx * i * st), Math.round(fy + cy * i * st));
    };
  if (col) {
    const z = (8 + Math.max(0, -a) * 8) * k;
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.22 + 0.2 * Math.sin(Date.now() / 130);
    ctx.fillRect(fx - z - 3, fy - z - 3, 2 * z + 6, 2 * z + 6);
    ctx.globalAlpha = 1;
  }
  each((X, Y) => {
    ctx.fillStyle = "#140f1c";
    ctx.fillRect(X - r(3), Y - r(3), r(6), r(6));
  }); // garis tepi bilah
  each((X, Y) => {
    ctx.fillStyle = fl ? "#fff" : SP.heroB.p.B;
    ctx.fillRect(X - r(2), Y - r(2), r(4), r(4));
  }); // bilah perak
  each((X, Y) => {
    ctx.fillStyle = fl ? "#fff" : edge;
    ctx.fillRect(X - r(1), Y, r(2), r(2));
  }); // sisi merah
  ctx.fillStyle = "#140f1c";
  ctx.fillRect(fx - r(6), fy - r(6), r(12), r(12)); // pegangan + tangan
  ctx.fillStyle = SP.heroB.p.G;
  ctx.fillRect(fx - r(4), fy - r(4), r(8), r(8));
  ctx.fillStyle = "#fff";
  ctx.fillRect(fx - r(4), fy - r(4), r(4), r(2));
  return [Math.round(fx + cx * 10 * st), Math.round(fy + cy * 10 * st)]; // ujung pedang
}
function draw(t) {
  if (W.on) {
    try {
      W.draw(t);
    } catch (err) {
      console.error(err); // jangan sampai game membeku
    }
    UIX.pad(!busy);
    requestAnimationFrame(draw);
    return;
  }
  UIX.pad(false);
  const e = S?.e;
  if (e) {
    const qa = mode === "q" && cur && cur.act !== "heal";
    ts += ((qa ? 0.2 : 1) - ts) * 0.12;
    an.T += ts;
    const tt = an.T * 16.7;
    if (qa) an.wt += ts;
    else if (!an.a) an.wt = Math.max(0, an.wt - 2);
    const sh = an.se > 6 && !rm;
    if (sh) {
      ctx.save();
      ctx.translate(R(-3, 3), R(-3, 3));
    }
    scene(e.bg, tt, S.i + 1);
    const bob = rm ? 0 : Math.round(Math.sin(tt / 280) * 3),
      s = e.s,
      w = 32 * s,
      ey = GY - w,
      bx = 348 - w / 2,
      ex =
        bx -
        (an.lg > 0 ? Math.round(Math.sin((an.lg / 18) * Math.PI) * 105) : 0) +
        (an.se > 0 ? Math.min(an.se, 10) * 1.5 : 0),
      shE = an.se > 0 && !rm ? (an.se % 2 ? 4 : -4) : 0,
      shP = an.sp > 0 && !rm ? (an.sp % 2 ? 4 : -4) : 0,
      hxT = bx - 100,
      a = an.a;
    let hx = 30 - (an.sp > 0 ? Math.min(an.sp, 10) * 1.5 : 0) + shP,
      pose;
    if (a) {
      a.t++;
      if (a.t === 1) SND.sfx("whoosh");
      if (a.t <= 7) {
        const k = a.t / 7;
        hx = 30 + Math.round((hxT - 30) * (1 - (1 - k) * (1 - k)));
        pose = a.w + (1 - a.w) * Math.min(1, a.t / 3);
        if (!rm)
          for (let i = 0; i < 6; i++) {
            const l = 45 + ((i * 10) % 30);
            ctx.fillStyle = "rgba(255,255,255,.5)";
            ctx.fillRect(hx + 45 - l, GY - 90 + i * 14, l, 2);
          }
      } else if (a.t <= 12) {
        hx = hxT;
        pose = 1;
        if (!a.h) {
          a.h = 1;
          a.cb();
        }
      } else {
        const k = Math.min(1, (a.t - 12) / 18);
        hx = Math.round(hxT - (hxT - 30) * k);
        pose = 1 - k;
        if (k >= 1) {
          an.a = null;
          an.pa = 0;
        }
      }
    } else {
      an.pa += ((qa ? -Math.min(1, an.wt / 30) : 0) - an.pa) * 0.25;
      pose = an.pa + (qa && an.wt >= 30 && !rm ? Math.sin(t / 35) * 0.04 : 0);
    }
    const hy = GY - 120 + (rm ? 0 : Math.round(Math.sin(tt / 320) * 2));
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.3;
    ctx.fillRect(hx + 12, GY - 4, 80, 6);
    ctx.fillRect(ex + 6, GY - 4, w - 12, 6);
    ctx.globalAlpha = 1;
    if (F.party)
      PM.forEach((m, i) => {
        const ax = 112 + i * 36,
          ay = GY - 48 - (i % 2) * 6;
        let dx = 0;
        const A = an.al;
        if (A && A.i === i) {
          A.t++;
          dx = Math.round(
            Math.sin(Math.min(1, A.t / 18) * Math.PI) *
              Math.max(0, Math.min(90, bx - 52 - ax)),
          );
          if (A.t >= 18) an.al = null;
        }
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(ax + dx + 6, ay + 45 + (i % 2) * 0, 36, 4);
        ctx.globalAlpha = 1;
        spr(
          m.sp,
          ax + dx,
          ay + (rm ? 0 : Math.round(Math.sin(tt / 320 + i) * 1)),
          3,
        );
      });
    const fc = qa ? (cur.act === "pow" ? "#ffd166" : "#7ef0c8") : null,
      [fx, fy] = heroB(hx, hy, pose, fc, 5);
    const al = S.dead ? Math.max(0, 1 - (t - S.dead) / 700) : 1;
    const ML = SP[e.sp + "L"].a,
      fi = rm
        ? 0
        : an.lg > 0
          ? 2
          : Math.floor(tt / (e.sp === "dragon" ? 260 : 380)) % 2;
    spr(
      e.sp + "L",
      ex + shE,
      ey + bob,
      s,
      al,
      an.se > 6 ? "#fff" : null,
      0,
      0,
      ML[fi],
    );
    if (qa && !rm && Math.random() < 0.3 && an.ch.length < 26) {
      const g = Math.random() * 6.28;
      an.ch.push({ x: fx + Math.cos(g) * 54, y: fy + Math.sin(g) * 54, l: 60 });
    }
    an.ch = an.ch.filter((p) => p.l > 0);
    an.ch.forEach((p) => {
      const v = 0.06 * Math.max(ts, 0.3);
      p.x += (fx - p.x) * v;
      p.y += (fy - p.y) * v;
      p.l--;
      ctx.fillStyle = fc || "#fff";
      ctx.globalAlpha = Math.min(1, p.l / 20);
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
    });
    ctx.globalAlpha = 1;
    const sk = Math.max(0, (1 - ts) / 0.8);
    if (sk > 0.02) {
      ctx.fillStyle = `rgba(40,70,170,${0.2 * sk})`;
      ctx.fillRect(0, 0, VW, VH);
      const g = ctx.createRadialGradient(240, 135, 105, 240, 135, 315);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,0,0,${0.55 * sk})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, VW, VH);
    }
    an.pt = an.pt.filter((p) => p.l > 0);
    an.pt.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.l--;
      ctx.globalAlpha = p.l / 30;
      ctx.fillStyle = p.c;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
    });
    ctx.globalAlpha = 1;
    if (an.fx > 0) {
      ctx.fillStyle = `rgba(255,255,255,${an.fx * 0.18})`;
      ctx.fillRect(0, 0, VW, VH);
      an.fx--;
    }
    ctx.font = 'bold 24px "Pixelify Sans",monospace';
    ctx.textAlign = "center";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000";
    an.fl = an.fl.filter((f) => f.l > 0);
    an.fl.forEach((f) => {
      const y = f.y - (60 - f.l) * 0.9;
      ctx.strokeText(f.t, f.x, y);
      ctx.fillStyle = f.c;
      ctx.fillText(f.t, f.x, y);
      f.l--;
    });
    if (sk > 0.02) {
      const h = Math.round(21 * sk);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, VW, h);
      ctx.fillRect(0, VH - h, VW, h);
      if (sk > 0.5) {
        ctx.font = 'bold 14px "Pixelify Sans",monospace';
        ctx.fillStyle = fc;
        ctx.fillText("SLOW-MO · JAWAB SEKARANG!", 240, h + 36);
      }
    }
    if (sh) ctx.restore();
    if (an.se > 0) an.se--;
    if (an.sp > 0) an.sp--;
    if (an.lg > 0) an.lg--;
  }
  requestAnimationFrame(draw);
}
document.addEventListener("keydown", (e) => {
  if (UIX.open || e.ctrlKey || e.metaKey || e.altKey) return;
  const inInput = document.activeElement.tagName === "INPUT";
  if (mode === "q" && /^[1-4]$/.test(e.key) && !inInput) {
    const b = document.querySelectorAll("[data-o]")[+e.key - 1];
    if (b && !b.disabled) {
      e.preventDefault();
      b.click();
    }
  }
  // menu aksi battle: angka memilih tombol sesuai urutan
  if (mode === "m" && /^[1-5]$/.test(e.key) && !inInput) {
    const b = document.querySelectorAll("#ui .b")[+e.key - 1];
    if (b && !b.disabled) {
      e.preventDefault(); // angka tidak boleh ikut terketik di kolom jawaban yang baru muncul
      b.click();
    }
  }
  if (mode === "q" && e.key.toLowerCase() === "h" && !inInput) {
    e.preventDefault();
    hint();
  }
});
