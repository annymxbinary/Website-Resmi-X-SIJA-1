/* ===== Foto latar header (dipilih acak setiap halaman dibuka) =====
   Simpan foto Minecraft di folder "img" lalu tulis namanya di sini.
   Jika foto tidak ditemukan, latar otomatis memakai gradasi hijau-biru. */
const fotoMinecraft = [
  "img/minecraft-1.jpg",
  "img/minecraft-2.jpg",
  "img/minecraft-3.jpg",
  "img/minecraft-4.jpg"
];

const pilihan = fotoMinecraft[Math.floor(Math.random() * fotoMinecraft.length)];
const gambar = new Image();
gambar.onload = () => {
  const bg = document.getElementById("heroBg");
  bg.style.setProperty("--hero-img", `url("${pilihan}")`);
  bg.classList.add("ada-foto");
};
gambar.src = pilihan;

const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Sistem Verifikasi & Proteksi Halaman Project (Dengan Tombol Navigasi Alternatif) ===== */
if (window.location.pathname.includes("project.html") || document.getElementById("project")) {
  if (!document.getElementById("lockOverlay")) {
    const overlay = document.createElement("div");
    overlay.id = "lockOverlay";
    overlay.className = "lock-overlay";
    overlay.innerHTML = `
      <div class="lock-card">
        <h2>Verifikasi X SIJA 1</h2>
        <p>Maaf, tetapi halaman project ini hanya dirancang khusus kelas X SIJA 1. Untuk membuka akses project, tolong masukkan kode untuk menverifikasi bahwa kamu adalah murid kelas X SIJA 1</p>
        <div class="lock-input-group">
          <input type="password" id="kodeVerifikasi" placeholder="Masukkan Kode Akses" autocomplete="off">
          <button type="button" id="btnVerifikasi">Buka Akses</button>
          <div class="lock-error" id="lockError"></div>
        </div>
        <div style="margin-top: 18px; border-top: 1px solid rgba(159, 231, 238, 0.15); padding-top: 14px; display: flex; justify-content: center; gap: 16px;">
          <a href="index.html" style="color: var(--cyan-card, #9fe7ee); font-size: 0.82rem; text-decoration: none; font-weight: 500;">← Kembali ke Beranda</a>
          <a href="gallery.html" style="color: var(--cyan-card, #9fe7ee); font-size: 0.82rem; text-decoration: none; font-weight: 500;">Lihat Gallery →</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const inputKode = document.getElementById("kodeVerifikasi");
    const btnVerifikasi = document.getElementById("btnVerifikasi");
    const errorMsg = document.getElementById("lockError");

    function prosesVerifikasi() {
      if (inputKode.value.trim() === "SIJA1ONTOP") {
        overlay.classList.add("hidden");
        errorMsg.textContent = "";
        inputKode.value = "";
      } else {
        errorMsg.textContent = "Kode salah! Silakan coba lagi.";
        inputKode.value = "";
        inputKode.focus();
      }
    }

    btnVerifikasi.addEventListener("click", prosesVerifikasi);
    inputKode.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        prosesVerifikasi();
      }
    });

    setTimeout(() => inputKode.focus(), 100);
  }

  // Mengunci kembali jika berpindah tab / minimize browser
  document.addEventListener("visibilitychange", () => {
    const overlay = document.getElementById("lockOverlay");
    const inputKode = document.getElementById("kodeVerifikasi");
    
    if (document.hidden && overlay) {
      overlay.classList.remove("hidden");
      if (inputKode) {
        inputKode.value = "";
        inputKode.focus();
      }
    }
  });
}

/* ===== Efek ketik pada subjudul ===== */
const subjudul = document.getElementById("subjudul");
if (subjudul && !kurangiGerak) {
  const teks = subjudul.textContent.trim();
  subjudul.setAttribute("aria-label", teks);
  subjudul.innerHTML = '<span class="sudah" aria-hidden="true"></span><span class="belum" aria-hidden="true"></span>';
  const sudah = subjudul.querySelector(".sudah");
  const belum = subjudul.querySelector(".belum");
  belum.textContent = teks;

  let n = 0;
  setTimeout(() => {
    const ketik = setInterval(() => {
      n++;
      sudah.textContent = teks.slice(0, n);
      belum.textContent = teks.slice(n);
      if (n >= teks.length) {
        clearInterval(ketik);
        setTimeout(() => subjudul.classList.add("selesai"), 1200);
      }
    }, 35);
  }, 600);
}

/* ===== Tombol yang linknya belum diisi dinonaktifkan otomatis ===== */
document.querySelectorAll(".btn").forEach((tombol) => {
  const href = (tombol.getAttribute("href") || "").trim();
  if (href === "" || href === "#") {
    tombol.removeAttribute("href");
    tombol.removeAttribute("target");
    tombol.classList.add("nonaktif");
    tombol.setAttribute("aria-disabled", "true");
    tombol.textContent = "Belum tersedia";
  }
});

/* ===== Favorit, pencarian nama & nomor absen (hanya halaman utama) ===== */
if (document.getElementById("cari")) {
  const inputCari = document.getElementById("cari");
  const labelJumlah = document.getElementById("jumlah");
  const pesanKosong = document.getElementById("kosong");
  const tombolFavorit = document.getElementById("tombolFavorit");
  const labelJumlahFav = document.getElementById("jumlahFav");
  const tombolStatus = document.querySelectorAll(".seg");

  const kartu = Array.from(document.querySelectorAll(".card")).map((el) => ({
    el,
    nama: el.querySelector(".nama").textContent.trim().toLowerCase(),
    nomor: parseInt(el.querySelector(".absen").textContent.replace(/\D/g, ""), 10),
    hati: el.querySelector(".favorit"),
    tersedia: !el.querySelector(".btn").classList.contains("nonaktif")
  }));

  // jumlah project yang sudah / belum tersedia
  const jmlTersedia = kartu.filter((k) => k.tersedia).length;
  document.getElementById("jmlSemua").textContent = kartu.length;
  document.getElementById("jmlTersedia").textContent = jmlTersedia;
  document.getElementById("jmlBelum").textContent = kartu.length - jmlTersedia;

  const KUNCI_FAVORIT = "sijaFavorit";
  let favorit = new Set();
  try {
    favorit = new Set(JSON.parse(localStorage.getItem(KUNCI_FAVORIT) || "[]"));
  } catch (e) {
    /* penyimpanan browser tidak tersedia: favorit hanya berlaku selama halaman terbuka */
  }

  function simpanFavorit() {
    try {
      localStorage.setItem(KUNCI_FAVORIT, JSON.stringify([...favorit]));
    } catch (e) {}
  }

  let hanyaFavorit = false;
  let statusFilter = "semua"; // semua | tersedia | belum

  function normal(teks) {
    return teks.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function pesanTidakAda(kata) {
    if (kata === "" && hanyaFavorit) {
      return statusFilter === "semua"
        ? "Belum ada favorit. Tekan ikon hati pada kartu siswa untuk menandainya."
        : "Tidak ada favorit yang sesuai dengan filter ini.";
    }
    if (kata === "" && statusFilter === "tersedia") return "Belum ada project yang tersedia.";
    if (kata === "" && statusFilter === "belum") return "Semua project sudah tersedia.";
    return `Tidak ada siswa yang cocok dengan "${inputCari.value.trim()}".`;
  }

  function cari() {
    const kata = normal(inputCari.value);
    // "no. 5", "no 05", atau "5" dianggap pencarian nomor absen
    const angka = kata.replace(/^no\.?\s*/, "");
    const cariNomor = /^\d+$/.test(angka) ? parseInt(angka, 10) : null;

    let tampil = 0;
    kartu.forEach(({ el, nama, nomor, tersedia }) => {
      const cocokTeks =
        kata === "" || (cariNomor !== null ? nomor === cariNomor : nama.includes(kata));
      const cocokStatus =
        statusFilter === "semua" || (statusFilter === "tersedia") === tersedia;
      const cocok = cocokTeks && cocokStatus && (!hanyaFavorit || favorit.has(nomor));
      el.hidden = !cocok;
      if (cocok) tampil++;
    });

    const adaFilter = kata !== "" || hanyaFavorit || statusFilter !== "semua";
    labelJumlah.textContent = adaFilter ? `${tampil} dari ${kartu.length} Siswa` : `${kartu.length} Siswa`;
    pesanKosong.hidden = tampil !== 0;
    if (tampil === 0) {
      pesanKosong.textContent = pesanTidakAda(kata);
    }
  }

  function perbaruiHati() {
    kartu.forEach(({ nomor, hati }) => {
      hati.setAttribute("aria-pressed", favorit.has(nomor) ? "true" : "false");
    });
    labelJumlahFav.textContent = favorit.size;
  }

  kartu.forEach(({ nomor, hati }) => {
    hati.addEventListener("click", () => {
      if (favorit.has(nomor)) favorit.delete(nomor);
      else favorit.add(nomor);
      simpanFavorit();
      perbaruiHati();
      if (hanyaFavorit) cari();
    });
  });

  tombolFavorit.addEventListener("click", () => {
    hanyaFavorit = !hanyaFavorit;
    tombolFavorit.setAttribute("aria-pressed", hanyaFavorit ? "true" : "false");
    cari();
  });

  tombolStatus.forEach((tombol) => {
    tombol.addEventListener("click", () => {
      statusFilter = tombol.dataset.status;
      tombolStatus.forEach((t) => t.setAttribute("aria-pressed", t === tombol ? "true" : "false"));
      cari();
    });
  });

  inputCari.addEventListener("input", cari);
  perbaruiHati();
}

/* ===== Tombol kembali ke atas ===== */
const keAtas = document.getElementById("keAtas");
if (keAtas) {
  let keAtasTampil = false;
  let keAtasDasar = false;
  window.addEventListener(
    "scroll",
    () => {
      const jarakKeDasar =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      const harusTampil = window.scrollY > 500;
      const harusDasar = harusTampil && jarakKeDasar < 30;
      if (harusTampil !== keAtasTampil) {
        keAtasTampil = harusTampil;
        keAtas.classList.toggle("tampil", harusTampil);
      }
      if (harusDasar !== keAtasDasar) {
        keAtasDasar = harusDasar;
        keAtas.classList.toggle("dasar", harusDasar);
      }
    },
    { passive: true }
  );
  keAtas.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: kurangiGerak ? "auto" : "smooth" });
  });
}