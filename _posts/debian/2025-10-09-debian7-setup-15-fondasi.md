---
title: "(Part 16): Install & Konfigurasi Polisi Konten SquidGuard"
date: "2025-10-09"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/l5C7JbDvJos?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 16): Install & Konfigurasi Polisi Konten SquidGuard
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

---

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

---

Ini adalah **Bagian Terakhir** dari BAB 5 dan salah satu bagian paling seru.

Kita sudah punya Satpam (Squid) yang mencatat siapa saja yang masuk. Tapi Satpam itu masih pasif. Dia membiarkan pencuri (Situs Judol/Porno) masuk begitu saja.

Sekarang, kita akan mempersenjatai Satpam tersebut dengan **Daftar Hitam (Blacklist)** dan pentungan. Namanya **SquidGuard**.

Mari kita "lantakkan" situs-situs negatif\!

-----

# 📖 BAB 5: KEAMANAN & KONTROL

## (Part 16) Polisi Konten: SquidGuard Anti-Judol

**(Web Filtering & Blocking)**

### 🏷️ TAGLINE

*"Polisi Galak yang Tidak Pandang Bulu"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Squid (Part 15):** Adalah **Gerbang Tol**. Semua mobil (trafik) wajib lewat sini. Dia mencatat plat nomor, tapi dia membuka palang untuk siapa saja.
2.  **SquidGuard (Part 16):** Adalah **Polisi** yang berdiri di sebelah gerbang tol. Dia memegang buku tebal berisi **Daftar Buronan** (Blacklist).
      * Mobil lewat -\> Squid tanya Polisi: *"Pak, ini plat nomor `judol.com`, boleh lewat?"*
      * Polisi cek buku: *"Itu buronan\! STOP\! Putar balik ke kantor polisi (Halaman Blokir)\!"*

Tanpa SquidGuard, Squid tidak bisa memblokir secara spesifik dan massal.

-----

### 🎯 MISI OPERASI

1.  Menginstal **SquidGuard**.
2.  Mengunduh Database Blacklist (Daftar situs judi/porno dunia).
3.  Membuat Halaman Blokir ("Internet Positif" versi kita).
4.  Mengintegrasikan SquidGuard agar bekerja sama dengan Squid.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan Squid3 (Part 15) sudah berjalan normal.
  * Koneksi internet stabil (untuk download blacklist sekitar 5-10 MB).

-----

### 💻 LANGKAH EKSEKUSI

#### TAHAP A: Merekrut Polisi (Instalasi)

**1. Instal Paket:**

```bash
apt-get install squidguard -y
```

**2. Siapkan Folder Database:**
Tempat kita menyimpan "Buku Hitam".

```bash
mkdir -p /var/lib/squidguard/db
cd /var/lib/squidguard/db
```

-----

#### TAHAP B: Mengambil Buku Hitam (Download Blacklist)

Kita tidak mungkin mengetik satu per satu juta situs judi. Kita download daftar yang sudah jadi (UT1 Blacklist).

**1. Download Database:**
*(Gunakan `--no-check-certificate` karena sertifikat SSL Debian 7 sudah tua)*

```bash
wget --no-check-certificate http://dsi.ut-capitole.fr/blacklists/download/blacklists.tar.gz
```

*Jika masih tidak bisa diunduh coba command satu ini*
```bash
wget http://dsi.ut-capitole.fr/blacklists/download/blacklists.tar.gz
```

**2. Ekstrak File:**

```bash
tar -zxvf blacklists.tar.gz
```

*(Tunggu prosesnya. Nanti akan muncul folder baru bernama `blacklists`)*.

**3. Atur Kepemilikan (PENTING\!):**
Database ini milik `root` saat diekstrak. Kita harus kasih ke `proxy` (user Squid) agar bisa dibaca.

```bash
chown -R proxy:proxy /var/lib/squidguard/db
```

-----

#### TAHAP C: Membuat Sel Penjara (Halaman Blokir)

Kalau ada yang akses Judol, kita lempar ke halaman ini.

**1. Buat File HTML:**

```bash
nano /var/www/block.html
```

**2. Isi Pesan Menohok:**

```html
<html>
<head><title>AKSES DITOLAK</title></head>
<body style="background-color:red; color:white; text-align:center; margin-top:50px;">
  <h1>⛔ STOP! ⛔</h1>
  <h2>Situs yang Anda tuju mengandung konten (JUDI/PORNO).</h2>
  <img src=https://upload.wikimedia.org/wikipedia/en/7/73/Trollface.png>
  <p>Akses telah diblokir oleh Admin Jaringan Teungku.</p>
  <p><i>Tobatlah sebelum terlambat.</i></p>
      <img src=https://s3.getstickerpack.com/storage/uploads/sticker-pack/orang/sticker_11.png?0c6781eb2eda8861f479cab3c5ad6b80>
</body>
</html>
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

-----

#### TAHAP D: Menulis Undang-Undang (`squidGuard.conf`)

Kita atur kategori apa yang mau diblokir.

**1. Edit Config:**
*(Lokasi config bisa beda, di Debian 7 biasanya di sini)*:

```bash
nano /etc/squidguard/squidGuard.conf
```

**2. Hapus Semua Isinya, Ganti dengan Ini:**
*(Ini konfigurasi bersih dan to-the-point)*.

```bash
# === KONFIGURASI ANTI-JUDOL ===

# Lokasi Database
dbhome /var/lib/squidguard/db/blacklists
logdir /var/log/squidguard

# Definisi Kategori JUDI (Gambling)
dest gambling {
    domainlist gambling/domains
    urllist gambling/urls
}

# Definisi Kategori PORNO (Opsional)
dest porn {
    domainlist porn/domains
    urllist porn/urls
}

# Aturan Main (ACL)
acl {
    # Blokir Gambling dan Porn, Sisanya Boleh (Pass)
    default {
        pass !gambling !porn all
        redirect http://www.teungku.edu/block.html
    }
}
```

Simpan dan keluar.

**3. Kompilasi Database (Momen Menegangkan):**
Kita harus ubah teks blacklist menjadi database biner `.db` biar cepat.

```bash
squidGuard -C all
```

  * **Tunggu\!** Proses ini bisa memakan waktu 1-2 menit tergantung kecepatan server.
  * **Sukses:** Jika kembali ke prompt tanpa error fatal.
  * **Setelah selesai:** Jalankan lagi `chown -R proxy:proxy /var/lib/squidguard/db` untuk memastikan file `.db` baru juga milik proxy.

-----

#### TAHAP E: Penyatuan (Integrasi ke Squid)

Satpam (Squid) belum tahu kalau ada Polisi (SquidGuard). Kita kenalkan.

**1. Edit Config Squid:**

```bash
nano /etc/squid3/squid.conf
```

**2. Tambahkan di BARIS PALING BAWAH:**

```bash
# Integrasi SquidGuard
url_rewrite_program /usr/bin/squidGuard -c /etc/squidguard/squidGuard.conf
url_rewrite_children 5
```

**3. Restart Squid:**

```bash
service squid3 restart
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya buka situs biasa bisa. Tapi pas buka situs judi, browsernya *loading* terus atau *error connection*, bukannya muncul halaman merah `block.html`."

**Penyebab:**
SquidGuard berhasil memblokir, TAPI dia gagal mengalihkan ke `block.html`.
Ini biasanya karena **Permissions**. User `proxy` tidak boleh menulis log di `/var/log/squidguard`.

**Solusi:**
Pastikan folder log juga milik proxy:

```bash
mkdir -p /var/log/squidguard
chown -R proxy:proxy /var/log/squidguard
```

Lalu restart Squid lagi.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 16)

Pindah ke **Windows 7**.

**1. Tes Situs Halal:**
Buka `google.com` atau `detik.com`.

  * **Hasil:** Terbuka normal. (Artinya internet lancar).

**2. Tes Situs Haram (Judol):**
Coba buka situs judi terkenal (misal `sbobet.com` atau cari di Google "situs judi").
*Atau kalau mau aman, masukkan `detik.com` ke daftar blacklist manual buat tes.*

  * **Hasil Sukses:**
    Browser langsung berubah merah.
    Muncul tulisan besar: **"⛔ STOP\! ⛔ ... Tobatlah sebelum terlambat."**

Jika halaman merah itu muncul, **SELAMAT\!** 🎉
Anda telah berhasil membangun tembok api pelindung moral.

-----

**🏁 PENUTUP RESMI BAB 5 & SERI UTAMA:**

Kita telah menyelesaikan **5 BAB UTAMA** dari perjalanan "The Server Journey"\! 👏👏👏

1.  **Server Hidup** (Bab 1).
2.  **Koneksi Lancar** (Bab 2).
3.  **Hosting Jalan** (Bab 3).
4.  **Email Terkirim** (Bab 4).
5.  **Aman Terkendali** (Bab 5).

Masih ada satu **Bonus Track (Bab 6)** bagi mereka yang lelah melihat layar hitam melulu. Kita akan menyulap server ini menjadi punya tampilan Grafis (Desktop) seperti Windows.