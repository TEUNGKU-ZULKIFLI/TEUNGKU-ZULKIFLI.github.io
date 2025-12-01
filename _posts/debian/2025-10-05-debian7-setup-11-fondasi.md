---
title: "(Part 12): Konfigurasi Hosting"
date: "2025-10-05"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/aHwVLrsRfr0?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 12): Konfigurasi Hosting
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

---

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

-----

Kita masuk ke materi yang akan membuat Anda merasa seperti **"Juragan Kost Digital"**\! .

Di Part 5, server kita cuma punya satu website (`www.teungku.edu`).
Di Part 12 ini, kita akan menyulap server tersebut agar bisa menampung **banyak website sekaligus** (misal: `blog.teungku.edu`, `toko.teungku.edu`, dll) hanya dengan menggunakan **SATU IP ADDRESS**.

Karena ini melibatkan konfigurasi file yang agak jelimet, kita bagi menjadi **2 Segmen**:

  * **Segmen 1:** Menyiapkan Lahan & Surat Izin (Folder & Konfigurasi).
  * **Segmen 2:** Peresmian & Pemasangan Papan Nama (Enable & DNS).

Mari kita mulai\!

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 12) Hosting Banyak Web: Segmen 1

**(Virtual Host Configuration)**

### 🏷️ TAGLINE

*"Satu Gedung, Seribu Toko: Seni Membagi Ruangan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan IP Address server Anda (`192.168.10.1`) adalah sebuah **Gedung Mall**.
Saat ini, Mall itu cuma punya satu penyewa besar, yaitu `www.teungku.edu`. Pengunjung yang datang ke Mall pasti langsung masuk ke situ.

**Virtual Host** adalah cara kita menyekat-nyekat Mall tersebut menjadi banyak toko kecil.

  * Lantai 1 untuk `www.teungku.edu`.
  * Lantai 2 untuk `blog.teungku.edu`.
  * Lantai 3 untuk `sekolah.teungku.edu`.

Satpam Mall (Apache) akan bekerja lebih pintar. Dia tidak cuma melihat alamat gedung, tapi dia akan bertanya ke pengunjung: *"Kamu mau ke toko yang mana?"*. Kalau pengunjung jawab "Blog", satpam akan mengantar ke Lantai 2.

<img src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQdS5sdu4X1IZQoDzBuqM2VcSGeglx3-ha8BZNz495PVD1wWhYWu9xAKhDMeM0JUQiH-x_NeFC0a_KdW5ZiFJBlcGnxV5vg940gXdnXrWI1UB0ozbY" width="400">

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Membuat folder khusus untuk website kedua (`blog`).
2.  Membuat halaman `index.html` sederhana sebagai tanda pengenal.
3.  Membuat File Konfigurasi Virtual Host (Surat Izin Toko).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan Apache berjalan lancar.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Menyiapkan Lahan (Folder & Konten)

Kita tidak boleh mencampur file `blog` dengan file `www` utama. Kita buatkan folder baru.

**1. Buat Direktori Blog:**

```bash
mkdir /var/www/blog
```

**2. Buat Halaman Sambutan (Index):**
Biar kita tahu kalau kita sudah sampai di blog.

```bash
nano /var/www/blog/index.html
```

**3. Isi Konten Sederhana:**
*(Copy-paste kode HTML ini)*

```html
<html>
  <head>
    <title>Blog Teungku</title>
  </head>
  <body>
    <h1 style="color: blue;">Selamat Datang di Blog Teungku!</h1>
    <p>Ini adalah website kedua yang berjalan di server yang sama.</p>
    <p>Teknologi: Virtual Host Apache.</p>
  </body>
</html>
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

**4. Atur Kepemilikan (Penting):**
Agar Apache bisa membaca file ini.

```bash
chown -R www-data:www-data /var/www/blog
chmod -R 755 /var/www/blog
```

-----

#### TAHAP B: Menerbitkan Surat Izin (Config File)

Sekarang kita harus memberitahu Apache bahwa ada toko baru bernama "Blog".

**1. Masuk ke Kantor Perizinan Apache:**
Lokasi semua konfigurasi website ada di sini.

```bash
cd /etc/apache2/sites-available/
```

**2. Copy Template (Jangan Ngetik dari Nol):**
Kita duplikat saja konfigurasi default yang sudah ada biar tidak capek ngetik.

```bash
cp default blog.teungku.edu
```

**3. Edit Surat Izin Baru:**

```bash
nano blog.teungku.edu
```

**4. MODIFIKASI (Fokus di Sini\!):**
Anda akan melihat banyak teks. Fokus ubah bagian-bagian ini saja:

  * **ServerAdmin:** Ganti jadi email Anda (opsional).
  * **ServerName (WAJIB ADA):** Tambahkan baris ini di bawah ServerAdmin.
    ```apache
    ServerName blog.teungku.edu
    ```
  * **DocumentRoot (WAJIB UBAH):** Arahkan ke folder yang kita buat tadi.
    ```apache
    DocumentRoot /var/www/blog
    ```
  * **Directory (WAJIB UBAH):** Ubah juga path di dalam tag `<Directory ...>`.
    ```apache
    <Directory /var/www/blog>
    ```

**Hasil Akhirnya (Kurang Lebih Begini):**

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@teungku.edu
    ServerName blog.teungku.edu
    
    DocumentRoot /var/www/blog
    <Directory /var/www/blog>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride None
        Order allow,deny
        allow from all
    </Directory>
    
    # ... (sisanya biarkan default) ...
</VirtualHost>
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya sudah buat file config `blog.teungku.edu`, tapi kok pas diakses masih masuk ke web utama (`It works`)?"

**Penyebab:**
Anda baru "Menulis Surat Izin", tapi belum "Menandatangani/Meresmikan"-nya. Apache belum memuat file konfigurasi baru tersebut. File itu masih sekadar teks mati di folder `sites-available`.

**Solusi:**
Kita harus melakukan **Aktivasi (Enable Site)**. Ini akan kita lakukan di **Segmen 2**. Jadi jangan panik kalau belum bisa diakses sekarang.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

Cek apakah file konfigurasi kita bebas dari *Typo* (Salah Ketik).
Apache punya fitur cek sintaks.

**Ketik:**

```bash
apache2ctl configtest
```

**Hasil Sukses:**
Harus muncul tulisan: `Syntax OK`.
*(Kalau muncul warning `Could not reliably determine the server's fully qualified domain name`, abaikan saja. Yang penting `Syntax OK`)*.

-----

*(Segmen 1 Selesai. Toko sudah siap, izin sudah diketik. Sekarang saatnya Gunting Pita Peresmian dan Sebar Brosur di Segmen 2...)*

Ini adalah langkah terakhir untuk menjadi **Juragan Kost Digital**.

Toko (Folder Blog) sudah siap, Surat Izin (Config) sudah diketik. Tapi, toko itu masih "Tutup". Lampunya mati, dan belum ada orang yang tahu kalau toko itu ada.

Di Segmen 2 ini, kita akan melakukan **Gunting Pita (Aktivasi)** dan **Menyebar Brosur (Update DNS)**.

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 12) Hosting Banyak Web: Segmen 2

**(Activation & DNS Mapping)**

### 🏷️ TAGLINE

*"Menyalakan Lampu Toko dan Menyebar Undangan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **a2ensite (Apache2 Enable Site):**
    Di Segmen 1, kita baru menulis surat izin di kertas. Surat itu masih tersimpan di laci (`sites-available`).
    Perintah `a2ensite` adalah tindakan **Menempelkan Surat Izin** itu di dinding (`sites-enabled`). Begitu ditempel, Satpam Mall (Apache) baru sadar: *"Oh, ada toko baru ya? Oke, saya siap antar tamu ke sana."*

2.  **DNS/Hosts:**
    Toko sudah buka, tapi pengunjung (Windows 7) belum tahu namanya. Kalau mereka ketik `blog.teungku.edu`, mereka bingung itu di mana.
    Kita harus update "Buku Kontak" mereka: *"Eh, `blog.teungku.edu` itu alamatnya sama kok dengan `www.teungku.edu` (192.168.10.1). Cuma beda pintu aja."*

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Mengaktifkan website baru dengan perintah sakti `a2ensite`.
2.  Me-reload Apache (Tanpa mematikan server, cuma refresh).
3.  Mendaftarkan nama `blog.teungku.edu` di komputer klien (Windows 7).

-----

### 🛠️ PERSIAPAN

  * Masih login sebagai **root**.
  * Buka **Windows 7** (Klien) Anda.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Gunting Pita (Aktivasi Site)

Kita sahkan konfigurasi yang kita buat di Segmen 1.

**1. Aktifkan Site Blog:**

```bash
a2ensite blog.teungku.edu
```

  * **Hasil:** Muncul tulisan `Enabling site blog.teungku.edu`.
  * *Catatan: Anda tidak perlu mengetik ekstensi `.conf` jika di Debian 7 nama filenya tidak pakai `.conf`. Sesuai nama file yang Anda buat.*

**2. Reload Apache (Penyegaran):**
Kita tidak perlu `restart` (mematikan total). Cukup `reload` (baca ulang konfigurasi) agar pengunjung lain tidak terganggu.

```bash
service apache2 reload
```

  * **Hasil:** `[ ok ] Reloading web server config...`.

-----

#### TAHAP B: Menyebar Undangan (Update DNS Klien)

Supaya Windows 7 tahu ke mana harus pergi saat kita ketik alamat blog.

**Lakukan ini di WINDOWS 7 (Klien):**

**1. Buka Notepad sebagai Administrator:**

  * Start -\> All Programs -\> Accessories.
  * Klik Kanan **Notepad** -\> **Run as administrator**.

**2. Buka File Hosts:**

  * File -\> Open.
  * Arahkan ke: `C:\Windows\System32\drivers\etc\`
  * Ubah pilihan file di pojok kanan bawah dari `Text Documents` menjadi `All Files`.
  * Pilih file bernama **`hosts`**.

**3. Tambahkan Alamat Baru:**
Tambahkan baris untuk blog di bawah alamat utama yang dulu.

```text
192.168.10.1    www.teungku.edu
192.168.10.1    blog.teungku.edu   <-- TAMBAHKAN INI
```

*(Lihat? IP-nya SAMA. Tapi namanya BEDA. Itulah keajaiban Virtual Host).*

**4. Simpan:**
File -\> Save (`Ctrl+S`).

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya sudah reload Apache, sudah edit hosts. Tapi pas buka `blog.teungku.edu`, kok yang muncul masih halaman **'It works\!'** (Halaman Utama)?"

**Penyebab (Browser Cache):**
Browser itu sok tahu. Dia ingat kalau IP `192.168.10.1` itu isinya "It works\!", jadi dia malas ngecek lagi ke server. Dia kasih Anda tampilan lama dari memori dia (Cache).

**Solusi:**

1.  **Hard Refresh:** Tekan `Ctrl + F5` di browser.
2.  **Mode Penyamaran:** Buka browser dalam mode **Incognito / Private Window**. Ini memaksa browser mengambil data segar dari server.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 12)

Saatnya pembuktian apakah Mall kita sudah punya dua toko berbeda.

**1. Buka Toko Utama:**
Ketik: `http://www.teungku.edu`

  * **Hasil:** Halaman putih tulisan **"It works\!"** (Default Apache).

**2. Buka Toko Kedua:**
Ketik: `http://blog.teungku.edu`

  * **Hasil:**
      * Halaman dengan Judul Biru: **"Selamat Datang di Blog Teungku\!"**.
      * Tulisan: *"Ini adalah website kedua..."*.

Jika kedua alamat tersebut menampilkan **konten yang berbeda** padahal **IP-nya sama**, maka...

**SELAMAT\!** 🥳
Anda resmi menjadi **Juragan Hosting**. Anda bisa membuat 10, 100, atau 1000 website di server ini dengan cara yang sama (Buat Folder -\> Buat Config -\> Enable -\> Update Hosts).

-----

**🏁 PENUTUP RESMI PART 12:**
Kita sudah punya banyak website. Tapi... website kita masih pakai `HTTP` (Gembok Terbuka / Tidak Aman). Kalau ada yang login, passwordnya bisa diintip hacker.

Di zaman sekarang, website wajib pakai **HTTPS (Gembok Hijau)**.
Di **(Part 13) Menggembok Situs (SSL/HTTPS)**, kita akan belajar membuat Sertifikat Keamanan sendiri dan memasangnya di Apache.