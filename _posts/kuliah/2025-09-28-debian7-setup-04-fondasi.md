---
title: "(Part 5): Konfigurasi Web Server, Apache2, Perl2, Php5"
date: "2025-09-28"
category: "Kuliah"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/2nWfMydtnzc?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 5): Konfigurasi Web Server, Apache2, Perl2, Php5
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

-----

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

-----

# 📖 BAB 3: WEB HOSTING MASTER

*(Menjadi Hostinger Mini)*

## (Part 5) Membangun Web Server: Segmen 1

**(DNS Fix & Apache Installation)**

### 🏷️ TAGLINE

*"Membangun Ruko Kosong dan Memasang Papan Nama"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Web Server (Apache):** Ini ibarat kita membangun sebuah **Ruko**. Fisiknya ada, pintunya bisa dibuka, tapi di dalamnya masih kosong melompong.
2.  **DNS Fix (Resolv.conf):** Masalah di server kita saat ini, Ruko kita sering "lupa ingatan". Setiap kali listrik mati (reboot), dia lupa alamat dirinya sendiri dan malah nanya ke tetangga (Router NAT). Kita perlu kasih dia "Tato Permanen" biar gak lupa diri.
3.  **Hosts File:** Di laptop kita (Windows), kita perlu simpan "Kartu Nama" server Ruko ini. Biar kalau kita ketik `teungku.edu`, laptop langsung tau rutenya ke mana.

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Mengunci konfigurasi DNS Server agar tidak ditimpa oleh DHCP.
2.  Menginstal **Apache2** (Web Server).
3.  Memperkenalkan identitas domain ke Windows (Hosts File).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Buka Notepad (Run as Administrator) di Windows.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Mengunci Ingatan DNS (The Fix)

Masalah: `resolv.conf` selalu kereset jadi IP Router NAT (`172.x.x.x`).
Solusi: Paksa DHCP Client untuk selalu memprioritaskan diri sendiri (`127.0.0.1`).

**1. Backup Config DHCP Client:**

```bash
cp /etc/dhcp/dhclient.conf /etc/dhcp/dhclient.conf.backup
```

**2. Edit Config:**

```bash
nano /etc/dhcp/dhclient.conf
```

**3. Suntikkan Baris Sakti:**
Cari baris `#prepend domain-name-servers 127.0.0.1;`.
Hilangkan tanda `#`. Jika tidak ada, tulis manual baris ini di mana saja:

```bash
prepend domain-name-servers 127.0.0.1;
```

*(Artinya: "Hei, sebelum nanya orang lain, tanya diri sendiri dulu\!")*

Simpan dan keluar.

**4. Refresh Koneksi:**

```bash
ifdown eth1 && ifup eth1
```

*(Tunggu sebentar sampai selesai).*

**5. Cek Hasil:**

```bash
cat /etc/resolv.conf
```

  * **Harapan:** Baris paling atas harus `nameserver 127.0.0.1`.

-----

#### TAHAP B: Membangun Ruko (Install Apache)

**1. Update Repo:**

```bash
apt-get update
```

**2. Install Apache:**

```bash
apt-get install apache2 -y
```

**3. Cek Status:**

```bash
/etc/init.d/apache2 status
```

  * **Hasil:** `Apache2 is running`.

-----

#### TAHAP C: Memasang Papan Nama (ServerName)

Supaya Apache tidak bingung dia siapa.

**1. Amankan Identitas (Security):**
Sembunyikan versi server agar tidak diintip hacker.

```bash
nano /etc/apache2/conf.d/security
```

Ubah:

  * `ServerTokens Prod`
  * `ServerSignature Off`

**2. Set ServerName:**
Edit file kosong konfigurasi user.

```bash
nano /etc/apache2/httpd.conf
```

Isi dengan satu baris:

```bash
ServerName www.teungku.edu
```

**3. Restart Apache:**

```bash
/etc/init.d/apache2 restart
```

-----

#### TAHAP D: Menyebar Kartu Nama (Di Windows)

Agar laptop kita kenal `teungku.edu`.

**1. Buka Hosts File di Windows:**

  * Buka Notepad (Run as Admin).
  * Open File: `C:\Windows\System32\drivers\etc\hosts`.

**2. Tambahkan Baris Ini:**
Di paling bawah:

```text
192.168.10.1    teungku.edu
192.168.10.1    www.teungku.edu
192.168.10.1    debian.teungku.edu
```

Save dan Close.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

**1. Tes Ping Nama:**
Buka CMD di Windows, ketik: `ping www.teungku.edu`.

  * **Hasil:** Reply from `192.168.10.1`. (Windows sudah kenal nama server).

**2. Tes Buka Toko:**
Buka Browser di Windows, ketik: `http://www.teungku.edu`.

  * **Hasil:** Muncul tulisan besar **"It works\!"**.

Selamat\! Ruko web Anda sudah berdiri kokoh. Tapi isinya masih kosong (cuma file HTML statis). Di segmen selanjutnya, kita akan mengajari server bahasa pemrograman **Perl**.

-----

*(Segmen 1 Selesai. Lanjut ke Segmen 2: Perl Support...)*

Sekarang kita lanjut ke **Segmen 2**.
Ruko (Apache) kita sudah berdiri, tapi dia masih "bisu". Dia cuma bisa menyodorkan brosur (file HTML statis). Kita ingin dia bisa "berpikir" dan melakukan tugas dinamis (seperti menghitung waktu).

Kita akan mengajarinya bahasa pemrograman pertamanya: **Perl**.

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 5) Membangun Web Server: Segmen 2

**(Perl Support & CGI)**

### 🏷️ TAGLINE

*"Mengajari Server Bicara Bahasa Asing Pertama"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Saat ini, Web Server Anda ibarat **Pelayan Restoran** yang kerjanya cuma membagikan **Menu Makanan** (HTML). Menunya tetap, tidak berubah mau siapa saja yang baca.

Kita ingin Pelayan ini bisa menghitung **Tagihan** (Konten Dinamis). Tagihan itu berubah-ubah sesuai pesanan dan waktu.
Untuk melakukan itu, Pelayan butuh otak tambahan. Kita akan pasangkan otak **Perl (Mod\_Perl)**.
Kita juga akan siapkan meja khusus (`/var/www/perl`) di mana semua perhitungan itu dilakukan.

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Menginstal **Modul Perl** untuk Apache.
2.  Membuat folder khusus untuk skrip Perl (CGI).
3.  Membuat konfigurasi agar Apache tahu cara menjalankan file `.pl` (bukan cuma menampilkannya sebagai teks).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Siapkan mental ngoding sedikit (menyalin script).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Merekrut Penerjemah (Install Modul)

Kita instal "otak" tambahannya dulu.

**1. Instal Paket:**

```bash
apt-get install libapache2-mod-perl2 -y
```

*(Tunggu proses selesai. Apache akan otomatis merestart dirinya sendiri).*

-----

#### TAHAP B: Menyiapkan Meja Kerja (Folder & Script)

Kita pisahkan file program dengan file gambar/html biasa agar rapi.

**1. Buat Folder Khusus:**

```bash
mkdir /var/www/perl
```

**2. Buat Script Uji Coba (`test.pl`):**
Kita buat program sederhana yang menampilkan Jam Server.

```bash
nano /var/www/perl/test.pl
```

**3. Masukkan Kode Perl Ini:**
*(Copy-paste semua)*

```perl
#!/usr/bin/perl
print "Content-type: text/html\n\n";
print "<html><head><title>Perl Test</title></head><body>";
print "<h1>Halo dari Perl!</h1>";
my $tanggal = localtime();
print "<p>Waktu di Server saat ini: <b>$tanggal</b></p>";
print "</body></html>";
```

Simpan (`Ctrl+O`) dan keluar.

**4. Beri Izin Eksekusi (PENTING\!):**
Linux tidak akan menjalankan program yang tidak punya izin "Execute".

```bash
chmod +x /var/www/perl/test.pl
```

-----

#### TAHAP C: Menulis Aturan Main (Apache Config)

Apache belum tahu kalau file di dalam `/var/www/perl` itu adalah program. Dia pikir itu cuma teks biasa. Kita harus kasih tahu.

**1. Buat File Konfigurasi Baru:**
Di Debian 7, kita bisa taruh config tambahan di `conf.d`.

```bash
nano /etc/apache2/conf.d/perl.conf
```

**2. Masukkan Aturan Eksekusi:**

```apache
<Directory /var/www/perl>
    Options +ExecCGI
    AddHandler cgi-script .cgi .pl
</Directory>
```

  * **Options +ExecCGI:** "Hei Apache, file di sini boleh DILAKUKAN (Execute), bukan cuma DIBACA."
  * **AddHandler:** "Kalau file-nya berakhiran `.pl`, panggil mesin Perl untuk mengerjakannya."

Simpan dan keluar.

**3. Restart Apache:**

```bash
/etc/init.d/apache2 restart
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, pas saya buka di browser, kok yang muncul malah **kodingannya**, bukan hasilnya?"

**Penyebab:**
Apache gagal paham. Dia menganggap file itu teks biasa (`text/plain`). Ini terjadi karena:

1.  Lupa langkah `AddHandler` di config.
2.  Lupa restart Apache.
3.  Salah folder (naruh file `.pl` di luar folder `/var/www/perl`).

**Solusi:** Cek lagi TAHAP C. Pastikan konfigurasinya benar dan Apache sudah direstart.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 2)

Buka Browser di Windows 7 (atau Laptop Host).

**Kunjungi:** `http://www.teungku.edu/perl/test.pl`

**Hasil Sukses:**

1.  Muncul tulisan besar: **"Halo dari Perl\!"**
2.  Di bawahnya ada jam: *"Waktu di Server saat ini: Mon Dec 01 14:00:00 2025"* (Sesuai jam server).
3.  Coba **Refresh** halaman. Detik pada jam harus berubah.

Jika jamnya berubah saat di-refresh, berarti server Anda sudah pintar (Dinamis)\!

-----

*(Segmen 2 Selesai. Kita lanjut ke Segmen Terakhir:\!  Menginstal Raja Web Dinamis, yaitu **PHP 5**...)*

Siap\! Ini adalah **Segmen Terakhir** untuk Part 5.

Kita sudah punya Ruko (Apache) dan Kalkulator (Perl). Sekarang kita akan mendatangkan **Chef Utama** yang bisa memasak segala jenis hidangan web modern (WordPress, Joomla, Facebook, dll).

Chef itu bernama **PHP**. Tanpa PHP, web server hanyalah pengantar surat. Dengan PHP, dia menjadi aplikasi pintar.

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 5) Membangun Web Server: Segmen 3/3

**(PHP 5 Integration)**

### 🏷️ TAGLINE

*"Menghidupkan Otak Utama Internet"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Jika HTML adalah **Kertas Menu** (Statis), dan Perl adalah **Kalkulator Kasir** (Hitungan Sederhana), maka **PHP** adalah **Dapur Masak Utama**.

Hampir 80% website di dunia (termasuk Facebook di masa awalnya) dibangun pakai PHP.
Kita juga akan langsung menginstal **"Jembatan Gudang" (`php5-mysql`)**.
Kenapa? Karena PHP (Dapur) seringkali butuh mengambil bahan makanan (Data) dari Gudang (Database MySQL). Tanpa jembatan ini, Chef PHP tidak bisa mengambil stok barang.

-----

### 🎯 MISI OPERASI (Segmen 3)

1.  Menginstal **PHP 5** dan Modul Apache-nya.
2.  Menginstal Modul Konektor **MySQL** (Persiapan untuk Part 9).
3.  Membuat halaman `test.php` untuk melihat "jeroan" server.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan Apache sedang berjalan (`service apache2 status`).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 3)

#### TAHAP A: Merekrut Chef (Instalasi PHP)

Kita instal paket komplitnya sekaligus.

**1. Jalankan Perintah Instalasi:**

```bash
apt-get install php5 libapache2-mod-php5 php5-mysql -y
```

  * **php5:** Bahasa pemrogramannya.
  * **libapache2-mod-php5:** Agar Apache mengerti bahasa PHP.
  * **php5-mysql:** Agar PHP bisa ngobrol sama Database nanti.

**2. Restart Apache (WAJIB):**
Setiap kali nambah modul baru, Apache harus disegarkan ingatan-nya.

```bash
/etc/init.d/apache2 restart
```

  * **Hasil:** Harus `[ ok ]`.

-----

#### TAHAP B: Ujian Kualifikasi Chef (Testing)

Kita tidak perlu bikin kodingan rumit. PHP punya satu perintah sakti untuk membuktikan dia sudah siap kerja.

**1. Buat File Tes:**
Taruh di folder utama web (`/var/www`).

```bash
nano /var/www/test.php
```

**2. Masukkan Mantra Sakti:**
Cukup satu baris ini saja:

```php
<?php phpinfo(); ?>
```

*(Fungsi `phpinfo()` akan mencetak laporan panjang lebar tentang kondisi server).*

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, pas saya buka `test.php` di browser, kok malah **download file**? Atau malah muncul tulisan `<?php...` mentah-mentah?"

**Penyebab:**
Apache belum "sadar" kalau dia punya teman baru bernama PHP. Dia memperlakukan file `.php` seperti file teks biasa atau file unduhan.
Ini biasanya terjadi karena:

1.  Lupa restart Apache setelah install.
2.  Ada error saat instalasi `libapache2-mod-php5`.

**Solusi:**
Coba restart lagi: `/etc/init.d/apache2 restart`.
Jika masih bandel, paksa aktifkan modulnya: `a2enmod php5` lalu restart lagi.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 3)

Kembali ke Browser Windows 7.

**Kunjungi:** `http://www.teungku.edu/test.php`

**Hasil Sukses:**
Anda akan melihat **Tabel Ungu/Biru Panjang** yang sangat detail.

  * Ada Logo besar **PHP** di atas kiri.
  * Tulisan **PHP Version 5.4.x** (atau sejenisnya).
  * Gulir ke bawah, cari bagian **mysql**. Jika ada tabel mysql, berarti persiapan kita untuk Part 9 sudah sempurna.

-----

**🏁 PENUTUP RESMI PART 5:**

**SELAMAT\!** 🎊
Anda baru saja menyelesaikan **Part 5**. Ini adalah lompatan besar.
Server Anda sekarang:

1.  Punya Nama Domain sendiri (`teungku.edu`).
2.  Bisa menyajikan Web Statis (HTML).
3.  Bisa menyajikan Web Dinamis (Perl & PHP).

**Apa Selanjutnya?**
Ruko dan Dapur (PHP) sudah siap, tapi **Gudangnya (Database)** belum ada. Aplikasi modern butuh tempat nyimpen data user, barang, dll.

Di **(Part 9) Manajemen Data (MySQL & PhpMyAdmin)**, kita akan membangun gudang data tersebut dan menginstal alat untuk mengelolanya lewat browser.