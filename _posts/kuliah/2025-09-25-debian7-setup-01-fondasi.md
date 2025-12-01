---
title: "(Part 2): Konfigurasi Dasar Server"
date: "2025-09-25"
category: "Kuliah"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/ggZwSLdpRyQ?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper-V (Part 2): Konfigurasi Dasar Server
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

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 2) Konfigurasi Dasar: Mengamankan & Menstabilkan Server

### 🏷️ TAGLINE

*"Memberi Alamat Tetap dan Mengunci Pintu Rumah"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Di Part 1, kita sudah membangun "Rumah Kosong" (Server). Tapi rumah ini masih berantakan:

1.  **Nomor Rumahnya Berubah-ubah (DHCP):** Hari ini nomor 10, besok bisa nomor 99. Tukang pos (Client) bakal bingung. Kita harus paku **Nomor Tetap (Static IP)**.
2.  **Kunci Pintu Utama (Root) Terlalu Bebas:** Siapapun yang tahu password bisa langsung masuk ke kamar utama. Kita harus buat aturan: "Cuma anggota keluarga (Group Admin) yang boleh pegang kunci ini."

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Menetapkan IP Address Statis (`192.168.10.1`).
2.  Membatasi akses perintah `su` (Switch User) hanya untuk kaum elit.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Siapkan kopi, karena kita akan mengedit file konfigurasi jaringan.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Menetapkan "Nomor Rumah" (IP Statis)

Secara default, server kita minta IP ke router (DHCP). Kita ubah jadi permanen.

**1. Backup Dulu (Hukum Wajib Admin):**
Sebelum mengacak-acak konfigurasi, simpan yang asli.

```bash
cp /etc/network/interfaces /etc/network/interfaces.backup
```

**2. Edit File Jaringan:**

```bash
nano /etc/network/interfaces
```

**3. Ubah Konfigurasi:**
Cari baris `iface eth0 inet dhcp`.
**Ubah** menjadi seperti di bawah ini (sesuaikan dengan IP target Anda):

```bash
# The primary network interface
allow-hotplug eth0
# iface eth0 inet dhcp  <-- Matikan DHCP (kasih pagar)

# Konfigurasi STATIC (Tambahkan ini)
iface eth0 inet static
        address 192.168.10.1
        netmask 255.255.255.0
        gateway 192.168.10.254  # (Opsional, sesuaikan router Anda)
```

Simpan (`Ctrl+O`, `Enter`) dan keluar (`Ctrl+X`).

**4. Terapkan Perubahan:**
Restart layanan networking.

```bash
/etc/init.d/networking restart
```

*(Atau `ifdown eth0 && ifup eth0`)*.

-----

#### TAHAP B: Mengamankan "Kunci Master" (Restrict Root)

Kita batasi agar hanya user yang masuk grup `adm` yang boleh pakai perintah `su` untuk jadi root.

**1. Masukkan User Anda ke Klub Elit:**
Misal user Anda `teungku`.

```bash
usermod -G adm teungku
```

**2. Edit Aturan PAM (Pluggable Authentication Modules):**
Ini adalah "satpam" yang menjaga pintu `su`.

```bash
nano /etc/pam.d/su
```

**3. Aktifkan Aturan "Wheel/Admin":**
Cari baris ini (biasanya di bagian atas/tengah):

```bash
# auth       required   pam_wheel.so
```

**Hilangkan tanda `#`** di depannya agar aktif.
Atau, jika barisnya aneh/berbeda (kasus Debian 7), **tambahkan manual** baris ini:

```bash
auth       required   pam_wheel.so group=adm
```

Simpan dan keluar.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

**Tes Keamanan Root:**

1.  Buat user tumbal: `adduser penyusup`
2.  Login sebagai penyusup: `su - penyusup`
3.  Coba jadi root: `su`
4.  Masukkan password root yang benar.
5.  **Hasil:** `Permission denied`. (Sukses\! Penyusup ditolak meskipun tahu password).

**Tes IP Address:**

1.  Ketik: `ifconfig`
2.  Lihat `eth0`.
3.  **Hasil:** `inet addr: 192.168.10.1`. (Sukses\! Nomor rumah sudah permanen).

-----

*(Lanjut ke Segmen 2: Memperbaiki Jantung Sistem...)*

Siap\! Kita lanjut menyelamatkan "Jantung Server" kita.

Segmen 1 sudah mengamankan pintu dan memberi alamat rumah. Sekarang masalahnya: **Kulkasnya kosong dan Toko Kelontong langganan sudah tutup permanen.**

Kita harus mengarahkan server ini ke "Gudang Arsip" agar bisa download aplikasi lagi.

-----

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 2) Konfigurasi Dasar: Segmen 2

**(Repository & Update System)**

### 🏷️ TAGLINE

*"Menghidupkan Kembali Jalur Nadi yang Terputus"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan Anda punya HP jadul (Debian 7) dan ingin download aplikasi di Play Store. Tapi saat dibuka, muncul pesan: *"Store Closed / Connection Failed"*.

Kenapa? Karena server Debian 7 sudah **End of Life (Mati Suri)** sejak 2018. Server pusat (Repo Utama) sudah ditutup dan dipindahkan ke **Museum Digital (Archive)**.

Secara default, server Anda masih mencoba menghubungi toko yang sudah tutup itu. Tugas kita sekarang adalah memberitahu server: *"Hei, jangan ke toko lama\! Pergilah ke Museum Arsip untuk ambil barang."*

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Mengganti alamat repository ke `archive.debian.org`.
2.  Melakukan **Update** (Ambil katalog barang baru).
3.  Melakukan **Upgrade** (Perbarui semua komponen usang).

-----

### 🛠️ PERSIAPAN

  * Pastikan server terkoneksi internet (Coba `ping google.com` dulu).
  * Mental yang kuat menghadapi pesan *warning* (karena kita pakai barang antik).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Mengalihkan Jalur ke Arsip (Fix Sources.list)

Ini adalah langkah penyelamatan. Kita ubah peta belanja server.

**1. Backup File Lama (SOP Wajib):**

```bash
cp /etc/apt/sources.list /etc/apt/sources.list.backup
```

**2. Buka File Repository:**

```bash
nano /etc/apt/sources.list
```

**3. Operasi Jantung (Ganti Total):**
Hapus **SEMUA** tulisan di dalam file tersebut. Ganti dengan alamat "Museum" berikut ini:

```bash
# Repo Arsip Debian 7 (Wheezy)
deb http://archive.debian.org/debian/ wheezy main contrib non-free
deb-src http://archive.debian.org/debian/ wheezy main contrib non-free
```

> **Catatan:** `contrib` dan `non-free` ditambahkan jaga-jaga kalau kita butuh driver atau software tambahan nanti.

Simpan (`Ctrl+O`, `Enter`) dan keluar (`Ctrl+X`).

-----

#### TAHAP B: Update & Upgrade (Shopping Time)

Sekarang server sudah tahu jalan ke museum. Saatnya belanja.

**1. Ambil Katalog Baru (Update):**

```bash
apt-get update
```

*(Tunggu prosesnya. Anda akan melihat server mendownload file dari `archive.debian.org`)*.

> **⚠️ Awas Red Flag:** Anda mungkin melihat error `GPG error: ... Key is expired`.
> **JANGAN PANIK.** Itu wajar. Kunci keamanan digitalnya sudah kadaluarsa karena saking tuanya. Selama tidak ada error `404 Not Found`, berarti koneksi **BERHASIL**.

**2. Perbarui Seluruh Sistem (Upgrade):**
Sekarang kita update semua software usang di dalam server.

```bash
apt-get upgrade -y
```

*(Biarkan proses berjalan. Ini bisa memakan waktu tergantung kecepatan internet).*

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

Di tahap ini, banyak pemula frustrasi. Mereka mengetik `apt-get install sysv-rc-conf` tapi muncul error:

> *"E: Unable to locate package"*

**Analisis:**
Itu terjadi karena mereka melewati langkah **Tahap A**. Server masih mencari di toko yang tutup, jadi barangnya tidak ketemu.
Setelah kita arahkan ke `archive.debian.org`, barulah server berkata: *"Oh, barang itu ada di rak berdebu di pojok museum. Siap, saya ambilkan\!"*

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 2)

Bagaimana cara tahu "Jantung" server sudah berdetak normal? Coba instal satu aplikasi kecil yang sering dipakai admin.

**Tes Instalasi:**

```bash
apt-get install sysv-rc-conf -y
```

**Hasil:**

  * Jika muncul `Reading package lists... Done` dan proses instalasi berjalan lancar tanpa error `404`, maka **Segmen 2 SUKSES BESAR\!**
  * Server Anda sekarang hidup kembali dan siap menginstal apa saja (Apache, Samba, Postfix, dll).

-----

*(Kita lanjut ke\!  **Segmen 3: Kenyamanan Kerja & Tools** untuk menuntaskan Part 2...)*
Siap\! Ini adalah kepingan *puzzle* terakhir untuk Part 2. Kita akan mengubah lingkungan kerja yang "gersang" menjadi "nyaman" dan efisien.

Setelah Segmen ini, server Anda bukan lagi sekadar "kotak hitam", tapi "ruang kerja profesional".

-----

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 2) Konfigurasi Dasar: Segmen 3

**(Tools, Efficiency & Sudo)**

### 🏷️ TAGLINE

*"Upgrade Senjata dan Delegasi Kekuasaan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Vim vs Vi:** Editor bawaan (`vi`) itu ibarat **Notepad** biasa. Hitam putih, polos. Kita akan ganti dengan **Vim**, yang ibarat **MS Word/VS Code**. Dia punya warna (syntax highlighting), nomor baris, dan fitur canggih yang bikin mata tidak cepat lelah saat ngoding.
2.  **Sudo:** Di Segmen 1, kita sudah mengunci Root (Master Key). Sekarang, kita kasih "Kartu Akses Sementara" (**Sudo**) ke user Anda. Jadi, Anda bisa bekerja sebagai rakyat biasa, tapi saat butuh akses admin, tinggal "tempel kartu" sebentar tanpa harus ganti baju jadi Root.
3.  **Alias:** Ini nama panggilan. Daripada teriak *"Christopher Alexander"* (ngetik `ls -l --color=auto`), mending panggil *"Chris"* (ketik `ll`). Hemat jari, hemat waktu.

-----

### 🎯 MISI OPERASI (Segmen 3)

1.  Menginstal & Mempercantik Editor **Vim**.
2.  Menginstal **Sudo** dan mendaftarkan user Anda.
3.  Membuat **Alias** agar kerja lebih cepat dan aman.

-----

### 🛠️ PERSIAPAN

  * Masih login sebagai **root** (ini terakhir kalinya kita kerja full sebagai root\!).
  * Pastikan Segmen 2 sukses (agar bisa instal paket).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 3)

#### TAHAP A: Upgrade Senjata (Install & Config Vim)

Kita ganti editor teksnya dulu.

**1. Instal Vim:**

```bash
apt-get install vim -y
```

**2. Bikin Konfigurasi Cantik (`.vimrc`):**
Kita buat "resep" agar Vim tampil berwarna dan ada nomor barisnya.

```bash
nano ~/.vimrc
```

*(Atau `vi ~/.vimrc`)*.

**3. Masukkan Resep Daging Ini:**
Copy-paste konfigurasi di bawah ini. Ini settingan *best practice* admin server:

```vim
set nocompatible      " Gunakan fitur Vim modern
syntax on             " Aktifkan warna kode (PENTING!)
set number            " Tampilkan nomor baris
set hlsearch          " Highlight hasil pencarian
set ignorecase        " Pencarian tidak peduli huruf besar/kecil
set showmatch         " Tunjukkan pasangan kurung () [] {}
set history=100       " Simpan 100 history perintah
set backspace=indent,eol,start  " Agar tombol backspace berfungsi normal
```

Simpan (`Ctrl+O`, `Enter`) dan keluar.

**4. Paksa Sistem Pakai Vim:**
Biar kalau kita ketik `vi`, yang keluar tetap `vim`.

```bash
nano /etc/profile
```

Tambahkan baris ini di paling bawah:

```bash
alias vi='vim'
```

-----

#### TAHAP B: Delegasi Kekuasaan (Setup Sudo)

Memberi hak admin ke user biasa.

**1. Instal Sudo:**

```bash
apt-get install sudo -y
```

**2. Edit Izin (Pakai `visudo`):**
**JANGAN** edit manual pakai nano/vim. Gunakan perintah sakti ini:

```bash
visudo
```

*(Kenapa? Lihat di Pojok Benang Merah nanti\!)*

**3. Daftarkan User Anda:**
Cari baris `root    ALL=(ALL:ALL) ALL`.
Tambahkan user Anda (misal `teungku`) di bawahnya:

```bash
teungku    ALL=(ALL:ALL) ALL
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

-----

#### TAHAP C: Jalan Pintas (Alias)

Biar kerja cepat dan aman dari hapus file sembarangan.

**1. Edit Profil Global:**
Kita taruh di `/etc/profile` agar berlaku untuk semua user.

```bash
nano /etc/profile
```

**2. Tambahkan di Bagian Paling Bawah:**

```bash
# Alias Keren
alias ll='ls -l --color=auto'   # List detail berwarna
alias l='ls -la --color=auto'   # List detail + file hidden
alias rm='rm -i'                # Mode Aman: Tanya dulu sebelum hapus!
alias cp='cp -i'                # Tanya dulu kalau mau nimpa file
alias mv='mv -i'                # Tanya dulu kalau mau mindahin/nimpa
```

Simpan dan keluar.

**3. Terapkan Sekarang:**
Agar tidak perlu logout-login.

```bash
source /etc/profile
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus Fatal:** Mengedit file `/etc/sudoers` pakai `nano` biasa.
**Kejadian:** Admin lupa ngetik satu spasi atau salah koma, lalu save.
**Akibat:** **Sudo Error\!** Sistem terkunci. Tidak ada yang bisa jadi admin. Server harus di-boot lewat Rescue Mode (Ribet\!).

**Solusi:** Selalu gunakan perintah `visudo`.
Alat ini punya fitur *Syntax Check*. Kalau Anda salah ketik konfigurasi, `visudo` akan teriak dan **menolak menyimpan file**. Ini adalah jaring pengaman nyawa admin.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 3)

Mari kita buktikan transformasi server ini.

**1. Tes Editor Cantik:**
Ketik: `vi /etc/network/interfaces`

  * **Hasil:** Teks harus berwarna-warni (misal `iface` warna kuning/biru), dan di kiri ada nomor baris `1, 2, 3...`. Mata jadi adem\!

**2. Tes Alias & Safety:**
Ketik: `ll`

  * **Hasil:** Muncul daftar file panjang.
    Buat file tes: `touch tes.txt`
    Hapus file: `rm tes.txt`
  * **Hasil:** Sistem bertanya `rm: remove regular empty file 'tes.txt'?`. (Safety aktif\!).

**3. Tes Sudo (Final Boss):**
Logout dulu: `exit`
Login pakai user biasa: `teungku`
Coba jadi admin: `sudo -i` atau `sudo ls /root`

  * **Hasil:** Diminta password user teungku, dan **BERHASIL** masuk/akses root.

-----

**🏁 PENUTUP PART 2:**
Selamat\! Anda baru saja menyelesaikan konfigurasi dasar server yang sangat solid.

1.  Rumah sudah punya alamat tetap (IP Static).
2.  Pintu sudah dikunci (Secure Root).
3.  Jantung sudah berdetak (Repo Archive).
4.  Alat kerja sudah canggih (Vim, Sudo, Alias).

Server Anda sekarang **SIAP TEMPUR** untuk Part 3 (DNS & DHCP). \! 🚀