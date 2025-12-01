---
title: "(Part 1): Instalasi Server dari Awal"
date: "2025-09-24"
category: "Kuliah"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/p4zs7A_xUks?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper-V (Part 1): Instalasi Server dari Awal
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

---

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

* **[Panduan Instalasi Debian GNU/Linux](https://www.debian.org/releases/bookworm/i386/)**: Sebagai acuan dan upgrade literasi supaya SDM up to date

---

# 📖 BAB 1: THE GENESIS (Pondasi Kehidupan Server)

## (Part 1) Instalasi Server dari Awal: Membangkitkan "The Legend" Debian 7

### 🏷️ TAGLINE

*"Membangun Fondasi yang Kokoh di atas Tanah Virtual"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan Anda ingin belajar menjadi mekanik mobil handal.
Alih-alih langsung belajar di mobil Tesla yang serba otomatis (Debian 12/Ubuntu terbaru), kita akan belajar membongkar **Toyota Kijang Kapsul tahun 90-an (Debian 7 Wheezy)**.

Kenapa? Karena mobil tua memaksa kita mengerti mesin secara manual. Tidak ada sensor canggih, tidak ada bantuan AI. Jika Anda bisa menyetir mobil tua ini, Anda bisa menyetir mobil apa saja di masa depan.

Dan karena kita tidak punya "Garasi Fisik" (Server Fisik), kita akan menggunakan **Hyper-V / VMware** sebagai "Simulator Bengkel" kita. Aman, gratis, dan kalau meledak, tinggal *delete* dan buat baru\!

-----

### 🎯 MISI OPERASI

Dalam misi pertama ini, target kita sederhana tapi krusial:

1.  Merakit "Mesin Virtual" (CPU, RAM, HDD).
2.  Menginstal Nyawa (OS Debian 7) ke dalam mesin tersebut.
3.  Berhasil Login ke layar hitam legendaris (CLI).

-----

### 🛠️ PERSIAPAN BAHAN (Mise en Place)

Jangan perang tanpa senjata. Siapkan ini di laptop Anda:

1.  **Platform Virtualisasi:** Hyper-V (Bawaan Windows) atau VMware Workstation.
2.  **Bahan Bakar Utama:** File ISO [Debian 7 (Wheezy)](https://www.google.com/search?q=https://archive.debian.org/debian/dists/wheezy/main/installer-amd64/current/images/netboot/mini.iso) *(Catatan: Karena ini versi lawas, pastikan link unduhnya valid dari archive).*
3.  **Kopi/Snack:** Wajib. Instalasi butuh waktu menunggu.

-----

### 💻 LANGKAH EKSEKUSI (The Action)

#### TAHAP A: Merakit Hardware Virtual (Hyper-V/VMware)

Kita perlu membuat "Wadah" komputer kosong dulu.

1.  **New Virtual Machine:** Beri nama keren, misal `Debian 7 Server`.
2.  **Generation:** Pilih **Generation 1** (Paling kompatibel untuk OS lawas).
3.  **RAM (Memory):** Cukup **1024 MB (1 GB)**. Linux tanpa grafis itu sangat ringan\!
4.  **Network:** Pilih **NAT** atau **Bridge** (agar nanti bisa dicolok internet).
5.  **Hard Disk:** Alokasikan **15 GB** - 20 GB. (Cukup untuk lab ini).
6.  **Instalasi Media:** Arahkan ke file **ISO Debian 7** yang sudah diunduh.

> **💡 Tips Pro:** Jangan lupa masuk ke *Settings* VM Anda, pastikan urutan *Boot*-nya dimulai dari CD/DVD (ISO) dulu, baru Hard Disk.

-----

#### TAHAP B: Proses Instalasi OS (Langkah Demi Langkah)

Nyalakan VM (`Start`), dan ikuti panduan "Satu Jalur" ini. Jika tidak disebutkan, biarkan *Default*.

**1. The Greeting:**

  * Pilih **Install** (Teks biasa) saja. Tidak perlu *Graphical Install* biar terasa "Hacker"-nya.

**2. Bahasa & Lokasi (Penting\!):**

  * **Language:** `English` (Wajib\! Jangan pakai Indo, nanti bingung membedakan *error log*).
  * **Location:** `Other` -\> `Asia` -\> `Indonesia`.
  * **Locales:** `United States - en_US.UTF-8`.
  * **Keyboard:** `American English`.

**3. Jaringan & Identitas:**

  * **Hostname:** `debian` (atau nama unik server Anda).
  * **Domain Name:** Kosongkan saja (tekan Enter).

**4. Kunci Rahasia (User & Password):**

  * **Root Password:** Masukkan password admin tertinggi. *Saran Lab:* Buat simpel saja (misal: `123` atau samakan dengan user) agar tidak lupa.
  * **Full Name:** Isi nama Anda (misal: `Teungku`).
  * **Username:** Biarkan default (misal: `teungku`).
  * **User Password:** Masukkan password untuk user biasa.

**5. Waktu & Partisi (The Disk):**

  * **Timezone:** Pilih sesuai lokasi (`Western` untuk WIB).
  * **Partition Method:** `Guided - use entire disk` (Paling aman untuk pemula).
  * **Select Disk:** Tekan Enter pada disk virtual 15GB Anda.
  * **Scheme:** `All files in one partition` (Recommended for new users).
  * **Finish:** Pilih `Finish partitioning and write changes to disk`.
  * **Confirm:** Pilih **YES** (Ini poin *no return*, data akan ditulis).

**6. Instalasi Paket (The Core):**

  * **Scan another CD?** `No`.
  * **Use Network Mirror?** `No` (PENTING\! Karena repo Debian 7 sudah mati/archive, ini akan error kalau di-Yes-kan).
  * **Participate Survey?** `No`.
  * **Software Selection (KRUSIAL):**
      * Hapus centang pada *Desktop Environment*.
      * Hapus centang pada *Print Server*.
      * **Pastikan HANYA mencentang:** `Standard System Utilities`.
      * *(Kita ingin server bersih/barebone, kita instal sisanya nanti secara manual).*

**7. Sentuhan Terakhir:**

  * **Install GRUB Boot Loader?** `Yes`.
  * **Finish Installation:** `Continue`. Mesin akan Reboot.

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

Di tahap ini, Anda mungkin panik saat melihat pesan error:

> *"Bad Archive Mirror"* atau *"Cannot Access Repository"*

**Tenang, itu BUKAN salah Anda.**
Ingat, kita memakai Debian 7 (Rilis tahun 2013). Server penyimpanan paket (Repository) resminya sudah dipindahkan ke museum digital (Archive). Installer mencoba menghubungi server yang sudah mati.

**Solusinya?** Lewati saja langkah *Network Mirror* saat instalasi (pilih `No`). Kita akan memperbaiki alamat repositori ini secara manual di **Part 2** nanti. *It's part of the game\!*

-----

### 📸 MOMEN "KA-BOOM\!" (Verification)

Setelah reboot, Anda tidak akan melihat Desktop cantik. Anda akan melihat layar hitam dengan kursor berkedip. Inilah wajah asli server.

Jika Anda melihat ini:

```bash
Debian GNU/Linux 7 debian tty1

debian login: _
```

**SELAMAT\! 🥳**
Misi Part 1 Sukses Besar\! Coba login:

1.  Ketik username: `root`
2.  Ketik password: (password yang Anda buat tadi, tidak akan muncul bintangnya/invisible).

Jika muncul prompt: `root@debian:~#`, berarti Anda resmi menjadi pemilik Server Linux.

**Next Step:** Server ini masih "polos" dan belum punya koneksi ke gudang aplikasi yang benar. Kita akan perbaiki "Jantung"-nya di Part 2.