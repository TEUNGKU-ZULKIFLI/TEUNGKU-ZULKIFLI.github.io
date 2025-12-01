---
title: "(Part 15): Install & Konfigurasi Proxy Squid3"
date: "2025-10-08"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/JBF8OZOBAqg?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 15): Install & Konfigurasi Proxy Squid3
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

Mari kita masuk ke **BAB 5**.

Server Anda sudah sangat pintar (bisa hosting, bisa email). Tapi... server yang pintar juga harus **aman**. Jangan sampai internet yang Anda bagikan ke klien (Windows 7) dipakai untuk hal-hal yang tidak produktif atau berbahaya.

Kita akan memasang **Gerbang Tol (Proxy)**.
Di Part 15 ini, kita fokus pada **Pondasi Proxy-nya dulu (Squid3)**. Kita akan membuatnya "Transparan", artinya klien tidak perlu setting apa-apa di browser, tapi otomatis kena filter.

-----

# 📖 BAB 5: KEAMANAN & KONTROL

*(Sang Penjaga Gerbang)*

## (Part 15) Gerbang Internet: Squid3 Transparent Proxy

**(Caching & Monitoring Gateway)**

### 🏷️ TAGLINE

*"Satpam Gaib yang Mengawasi Setiap Langkah Klien"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Proxy (Perantara):**
    Bayangkan Anda (Windows 7) mau beli barang di Toko (Internet).
    Tanpa Proxy, Anda jalan sendiri ke toko.
    Dengan Proxy (Squid), Anda nitip ke **Satpam**.

      * Anda: *"Pak, tolong belikan Google.com"*
      * Satpam: *"Oke, saya ambilkan."* -\> Pergi ke Google -\> Balik bawa data -\> Kasih ke Anda.
      * **Keuntungannya:** Satpam bisa mencatat apa yang Anda beli, dan kalau barangnya sudah ada di pos satpam (Cache), dia gak perlu jalan jauh lagi (Internet lebih cepat).

2.  **Transparent Proxy (Satpam Gaib):**
    Biasanya, Anda harus setting browser: *"Gunakan Proxy 192.168.10.1"*. Itu ribet.
    **Transparent Proxy** itu licik. Anda merasa jalan langsung ke toko, tapi di tengah jalan, Router (IPTables) membelokkan Anda paksa ke Pos Satpam tanpa Anda sadari.

<img src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQ5ztolMOI-9LSw3HJU2GPJNriv_QMikPENNmS-MTfxrHK2IGfdSRl4C5wZx3lCVrh4linG4XQn8FFB3EVOlJ31A_IaC06xM3QRUCl-drH6MgTNeIw" width="400">

-----

### 🎯 MISI OPERASI

1.  Menginstal **Squid3** (Mesin Proxy).
2.  Mengonfigurasi mode **Transparent** (Agar klien tidak perlu setting browser).
3.  Memasang jebakan **IPTables** (Membelokkan paksa traffic Web ke Proxy).
4.  Memonitor aktivitas klien secara *Live*.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan Windows 7 konek internet via Debian (hasil Part 6 & 7).

-----

### 💻 LANGKAH EKSEKUSI

#### TAHAP A: Merekrut Satpam (Instalasi Squid)

Kita pakai versi 3 yang stabil di Debian 7.

**1. Instal Paket:**

```bash
apt-get install squid3 -y
```

**2. Backup Konfigurasi (Wajib\!):**
File config Squid itu panjangnya ribuan baris. Kalau salah edit, pusing carinya.

```bash
cp /etc/squid3/squid.conf /etc/squid3/squid.conf.backup
```

-----

#### TAHAP B: Buku Panduan Satpam (`squid.conf`)

Kita harus mengedit file konfigurasi raksasa ini.

**1. Buka File Config:**

```bash
nano /etc/squid3/squid.conf
```

**2. Edit Port & Mode Transparan:**
Gunakan fitur pencarian Nano (`Ctrl+W`) untuk mencari kata kunci.

  * **Cari:** `http_port 3128`
  * **Ubah menjadi:**
    ```bash
    http_port 3128 transparent
    ```
    *(Kata "transparent" inilah kuncinya\!)*

**3. Edit Cache Manager (Opsional tapi Bagus):**

  * **Cari:** `cache_mgr`
  * **Ubah menjadi:** `cache_mgr admin@teungku.edu` (Biar kalau error, email kita yang muncul).

**4. Buka Izin Akses (ACL - Access Control List):**
Secara default, Squid menolak semua orang. Kita harus izinkan jaringan lokal (`192.168.10.0`).

  * **Cari:** `INSERT YOUR OWN RULE` (Tekan `Ctrl+W` lalu ketik `INSERT YOUR`).

  * Tepat **DI BAWAH** tulisan itu, tambahkan baris ini:

    ```bash
    # Izinkan Jaringan Lokal Teungku
    acl jaringan_lokal src 192.168.10.0/24
    http_access allow jaringan_lokal
    ```

**5. Simpan dan Keluar:**
`Ctrl+O`, `Enter`, `Ctrl+X`.

**6. Restart Squid (Agak Lama):**
Squid butuh waktu untuk membangun database cache.

```bash
service squid3 restart
```

-----

#### TAHAP C: Memasang Jebakan (IPTables Redirect)

Squid sudah jalan di Port 3128. Tapi Windows 7 berselancar lewat Port 80. Mereka tidak ketemu.
Kita harus paksa belokkan Port 80 ke 3128.

**1. Pasang Aturan Redirect:**

```bash
iptables -t nat -A PREROUTING -s 192.168.10.0/24 -p tcp --dport 80 -j REDIRECT --to-port 3128
```

*(Artinya: Hai NAT, kalau ada paket dari Jaringan Lokal mau ke Port 80 (Web), BELOKKAN ke Port 3128).*

**2. Simpan Permanen:**
Ingat, IPTables itu pelupa.

```bash
iptables-save > /etc/iptables/rules.v4
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, Squid sudah jalan, tapi internet di Windows 7 malah **MATI TOTAL** (Timeout)?"

**Penyebab:**

1.  **Lupa ACL (Tahap B-4):** Anda menyalakan proxy, tapi lupa memberi izin (`http_access allow`). Akibatnya Squid menolak koneksi.
2.  **Salah Ketik IPTables:** Salah port atau salah IP.

**Solusi:**
Cek status squid: `service squid3 status`.
Jika mati, cek config lagi. Jika hidup tapi internet mati, cek log di Tahap Verifikasi di bawah ini.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 15)

Ini adalah momen paling keren. Kita akan mengintip apa yang dilakukan Windows 7 secara *Live*.

**1. Buka Monitor Log (Di Terminal Debian):**
Kita gunakan perintah `tail -f` (buntut yang mengikuti).

```bash
tail -f /var/log/squid3/access.log
```

*(Terminal akan diam menunggu...)*

**2. Buka Browser (Di Windows 7):**

  * Buka `detik.com` atau `kompas.com`.
  * Buka beberapa website lain.

**3. LIHAT TERMINAL DEBIAN:**
Apakah teksnya berjalan cepat (scrolling)?
Anda akan melihat baris-baris seperti:
`16789... 192.168.10.100 ... GET http://detik.com ... TCP_MISS/200 ...`

  * **192.168.10.100:** Itu IP Windows 7.
  * **GET http://...:** Itu situs yang dia buka.

Jika log itu bergerak saat Anda browsing, **SELAMAT\!** 🕵️‍♂️
Anda telah berhasil memasang **Gerbang Pengawas (Proxy)**. Tidak ada satu pun website yang dibuka klien yang lolos dari pantauan Anda.

-----

**🏁 PENUTUP PART 15:**
Sekarang kita punya kuasa untuk *melihat*. Tapi kita belum punya kuasa untuk *melarang*.
Klien masih bisa buka situs apa saja (Judi, Porno, dll), dan kita cuma bisa menonton log-nya.

Kita butuh "Polisi Galak" yang berdiri di samping Satpam Squid. Polisi itu bernama **SquidGuard**.

Di **(Part 16) Polisi Konten (SquidGuard Anti-Judol)**, kita akan memasukkan daftar situs terlarang dan memblokirnya otomatis.