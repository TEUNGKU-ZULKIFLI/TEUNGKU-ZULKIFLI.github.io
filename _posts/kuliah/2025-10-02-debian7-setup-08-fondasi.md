---
title: "(Part 9): Install dan Konfigurasi Database Mysql & PhpMyAdmin"
date: "2025-10-02"
category: "Kuliah"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/sfyh6qfrUC4?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 9): Install dan Konfigurasi Database Mysql & PhpMyAdmin
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

---

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

----

Ruko (Apache) sudah ada, Dapur (PHP) sudah ngebul. Sekarang kita butuh **Gudang (Database)** untuk menyimpan data pelanggan, stok barang, dan rahasia perusahaan.

Tanpa Database, website kita pelupa. Kalau server restart, semua data hilang. Dengan Database, data tersimpan abadi.

Karena Part 9 ini melibatkan instalasi dua komponen besar (Database Engine & GUI Manager), saya bagi menjadi **2 Segmen** agar tidak pusing.

  * **Segmen 1:** Membangun Gudang Data (MySQL Server).
  * **Segmen 2:** Memasang Manajer Gudang (PhpMyAdmin).

Mari kita mulai\!

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 9) Manajemen Data: Segmen 1

**(MySQL Server Installation)**

### 🏷️ TAGLINE

*"Membangun Gudang Besi untuk Menyimpan Ingatan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan **PHP** adalah **Koki**. Dia jago masak, tapi dia tidak punya kantong.
Kalau ada pelanggan yang titip pesan: *"Mas, simpan nama saya ya"*, si Koki bingung mau taruh di mana.

Maka kita bangun **Gudang (MySQL)**.
MySQL adalah lemari arsip raksasa. Koki (PHP) tinggal teriak: *"Hei MySQL, simpan data 'Teungku' di Laci Nomor 5\!"*
Besoknya, Koki bisa minta lagi: *"Hei MySQL, siapa nama orang di Laci Nomor 5 tadi?"*

Jadi, MySQL adalah **Memori Jangka Panjang** server kita.

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Menginstal **MySQL Server** (Mesin Database).
2.  Membuat **Password Root** khusus Database (Ingat: Ini BEDA dengan password login Linux\!).
3.  Menguji apakah gudang bisa dibuka lewat terminal.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Siapkan password baru yang kuat tapi mudah diingat (untuk database).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Membangun Gudang (Instalasi)

**1. Jalankan Perintah Instalasi:**
Kita butuh Server (gudangnya) dan Client (kunci pembukanya).

```bash
apt-get install mysql-server mysql-client -y
```

**2. MOMEN KRUSIAL (Layar Merah/Biru/Pink):**
Di tengah instalasi, layar akan berubah warna dan meminta password.

  * **New password for the MySQL "root" user:** Masukkan password (misal: `admin123`).
  * **Repeat password:** Masukkan lagi password yang sama.

> **⚠️ PERINGATAN:**
> Jangan dikosongkan\! Kalau kosong, nanti PhpMyAdmin sering error/menolak login.
> Ingat baik-baik password ini. Ini adalah **Kunci Gudang**.

-----

#### TAHAP B: Mengamankan Gudang (Security Script)

MySQL bawaan pabrik masih agak longgar keamanannya. Kita kencangkan bautnya.

**1. Jalankan Skrip Pengaman:**

```bash
mysql_secure_installation
```

**2. Jawab Pertanyaan Security:**

  * *Enter current password for root:* Masukkan password yang tadi Anda buat.
  * *Change the root password?* **n** (No, kan baru aja dibuat).
  * *Remove anonymous users?* **Y** (Hapus user hantu).
  * *Disallow root login remotely?* **Y** (Biar gak dibobol dari luar).
  * *Remove test database?* **Y** (Hapus database sampah).
  * *Reload privilege tables now?* **Y** (Terapkan sekarang).

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya lupa password MySQL saya pas instalasi tadi\! Gimana dong?"

**Solusi Darurat:**
Merestet password root MySQL itu ribet (harus matikan service, nyalakan mode safe, dll).
**Pencegahan:** Catat password MySQL Anda SEKARANG JUGA di Notepad/Kertas. Bedakan dengan password login Linux biar aman, tapi untuk Lab, disamakan dulu tidak apa-apa biar tidak lupa.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

Mari kita coba masuk ke dalam gudang lewat pintu belakang (Terminal).

**1. Login ke MySQL:**

```bash
mysql -u root -p
```

*(Artinya: Masuk MySQL sebagai user root, dan tanyakan password).*

**2. Masukkan Password:**
Ketik password MySQL Anda (tidak akan muncul bintangnya).

**3. Hasil Sukses:**
Prompt terminal akan berubah dari `root@debian:~#` menjadi:

```mysql
mysql>
```

Jika sudah muncul tulisan `mysql>`, berarti Anda sudah berada di dalam gudang data.

**4. Cek Rak (Database):**
Ketik perintah ini (akhiri dengan titik koma):

```mysql
show databases;
```

  * **Hasil:** Muncul daftar database bawaan (`information_schema`, `mysql`, dll).

**5. Keluar:**
Ketik: `exit`

-----

*(Segmen 1 Selesai. Gudang sudah jadi, tapi gelap gulita karena cuma pakai teks hitam putih. Di Segmen 2, kita akan pasang lampu dan meja resepsionis canggih bernama **PhpMyAdmin**...)*

Analogi: *"MySQL itu 'Raja Gudang', tapi dia galak (cuma mau ngomong pakai teks hitam putih). Jadi kita butuh 'Juru Bicara' yang ganteng dan ramah (UI), yaitu **PhpMyAdmin**."*

Mari kita pasang "Wajah Ganteng" untuk database kita.

-----

# 📖 BAB 3: WEB HOSTING MASTER

## (Part 9) Manajemen Data: Segmen 2

**(PhpMyAdmin Installation)**

### 🏷️ TAGLINE

*"Mengelola Gudang Data Tanpa Mengotori Tangan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Di Segmen 1, kita masuk ke MySQL lewat terminal (`mysql -u root -p`). Itu ibarat masuk gudang gelap bawa senter. Mau cari barang harus hapal kode letak raknya (`SELECT * FROM...`). Ribet\!

**PhpMyAdmin** adalah **Ruang Kontrol (Control Room)**.
Dia punya tampilan grafis (Web), tombol-tombol yang jelas, dan tabel yang rapi. Kita bisa membuat database, melihat data, dan menghapus data hanya dengan **Klik Mouse**. Tidak perlu ngetik kode aneh-aneh lagi.

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Menginstal **PhpMyAdmin**.
2.  **MOMEN KRUSIAL:** Menghubungkan PhpMyAdmin dengan Apache (Jangan salah pencet tombol\!).
3.  Login ke Dashboard Database lewat Browser.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * **Kopi masih panas?** Karena Anda butuh fokus tingkat dewa di langkah instalasi ini. Salah pencet tombol = Error 404.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Memanggil Sang Manajer (Instalasi)

**1. Jalankan Perintah Instalasi:**

```bash
apt-get install phpmyadmin -y
```

**2. ⚠️ JEBAKAN BATMAN (Web Server Selection):**
Akan muncul layar biru/merah/abu-abu yang bertanya: *"Web server to reconfigure automatically:"*
Pilihannya: `[ ] apache2` dan `[ ] lighttpd`.

  * **JANGAN LANGSUNG TEKAN ENTER\!**
  * Tekan **SPASI** (Spacebar) pada `apache2` sampai muncul tanda bintang `[*] apache2`.
  * Baru tekan **TAB** ke tombol `<Ok>`, lalu **ENTER**.

> *Kalau Anda lupa tekan Spasi, PhpMyAdmin tidak akan nyambung ke Apache. Akibatnya: 404 Not Found.*

**3. Konfigurasi Database (dbconfig-common):**
Muncul pertanyaan: *"Configure database for phpmyadmin with dbconfig-common?"*

  * Pilih **\<Yes\>**.

**4. Password Aplikasi:**
Muncul: *"Password of the database's administrative user:"*

  * Masukkan password root MySQL yang Anda buat di Segmen 1 (misal `admin123`).
  * Jika diminta *"MySQL application password for phpmyadmin"*: Masukkan password yang sama lagi biar tidak bingung.

-----

#### TAHAP B: Penyelamatan Darurat (Opsional tapi Sering Terjadi)

Jika di langkah A-2 Anda tidak sengaja melakukan kesalahan (lupa tekan spasi), Apache tidak akan tahu keberadaan PhpMyAdmin.

Kita buat "Jalan Pintas" manual agar pasti aman.

**1. Edit Config Apache:**

```bash
nano /etc/apache2/apache2.conf
```

**2. Tambahkan di Baris Paling Bawah:**

```bash
# Include PhpMyAdmin
Include /etc/phpmyadmin/apache.conf
```

**3. Restart Apache:**

```bash
/etc/init.d/apache2 restart
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, instalasi sukses. Tapi pas buka `teungku.edu/phpmyadmin`, browser bilang **404 Not Found**."

**Penyebab:**
Ingat "Jebakan Batman" di Tahap A-2? 99% pemula lupa menekan **SPASI** saat memilih `apache2`. Mereka langsung Enter, jadi Apache tidak terpilih.

**Solusi:**
Lakukan **TAHAP B** di atas. Itu memaksa Apache untuk membaca konfigurasi PhpMyAdmin secara manual. Masalah pasti beres.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 9)

Pindah ke **Windows 7** (Klien).

**1. Buka Browser:**
Ketik alamat: `http://www.teungku.edu/phpmyadmin`

**2. Halaman Login:**
Anda harusnya melihat logo **phpMyAdmin** dan kolom login.

  * **Username:** `root`
  * **Password:** (Password MySQL yang Anda buat di Segmen 1).

**3. Dashboard:**
Jika berhasil login, Anda akan melihat tampilan grafis database.
Coba klik tab **Databases**. Anda akan melihat gudang data yang tadinya cuma tulisan teks, sekarang jadi tabel yang cantik.

-----

**🏁 PENUTUP RESMI BAB 3 - PART 9:**
Gudang Data (MySQL) dan Manajernya (PhpMyAdmin) sudah siap kerja.
Server Anda sekarang sudah punya tumpukan lengkap: **LAMP Stack** (Linux, Apache, MySQL, PHP).

**Apa Selanjutnya?**
Ruko kita (`teungku.edu`) sudah penuh fasilitas. Tapi... bagaimana kalau kita mau buka cabang ruko lain? Misal `blog.teungku.edu` atau `toko.teungku.edu` di server yang sama?

Di **(Part 12) Hosting Banyak Web (Virtual Host)**, kita akan belajar trik sulap membagi satu server menjadi banyak website.