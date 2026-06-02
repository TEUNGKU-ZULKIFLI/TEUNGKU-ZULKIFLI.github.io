---
title: "Studi Kasus: Apok FinTrack - Manajemen Keuangan"
date: "2024-09-10"
tags: [projects-series, System, Flutter, Firebase, Dart, SQLite]
excerpt: "Aplikasi mobile (Flutter) untuk mencatat arus kas harian, manajemen kartu, dan visualisasi data keuangan pribadi"
youtube_id: "https://youtu.be/xuzCJAbGtBo"
---

# Apok FinTrack Dokumentasi dan Changelog

## Ringkasan
**Ringkasan:** Aplikasi mobile yang dirancang untuk mencatat arus kas harian, manajemen kartu, dan visualisasi data keuangan pribadi menggunakan **Flutter (Dart)**.

<!-- Apok FinTrack: Offline Personal Finance App Built with Flutter & SQLite (Dark Mode Demo) -->
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0; border-radius: 8px; box-shadow: var(--shadow-md);">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="https://www.youtube.com/embed/xuzCJAbGtBo?" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

## Latar Belakang Masalah
Karena seringkali kita mendapatkan gaji/income dan pada saat bersamaan entah mengapa pertengahan atau akhir bulan boncos sendiri isi dompet tersebut, sehingga pada saat itu mau mengingat kembali apa saja yang menjadi sumber boncos tersebut malah tidak dapat mengingat kembali. Dokumentasi di Excel atau platform lain seringkali tidak efisien karena butuh laptop, proses input rumit, atau mengharuskan ponsel selalu online. Hal ini membuat banyak orang malas mendokumentasikan aktivitas keuangan mereka.

**Masalah:** Malas dalam dokumentasi; platform dokumentasi yang harus online.  
**Dampak:** Lupa riwayat pengeluaran sehingga sulit mengidentifikasi sumber kebocoran anggaran.

---

## Solusi dan Fitur Utama
Aplikasi ini dirancang untuk memudahkan pencatatan keuangan harian secara cepat, offline-friendly, dan memberikan visualisasi yang membantu pengguna memahami pola pengeluaran.

- **Fitur 1** Aplikasi memungkinkan pencatatan pengeluaran dan pemasukan harian dengan form bertahap dan validasi.
- **Fitur 2** Manajemen kartu kredit/debit lengkap dengan operasi CRUD.
- **Fitur 3** Visualisasi data berupa grafik tren mingguan dan donut chart di halaman utama.
- **Fitur 4** Riwayat pengguna dengan opsi sortir dan hapus semua.
- **Fitur 5** Mode gelap, snackbar terpusat untuk feedback, dan pengaturan termasuk About, Delete All Data, Export to PDF (WIP).

---

## Tech Stack Di Balik Layar

| Komponen | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend Mobile** | Flutter (Dart) | Performa native, UI konsisten lintas platform |
| **Database Lokal** | SQFlite | Offline-first, ringan, cocok untuk mobile |
| **Build Tools** | Gradle, Kotlin plugin | Integrasi Android build dan kompatibilitas |
| **Assets** | Adaptive icons, vector XML | Dukungan berbagai density dan ukuran layar |

---

## Changelog v1.0.0+1

### Release Notes
First stable release of **Apok FinTrack (Apok Finance Tracker)** 🎉  
This version includes a **custom AFT launcher logo**, stable database, unified UI/UX, and **production-ready build** (APK & AAB).

### Features
- 📱 **Custom AFT Logo** adaptive icons for all densities.
- 💾 Stable **SQFlite Database** with production schema.
- 💳 Full CRUD for **Credit Cards**.
- 🕘 **User History** with sorting & delete-all.
- 📊 **Charts**: Weekly trend & Donut chart on Home.
- 📝 **Stepper Form Input**: Daily expense/income with validation.
- 🔔 **Snackbar**: Unified success/error feedback.
- ⚙️ **Settings**: About, Delete All Data, Export to PDF (WIP).
- 🌙 **Dark Mode** support.

### Refactor & Fixes
- ♻️ Unified widget styles for cards, charts, navbar, snackbar, appbar.
- ♻️ Refactored pages with mounted checks and improved state handling.
- 🐛 Fixed async DB queries to prevent setState after dispose.
- 🐛 Fixed Gradle, Kotlin, plugin compatibility issues.
- ⚡ Optimized DB services for performance.

### Assets
- App Icon files:
  - `android/app/src/main/res/mipmap-*/ic_launcher.png`
  - `android/app/src/main/res/mipmap-*/ic_launcher_adaptive_{back,fore}.png`
- Adaptive icons for all densities (mdpi → xxxhdpi).
- Vector config in `mipmap-anydpi-v26/ic_launcher.xml`.

### Artifacts
- `app-release.apk` ✅  
- `app-release.aab` ✅

---

## Tantangan dan Pembelajaran
**Tantangan:** Menangani query database asinkronus yang memicu `setState` setelah widget ter-dispose, menyebabkan crash atau perilaku tak terduga.  
**Solusi:** Menambahkan pengecekan `mounted` sebelum memanggil `setState`, merapikan lifecycle handling, dan mengoptimalkan service DB untuk mengurangi beban query.  
**Pembelajaran:** Pentingnya lifecycle-aware state management di Flutter dan pengujian pada berbagai kondisi lifecycle.

---

## Langkah Berikutnya
- 📤 Finalize **Export to PDF** agar pengguna bisa menyimpan laporan.
- 🎨 Improve **Snackbar color scheme** agar sesuai tema default.
- 💻 Lanjutkan pengembangan setelah OS reinstall; project backup sudah disiapkan.
