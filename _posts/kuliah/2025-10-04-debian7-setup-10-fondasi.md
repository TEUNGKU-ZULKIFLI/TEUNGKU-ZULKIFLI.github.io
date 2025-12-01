---
title: "(Part 11): Install dan Konfigurasi Samba Server"
date: "2025-10-04"
category: "Kuliah"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/JI25CTbgnis?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 11): Install dan Konfigurasi Samba Server
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

# 📖 BAB 2: JARINGAN & KONEKTIVITAS

## (Part 11) Berbagi File Lokal: Samba File Server

**(File Sharing & Network Folder)**

### 🏷️ TAGLINE

*"Membangun Jembatan Persahabatan Antara Linux dan Windows"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan Linux (Debian) dan Windows 7 itu dua orang dari planet berbeda.

  * **Linux** menyimpan file dengan aturan ketat (Permission 755, Owner Root, dll).
  * **Windows** menyimpan file dengan gayanya sendiri.

Jika Windows ingin mengambil file di perut Linux, mereka tidak akan paham bahasanya.
Di sinilah **SAMBA** berperan. Samba adalah **Penerjemah (Diplomat)**.
Dia membuat folder di Linux terlihat seolah-olah itu adalah folder biasa di Windows Explorer ("Network Place"). Jadi, user Windows bisa *drag-and-drop* file ke server Linux tanpa perlu tahu perintah rumit.

![Network Place](https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTXppyDO6VywO8TF08owCpsarvVUuXLrpmnqi4mok6o7wmtDwLlRs4J08xCaC4cdXNXtJnJVv7bnt2TSp0ulKiY6RDdGwupgVVZEKfRWs-WCYlcYW0)

-----

### 🎯 MISI OPERASI

1.  Menginstal paket **Samba**.
2.  Membuat folder khusus untuk pertukaran data (`/home/teungku/share`).
3.  Membuat **User Samba** (Ingat: Password Samba beda dengan Password Login\!).
4.  Mengakses folder tersebut dari Windows 7.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan Windows 7 dan Debian sudah satu jaringan (bisa saling ping).

-----

### 💻 LANGKAH EKSEKUSI

#### TAHAP A: Instalasi & Persiapan Lahan

**1. Panggil Sang Diplomat:**
Instal paketnya.

```bash
apt-get install samba -y
```

**2. Siapkan Gudang File:**
Kita buat folder yang akan dipinjamkan ke Windows.

```bash
mkdir /home/teungku/share
```

**3. Buka Kunci Gembok (Permission):**
Agar Windows bisa *menulis* (copy file) ke folder ini, kita harus melonggarkan izin Linux-nya. (Untuk lab, kita buka lebar 777).

```bash
chmod 777 /home/teungku/share
```

-----

#### TAHAP B: Konfigurasi Aturan Main (`smb.conf`)

Kita harus mendaftarkan folder tadi ke dalam konfigurasi Samba.

**1. Edit File Config:**

```bash
nano /etc/samba/smb.conf
```

**2. Tulis Aturan Baru:**
Gulir ke **HALAMAN PALING BAWAH** (Gunakan tombol `PageDown` biar cepat).
Tambahkan blok konfigurasi ini di baris paling akhir:

```ini
# === FOLDER BERSAMA ===
[DataKita]
   path = /home/teungku/share
   browseable = yes
   writeable = yes
   guest ok = no
   read only = no
   security = user
```

  * **[DataKita]:** Ini nama yang akan muncul di Windows nanti.
  * **writeable = yes:** Supaya bisa edit/hapus file.
  * **guest ok = no:** Supaya tidak sembarang orang masuk (wajib login).

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

-----

#### TAHAP C: Membuat Kunci Rahasia (Samba User)

Ini bagian yang sering bikin bingung pemula.

**1. Pahami Konsep:**
User `teungku` di Linux sudah punya password login. **TAPI**, Samba punya buku catatan password sendiri. User `teungku` tidak akan bisa login ke Samba sebelum didaftarkan ke buku Samba.

**2. Daftarkan User:**

```bash
smbpasswd -a teungku
```

**3. Masukkan Password:**
Masukkan password baru (boleh sama dengan login, boleh beda).

  * *New SMB password:* `1` (misal)
  * *Retype:* `1`
  * **Hasil:** `Added user teungku.`

**4. Restart Service:**
Terapkan semua perubahan.

```bash
/etc/init.d/samba restart
```

*(Catatan: Di beberapa versi Debian, servicenya bernama `smbd` atau `nmbd`, tapi `samba` biasanya mengcover keduanya).*

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya bisa login dan melihat foldernya. Tapi pas mau *Copy-Paste* file dari Windows ke folder itu, muncul error **'Access Denied'** atau **'You need permission'**."

**Analisis:**
Ini konflik birokrasi.

  * Di Samba (`smb.conf`) kita sudah bilang `writeable = yes` (Boleh nulis).
  * **TAPI**, di level Linux (`mkdir`), folder itu mungkin masih milik `root` dengan mode `755` (Hanya pemilik yang boleh nulis).

**Solusi:**
Itulah kenapa **Langkah A-3 (`chmod 777`)** sangat krusial. Pastikan folder asli di Linux sudah diizinkan untuk ditulis oleh siapa saja (atau setidaknya oleh user `teungku`).
Cek dengan: `ls -ld /home/teungku/share`. Pastikan ada `drwxrwxrwx`.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification)

Mari kita pindah ke **Windows 7**.

**1. Panggil Server:**

  * Tekan tombol `Windows + R` di keyboard (Menu Run).
  * Ketik alamat IP Debian dengan dua garis miring terbalik:
    `\\192.168.10.1`
  * Tekan Enter.

**2. Login:**

  * Akan muncul kotak login.
  * **User:** `teungku`
  * **Password:** (Password Samba yang Anda buat di Tahap C).
  * Centang *"Remember my credentials"* biar besok gak nanya lagi.

**3. The Magic:**

  * Anda akan melihat folder bernama **`DataKita`**.
  * Buka folder itu.
  * Coba **Klik Kanan -\> New -\> Text Document**.
  * Jika file berhasil dibuat, **SELAMAT\!** 🥳

Anda sekarang punya "Hard Disk Tambahan" di jaringan. Anda bisa menyimpan file tugas di server Debian dan membukanya lagi dari komputer lain.

-----

**🏁 PENUTUP PART 11:**
Misi Berbagi File Selesai\!
Sekarang Debian dan Windows sudah akrab.

Tapi... Samba itu protokol untuk jaringan lokal (LAN). Bagaimana kalau kita mau transfer file lewat internet yang lebih aman dan terenkripsi? Kita butuh **FTP (File Transfer Protocol)**.

Siap lanjut ke **(Part 8) Transfer File Aman (VSFTPD & SFTP)**? Ini kepingan terakhir untuk BAB 2\! 🚀