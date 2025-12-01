---
title: "(Part 8): Tranfer File Aman Antara VSFTPD dengan SFTP"
date: "2025-10-01"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/WahLoPUczfA?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 8): Tranfer File Aman Antara VSFTPD dengan SFTP
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

Ini adalah **kepingan terakhir** dari puzzle **BAB 2**.

Kita sudah punya Router, DHCP, dan Samba. Samba itu enak untuk *lokal* (LAN), tapi kalau kita bicara soal upload file website atau transfer lewat internet yang lebih luas, protokol standarnya adalah **FTP**.

Dan karena kita peduli keamanan, kita tidak hanya belajar FTP biasa (yang tidak aman), tapi juga SFTP (yang terenkripsi).

-----

# 📖 BAB 2: JARINGAN & KONEKTIVITAS

## (Part 8) Transfer File Aman: VSFTPD & SFTP

**(File Transfer Protocol & Secure Shell Transfer)**

### 🏷️ TAGLINE

*"Mengirim Paket Rahasia Menggunakan Truk Baja"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Di Part 11, kita pakai **Samba**. Itu ibarat Anda memindahkan barang dari ruang tamu ke dapur. Pintunya terbuka, mudah, tinggal *drag-and-drop*. Cocok untuk santai di rumah (LAN).

Tapi, bagaimana kalau Anda mau mengirim barang berharga ke luar kota (Internet)? Anda butuh jasa ekspedisi.

1.  **FTP (VSFTPD):** Ini seperti **Jasa Kurir Biasa**. Cepat, efisien, tapi kalau kurirnya dicegat di jalan, isi paketnya bisa diintip orang (tidak terenkripsi).
2.  **SFTP (Secure FTP):** Ini seperti **Truk Baja Anti-Peluru**. Paketnya dikunci rapat. Bahkan jika truknya dibajak, isinya tidak bisa dibuka karena Anda yang pegang kuncinya. SFTP menumpang jalur aman SSH yang sudah kita buat di Part 3.

-----

### 🎯 MISI OPERASI

1.  Menginstal **VSFTPD** (Very Secure FTP Daemon) untuk layanan FTP standar.
2.  Mengunci User agar tidak bisa "jalan-jalan" ke folder sistem (Chroot Jail).
3.  Menggunakan **SFTP** melalui port rahasia kita (2280).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Di Windows 7, siapkan aplikasi klien seperti **WinSCP** atau **FileZilla** (Wajib punya ini untuk admin server\!).

-----

### 💻 LANGKAH EKSEKUSI

#### TAHAP A: Membangun Pos Ekspedisi (Instalasi VSFTPD)

**1. Instal Paket:**

```bash
apt-get install vsftpd -y
```

**2. Backup Konfigurasi:**
Selalu cadangkan sebelum mengedit.

```bash
cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
```

-----

#### TAHAP B: Menulis Aturan Keamanan (`vsftpd.conf`)

Secara default, VSFTPD itu "pelit" (hanya boleh download, tidak boleh upload). Kita harus ubah.

**1. Edit File Config:**

```bash
nano /etc/vsftpd.conf
```

**2. Modifikasi Baris Penting:**
Cari baris-baris di bawah ini. Hilangkan tanda `#` (uncomment) dan sesuaikan nilainya:

  * **Izinkan Tulis (Upload):**
    Cari `#write_enable=YES`.
    Ubah jadi:

    ```bash
    write_enable=YES
    ```

  * **Penjara Lokal (Chroot Jail) - PENTING\!:**
    Ini fitur keamanan agar user yang login FTP **terkurung** di folder home-nya sendiri (`/home/teungku`) dan tidak bisa mengintip folder `/etc` atau `/root`.
    Cari `#chroot_local_user=YES`.
    Ubah jadi:

    ```bash
    chroot_local_user=YES
    ```

**3. Simpan dan Keluar:**
`Ctrl+O`, `Enter`, `Ctrl+X`.

**4. Restart Service:**

```bash
/etc/init.d/vsftpd restart
```

-----

#### TAHAP C: Cara Menggunakan SFTP (Jalur Truk Baja)

Untuk SFTP, **Anda TIDAK PERLU menginstal apa-apa lagi\!**
Kenapa? Karena SFTP adalah fitur bawaan dari **SSH**.

Ingat Part 3? Kita sudah punya SSH di port **2280**.
Berarti otomatis kita juga sudah punya SFTP di port **2280**.

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya login FTP sukses. Tapi pas login, muncul error: **'500 OOPS: vsftpd: refusing to run with writable root inside chroot()'**."

**Analisis:**
Ini adalah fitur keamanan VSFTPD versi modern. Dia marah kalau folder penjara user (`/home/teungku`) memiliki izin tulis (writable) penuh, karena itu dianggap celah keamanan.

**Solusi Cepat (The Hack):**
Cabut izin tulis pada folder root user, lalu buat folder baru di dalamnya untuk upload.

```bash
# Cabut izin tulis folder utama
chmod a-w /home/teungku

# Buat folder khusus upload di dalamnya
mkdir /home/teungku/upload
chmod 777 /home/teungku/upload
```

Sekarang kalau mau upload, masukkan ke folder `upload` tersebut.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 8)

Kita tes menggunakan **WinSCP** di Windows 7 (atau FileZilla).

**SKENARIO 1: Tes FTP Biasa (VSFTPD)**

  * **File Protocol:** FTP
  * **Host name:** `192.168.10.1`
  * **Port:** 21 (Default)
  * **User/Pass:** `teungku` / (password user)
  * **Hasil:**
      * Login Berhasil.
      * Coba naik satu folder (Parent Directory). Jika gagal/mentok, berarti **Chroot Jail BERHASIL**.

**SKENARIO 2: Tes SFTP (Jalur Aman)**

  * **File Protocol:** SFTP
  * **Host name:** `192.168.10.1`
  * **Port:** **2280** (Ingat port custom kita di Part 3\!)
  * **User/Pass:** `teungku` / (password user)
  * **Hasil:**
      * Login Berhasil.
      * Ikon gembok terkunci (Encrypted).
      * Anda bisa melihat seluruh isi server (karena SFTP via SSH biasanya tidak di-Chroot secara default, kecuali disetting khusus).

-----

**🏁 PENUTUP RESMI BAB 2:**

**MISSION ACCOMPLISHED\!** 🎊
Kita telah menyelesaikan **BAB 2: JARINGAN & KONEKTIVITAS**.

Mari kita rekap apa yang sudah bisa dilakukan Server Anda:

1.  **Router:** Membagi internet ke Windows 7.
2.  **DHCP:** Memberi alamat otomatis ke Windows 7.
3.  **Samba:** Bertukar file lokal via Network Folder.
4.  **FTP/SFTP:** Transfer file website/sistem dengan aman.

Server Anda sekarang sudah menjadi **Pusat Komando Jaringan**.

Selanjutnya, kita akan masuk ke **BAB 3: WEB HOSTING MASTER**.
Kita akan menginstal Apache, PHP, MySQL, dan membuat server ini bisa menampung website layaknya **Hostinger/Niagahoster**.