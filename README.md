# 📌 ROADMAP DETAIL — Portfolio & Blog (Zero to Hero)
## 🟢 Tahap 1 — Perencanaan & Desain (Fondasi)✅
## 🟡 Tahap 2 — Implementasi Minimal (MVP Release)✅
## 🟠 Tahap 3 — Optimisasi & Penyempurnaan

🎯 **Goal:** Rapi, nyaman dilihat, UX lebih baik.

### 🔹 Step 3.1 — Desain & CSS Responsive

* [ ] Buat **CSS global layout** (grid/flex, typography, spacing).
* [ ] Tambah **media query** biar mobile-friendly.
* [ ] Definisikan **color palette fix** (Primary = Purple, Secondary = Blue, Tertiary = Night/Dark).
* [ ] Terapkan ke semua halaman (index, about, project, blog, connect).

---

### 🔹 Step 3.2 — Navigasi & Footer

* [ ] **Navbar sticky** (selalu di atas, background transparan → solid saat scroll).
* [ ] Tambah **active state** di menu (highlight halaman aktif).
* [ ] Footer diperluas: kontak singkat + © + link GitHub.

---

### 🔹 Step 3.3 — Blog UX

* [ ] Tambah **layout kartu (card style)** untuk daftar post:

  ```
  [Thumbnail/Gambar] 
  [Judul + Date] 
  [Tags]
  ```
* [ ] Tambah **kategori/tag sistematis** (contoh: Tutorial, Trend, Tips, Project).
* [ ] Buat **filter/sort** blog berdasarkan tag & date.
* [ ] Atur typography konten blog (heading, paragraph, code block).

---

### 🔹 Step 3.4 — About Page

* [ ] Rapikan konten **Journey** (timeline sederhana).
* [ ] Tambah section **Skills** (icon grid: HTML, CSS, JS, Git, dll).
* [ ] Tambah section **Certificates** (list dengan link atau badge).

---

### 🔹 Step 3.5 — Project Showcase

* [ ] Buat **grid card**:

  * **Finished** (status selesai).
  * **Ongoing** (sedang jalan).
  * **Planned** (perkiraan ke depan).
* [ ] Tiap card: \[Thumbnail] + \[Title] + \[Deskripsi singkat] + \[Link GitHub/demo].

---

### 🔹 Step 3.6 — Connect Page

* [ ] Tambah icon **Email, LinkedIn, GitHub** (pakai Feather/Lucide/FontAwesome).
* [ ] Buat form sederhana (Name, Email, Message) → opsional, bisa pakai Formspree/EmailJS.

---

### 🔹 Step 3.7 — Konsistensi & Testing

* [ ] Pastikan semua **class/id naming selaras** (BEM / kebiasaan konsisten).
* [ ] Testing di GitHub Pages (mobile + desktop).
* [ ] Fix bug minor (misal blog list nggak load, atau navbar nabrak konten).

---

## 🔵 Tahap 4 — Scaling & Automation

🎯 **Goal:** Otomatisasi & workflow lebih gampang.

* Auto deploy ke GitHub Pages dengan GitHub Actions.
* Tambah generator blog otomatis (misal: script buat konversi `.md` ke `.html` cache).
* Optimisasi asset (minify CSS/JS, lazyload image).

---

## 🟣 Tahap 5 — Future Upgrade (Optional)

🎯 **Goal:** Level up tampilan & fitur masa depan.

* Tambah dark mode toggle.
* Tambah search bar untuk blog.
* Tambah analytics (misalnya Plausible/Umami).
* Pindah ke framework (Next.js / Astro) kalau butuh scale besar.

---