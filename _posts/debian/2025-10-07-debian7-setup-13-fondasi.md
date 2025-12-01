---
title: "(Part 14): Konfigurasi User Dir"
date: "2025-10-07"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/W96IMb0NYEQ?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 14): Konfigurasi User Dir
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

Ini adalah penutup manis untuk **BAB 3**.

Kita sudah punya Ruko Besar (Virtual Host). Tapi, bagaimana kalau ada teman yang cuma mau "numpang" bikin halaman web sederhana tanpa perlu menyewa satu ruko penuh?

Kita akan menggunakan fitur klasik Apache bernama **UserDir**. Ini adalah cikal bakal dari layanan "Free Hosting" zaman dulu (seperti GeoCities).

Mari kita "lantakkan" part terakhir di Bab 3 ini\!

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 14) Paket Hemat Hosting: UserDir

**(Personal Web Space Configuration)**

### 🏷️ TAGLINE

*"Memberi Lapak Jualan untuk Setiap Penduduk"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Virtual Host (Part 12):** Itu ibarat membuka **Cabang Toko Baru**. Butuh surat izin khusus, butuh konfigurasi admin, dan punya alamat sendiri (`blog.teungku.edu`). Ribet kalau cuma untuk iseng.
2.  **UserDir (Part 14):** Itu ibarat **Kamar Kost**.
    Server adalah Ibu Kost. User (seperti `teungku`, `budi`) adalah penghuni kost.
    Setiap penghuni boleh menempel poster atau jualan di jendela kamarnya masing-masing.
    Alamatnya numpang alamat induk, ditambah nomor kamar.
      * Contoh: `www.teungku.edu/~teungku` (Tanda `~` artinya "Rumah/Kamar").

-----

### 🎯 MISI OPERASI

1.  Mengaktifkan modul **UserDir** di Apache.
2.  Membuat folder khusus bernama `public_html` di dalam rumah user.
3.  Mengakses web pribadi menggunakan tanda gelombang (`~`).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root** (untuk setting server).
  * Kita akan pakai user `teungku` sebagai kelinci percobaan (atau user non-root lainnya).

-----

### 💻 LANGKAH EKSEKUSI

#### TAHAP A: Membuka Izin Kost (Enable Module)

Secara default, Apache melarang user biasa punya web sendiri. Kita izinkan dulu.

**1. Aktifkan Modul:**

```bash
a2enmod userdir
```

  * **Hasil:** `Enabling module userdir`.

**2. Restart Apache:**

```bash
service apache2 restart
```

-----

#### TAHAP B: Menghias Kamar (Create Content)

Sekarang kita bertindak sebagai user biasa (`teungku`). Apache hanya akan mencari folder bernama **`public_html`**. Kalau namanya beda, dia tidak akan ketemu.

**1. Buat Folder Web:**
Kita taruh di dalam folder home user.

```bash
mkdir /home/teungku/public_html
```

**2. Buat Halaman Profil:**

```bash
nano /home/teungku/public_html/index.html
```

**3. Isi Konten Sederhana:**
*(Copy-paste kode ini)*

```html
<html>
  <head><title>Lapak Teungku</title></head>
  <body style="background-color: #f0f0f0;">
    <h1>Halo! Ini Web Pribadi Teungku</h1>
    <p>Halaman ini di-hosting menggunakan fitur <b>UserDir</b>.</p>
    <p>Saya cuma user biasa, tapi saya punya web sendiri!</p>
  </body>
</html>
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

**4. Atur Kepemilikan (PENTING\!):**
Karena kita buat ini pakai `root`, kita harus kembalikan kepemilikannya ke `teungku` agar sah.

```bash
chown -R teungku:teungku /home/teungku/public_html
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, pas dibuka muncul **403 Forbidden** (You don't have permission)."

**Penyebab:**
Ini masalah privasi Linux.
Apache (user `www-data`) mencoba masuk ke kamar `/home/teungku`, tapi pintunya dikunci rapat (Permission `700` atau `drwx------`). Apache tidak boleh masuk, makanya Forbidden.

**Solusi:**
Kita harus melonggarkan sedikit pintu rumah user agar Apache bisa "mengintip".

```bash
chmod 755 /home/teungku
```

*(Ini membolehkan orang lain untuk "Read/Execute" folder home, tapi tidak bisa "Write"/mengacak-acak).*

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 14)

Buka Browser di Windows 7.

**Ketik Alamat Unik Ini:**
`http://www.teungku.edu/~teungku`

*(Perhatikan tanda tilde `~` sebelum nama user. Di keyboard, biasanya ada di sebelah kiri angka 1, pakai Shift).*

**Hasil Sukses:**

1.  Muncul halaman dengan latar belakang abu-abu.
2.  Tulisan besar: **"Halo\! Ini Web Pribadi Teungku"**.

Jika muncul, selamat\! Anda sudah berhasil membuat layanan "Shared Hosting" paling sederhana di dunia.
Jika Anda membuat user baru bernama `budi`, lalu buat folder `public_html` di `/home/budi`, maka otomatis dia bisa diakses di `~budi` tanpa perlu restart server lagi\!

-----

**🏁 PENUTUP RESMI BAB 3:**

**MISI SELESAI\!** 🎊
Kita telah menamatkan **BAB 3: WEB HOSTING MASTER**.

Mari kita rekap kekayaan fitur Server Anda:

1.  **Web Server Utama:** `www.teungku.edu` (Apache/PHP).
2.  **Database:** MySQL & PhpMyAdmin.
3.  **Virtual Host:** `blog.teungku.edu`.
4.  **Keamanan:** HTTPS/SSL.
5.  **Personal Web:** `www.teungku.edu/~teungku`.

Server Anda sudah sangat powerful untuk urusan Website.
Tapi... bagaimana cara server ini berkomunikasi dengan dunia luar lewat surat?

Di **BAB 4**, kita akan membangun **Kantor Pos Digital (Mail Server)**. Kita akan bisa kirim email dari `teungku@teungku.edu` ke user lain.