---
title: "(Part 6): Install dan Konfigurasi DHCP Server pada Windows 7"
date: "2025-09-29"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/OMVJFczcDBE?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 6): Install dan Konfigurasi DHCP Server pada Windows 7
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

## (Part 6) Mengatur Klien: Segmen 1

**(Instalasi & Konfigurasi DHCP Server)**

### 🏷️ TAGLINE

*"Mempekerjakan Resepsionis Pembagi Tiket Otomatis"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan server Anda adalah **Hotel Bintang 5**.

  * **Part 7 (Router):** Kita sudah membangun jalan raya menuju hotel.
  * **Part 6 (DHCP):** Tamu (Windows 7) berdatangan.
      * Kalau **TANPA DHCP (Manual):** Setiap tamu harus nulis formulir sendiri, nyari nomor kamar kosong sendiri. Ribet dan sering bentrok (IP Conflict).
      * **DENGAN DHCP:** Kita punya **Resepsionis**. Tamu datang, Resepsionis langsung bilang: *"Selamat datang\! Ini kunci kamar No. 101, ini peta hotel, dan ini password Wi-Fi."* Tamu tinggal terima beres.

Tugas kita sekarang: Melatih Resepsionis (DHCP Server) agar membagikan kunci yang benar.

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Menginstal paket `isc-dhcp-server`.
2.  Membuat aturan pembagian IP (Pool, Gateway, DNS).
3.  **CRITICAL:** Mengarahkan DHCP agar bekerja di jembatan `br0` (Bukan `eth0`).

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Pastikan `br0` sudah aktif (hasil Part 4) dengan IP `192.168.10.1`.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Memanggil Resepsionis (Instalasi)

**1. Instal Paket:**

```bash
apt-get install isc-dhcp-server -y
```

> **⚠️ Awas Jantung Copot:**
> Di akhir instalasi, Anda akan melihat pesan merah: `[FAIL] Starting ISC DHCP server: dhcpd check syslog... failed!`
> **JANGAN PANIK.** Itu normal 100%. Dia gagal karena kita belum kasih "Buku Panduan" (Config) dan belum kasih tau dia harus berdiri di pintu mana.

-----

#### TAHAP B: Menulis Buku Panduan (dhcpd.conf)

Kita harus kasih tau IP mana saja yang boleh disewa.

**1. Backup File Asli:**

```bash
cp /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf.backup
```

**2. Edit Konfigurasi:**

```bash
nano /etc/dhcp/dhcpd.conf
```

**3. Masukkan Aturan Hotel Kita:**
Hapus semua isinya (atau taruh di paling bawah), dan masukkan konfigurasi bersih ini:

```bash
# === KONFIGURASI DHCP HOTEL TEUNGKU ===

# Identitas Jaringan
option domain-name "teungku.edu";
option domain-name-servers 192.168.10.1, 8.8.8.8;

# Waktu Sewa (Detik)
default-lease-time 600;
max-lease-time 7200;

# Menjadikan Server ini sebagai Otoritas Utama
authoritative;

# Kolam IP (Subnet)
# Ingat: Network kita 192.168.10.0
subnet 192.168.10.0 netmask 255.255.255.0 {
    # Rentang IP yang disewakan (Kamar 100 s/d 200)
    range 192.168.10.100 192.168.10.200;
    
    # Pintu Keluar ke Internet (Gateway dari Part 7)
    option routers 192.168.10.1;
    
    # Alamat Broadcast
    option broadcast-address 192.168.10.255;
}
```

Simpan (`Ctrl+O`) dan keluar.

-----

#### TAHAP C: Menempatkan Posisi (Interface Fix)

Ini adalah langkah yang sering dilupakan (seperti di draft Anda). Karena kita pakai **Bridge (Part 4)**, kita harus ubah targetnya.

**1. Edit File Default:**

```bash
nano /etc/default/isc-dhcp-server
```

**2. Ubah Target Interface:**
Cari baris `INTERFACES=""`.
Ubah menjadi `br0` (Jembatan kita).

```bash
INTERFACES="br0"
```

*(Jangan isi `eth0`, karena `eth0` sekarang cuma kabel buntung tanpa IP\!)*.

Simpan dan keluar.

**3. Nyalakan Resepsionis:**

```bash
/etc/init.d/isc-dhcp-server start
```

  * **Hasil:** Sekarang harus muncul `[ ok ] Starting ISC DHCP server`.

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, config sudah benar, tapi pas start tetep `failed`\!"
**Diagnosis:** Cek log error dengan perintah `tail /var/log/syslog`.
**Penyebab Umum:** Ada **titik koma (;)** yang kurang di file `dhcpd.conf`. DHCP sangat rewel soal tanda baca.
**Solusi:** Periksa lagi file konfigurasinya pelan-pelan.

-----

*(Segmen 1 Selesai. Server sudah siap membagi IP. Sekarang saatnya kita pindah ke Windows 7 di Segmen 2...)*

-----

# 📖 BAB 2: JARINGAN & KONEKTIVITAS

## (Part 6) Mengatur Klien: Segmen 2

**(Windows 7 Setup & Verification)**

### 🏷️ TAGLINE

*"Saatnya Tamu Menikmati Fasilitas Hotel"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Server sudah siap. Sekarang kita nyalakan komputer tamu (Windows 7).
Tugas kita cuma satu: Pastikan kabel Windows 7 dicolok ke **Terminal Kuningan (`br0`/Host-Only)** yang sama dengan server. Kalau colokannya beda, ya sinyalnya nggak nyampe.

![DNS Forwarding](https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSEe1Fp1OwU5_jrYX356ZH3Q8t-VmuV4OAulHMdfrfepSarj8qzXpA9sPZ28VmxquwDm9n1IzMPmUL2jY_wY66TN7ZozCsMd_vv-4MpBEkkTKbV4Ds)
-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Menyamakan Adapter Virtual Windows 7 dengan Debian.
2.  Meminta IP Otomatis.
3.  Tes Browsing (Momen Kebenaran).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Penyesuaian Kabel Virtual

**Lakukan ini di VirtualBox/VMware/Hyper-V:**

1.  Matikan/Pause sebentar Windows 7 (jika nyala).
2.  Buka **Settings** -\> **Network**.
3.  Pastikan Adapter Network diset ke **Host-Only Adapter**.
      * *Penting:* Harus sama persis dengan Adapter 1 (`eth0/br0`) milik Debian.
4.  Nyalakan Windows 7.

-----

#### TAHAP B: Request IP (Di Windows 7)

1.  Masuk ke Windows 7.
2.  Buka **Control Panel** -\> **Network and Sharing Center**.
3.  Klik **Change adapter settings**.
4.  Klik kanan **Local Area Connection** -\> **Properties**.
5.  Pilih **Internet Protocol Version 4 (TCP/IPv4)** -\> **Properties**.
6.  Pilih:
      * 🔘 **Obtain an IP address automatically**
      * 🔘 **Obtain DNS server address automatically**
7.  Klik OK dan Close.

*(Tunggu sebentar sampai ikon loading di pojok kanan bawah berhenti).*

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 6)

Ini adalah momen pembuktian untuk Part 7 (Router) dan Part 6 (DHCP) sekaligus.

**1. Cek Tiket (IP Address):**
Buka CMD di Windows 7, ketik:

```cmd
ipconfig /all
```

  * **Hasil Sukses:**
      * IPv4 Address: `192.168.10.1xx` (Antara 100-200).
      * Default Gateway: `192.168.10.1` (IP Debian).
      * DNS Servers: `192.168.10.1` (IP Debian).
      * Connection-specific DNS Suffix: `teungku.edu`.

**2. Cek Koneksi Lokal:**

```cmd
ping 192.168.10.1
```

*(Harus Reply. Artinya Windows dan Debian sudah salaman).*

**3. Cek Koneksi Internet (Final Boss):**
Buka Browser (Internet Explorer/Chrome) di Windows 7.
Buka: `google.com` atau `youtube.com`.

  * **Hasil:** Jika website terbuka, **SELAMAT\!** 🎉
    Anda berhasil membangun Gateway Internet sendiri. Windows 7 berselancar menggunakan "tumpangan" dari Debian.

-----

**🏁 PENUTUP PART 6:**
Sekarang kita punya ekosistem jaringan yang hidup\!

  * Debian sebagai Bos (Router, DNS, DHCP).
  * Windows 7 sebagai Karyawan (Klien).

Selanjutnya, kita akan membuat mereka bisa **saling kirim file** layaknya komputer kantor.