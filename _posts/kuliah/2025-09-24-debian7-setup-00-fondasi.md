---
title: "Konfigurasi Awal Debian 7 - Tahapan 00: Fondasi Server"
date: "2025-09-24"
category: "Kuliah"
tags: ["debian-server-series", "debian-7", "wheezy", "linux"]
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

### **Panduan Lengkap - Debian di Hyper-V (Part 1): Instalasi Server dari Awal**

#### **Persiapan Bahan**

##### **Unduh iso Debian Wheezy**
###### [Debian Wheezy](https://www.debian.org/releases/wheezy/)

#### **Setup Virtual Mechine pada Platform Virtualisasi**
##### **New Virtual Mechine**
- **Specify Name and Location**</br>
Penamaan Mechine bisa apa saja dan disini `Debian VM`
- **Specify Generation**</br>
Untuk Generasi disini `Generation 1`
- **Assign Memory**</br>
Untuk Memory saya set disini `1024` atau `1 Ram`
- **Configure Networking**</br>
Untuk Adapter Jaringan Saya Lewatkan saja dulu untuk nantinya kita setup
- **Connect Virtual Hard Disk**</br>
Dan untuk Hard Disk sendiri saya set `15 Gb`
- **Installation Options**</br>
Kemudian untuk Installasi Disini Later saja pas udah bisa `boot`

##### **Setup Mechine**
- **Kemudian setelah Mechine jadi `klik kanan` dan `Settings`**</br>
dengan pertama pastikan ISO debian sudah dimasukkan kebagian `CD` atau `DVD Drive`</br>
juga bagian `Network Adapter` bisa set jadi `NAT` atau `Bridge` yang penting nantinya bisa akses Internet.</br>
- **Setelah `Settings` jangan lupa untuk `Apply` dan `Save`**.

#### **Install OS Debian**
- **Pertama** akan disuguhkan dengan tampilan `GUI` yang menampilkan `Installer boot Menu`, dan kita pilih saja `Install`, jika mau yang `Graphical Install` juga boleh sih.
- **Kedua** Pilih bahasa saran saya `English` karena kalau `Indo` agak belum familiar `ex:` `Refresh` `=>` `Segarkan`.
- **Ketiga** Lokasi ini pilih `Other` dan `Asia` kemudian `Indonesia`.
- **Keempat** `Locale` atau `Format Tanggal` pilih saja `United States`.
- **Kelima** `Keyboard` pilih saja `America English`.
- **Keenam** `Hostname` biarkan Default saja `Debian`.
- **Ketujuh**`Domain Server` Kosongin saja atau mau isi juga gak apa-apa.
- **Kedelapan** `Password Root` ini adalah password saat masuk root saran saya samain ama `User` nantinya dan simple saja.
- **Kesembilan** `Full name user` dan ini adalah nama `User` isi saja nama sendiri dengan `satu-dua` kata saja.
- **Kesepuluh** `Username for account` biarkan default saja.
- **Kesebelas** `Password` nah ini isiin sama dengan pasword `root` yang tadi saja.
- **Kedua belas** `Password` yang ini cuma isiin lagi untuk `Konfirmasi` saja.
- **Ketiga belas** `Time Zone` pilih saja sesuai daerah (`Wib`, `Wita` `Wit`).
- **Keempat belas** `Partision Disk` inimah antara 2 `Guided - use entire disk` dan `Guided - use entire disk and set up LVM` untuk konfigurasi Virtual dengan KVM, kedepannya pilih `LVM`.
- **Kelima belas** `Partitions Scheme` pilih yang recomended itu.
- **Keenam belas** `Finish Partitions` untuk mengakhiri setup Disk.
- **Ketujuh belas** `Write the changes to Disk?` pilih `Yes` karena itu mengizinkan menulis dipartisi yang kita setup sebelumnya itu.
- **Kedelapan belas** `Scan` pilih saja `No`.
- **Kesembilan belas** `Use a network Mirror` pilih saja `No`.
- **KeDua puluh** `Error Cannot Acces Repo` ini eror dan pilih saya `Continue`.
- **KeDua puluh satu** `Survey` pilih `No` saja itu katanya mau ikut partisipasi isi survey?.
- **KeDua puluh dua** `Choose software to Install` saran saya cuma satu aja `Standard System Untilities` aja.
- **KeDua puluh tiga** `Install Boot Loader` pilih `Yes` dan `Enter`.
- **KeDua puluh empat** `Finish Installer` pilih saja `Continue`.

#### **Testing Mechine**
##### **First View**
- **Setelah** Perjalanan tadi `Installasi OS` nah sekarang akan disuguhkan dengan Tampilan terminal dengan 
```bash
debian login:
Password:
```
- **Sekarang coba login dengan user yang setup pada installasi sebelumnya**.
- **Dan juga coba login dengan root yang tentunya setup pada installasi sebelumnya juga**.

#### **Dan See you bye bye**