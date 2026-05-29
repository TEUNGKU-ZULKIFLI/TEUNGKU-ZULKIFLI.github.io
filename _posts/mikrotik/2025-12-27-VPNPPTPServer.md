---
title: "Terowongan Rahasia (VPN PPTP Server)"
date: "2025-12-27"
tags: [mikrotik-series, HyperV, MikroTikOS, Winbox]
excerpt: "Konsep Dasar VPN, PPTP, dan IP Public & Tunnel"
youtube_id: "https://youtu.be/6ZpoeFc4di8"
---

<!-- MikroTik di Hyper-V (#7): Setup VPN Server (PPTP) & Client Connection -->
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0; border-radius: 8px; box-shadow: var(--shadow-md);">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="https://www.youtube.com/embed/6ZpoeFc4di8?" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

# 📂 DOKUMENTASI LAB MIKROTIK: MISI 4

## A. TUJUAN MISI
Membuat jalur koneksi privat (Tunnel) yang memungkinkan Client mengakses Router secara aman, menembus batasan firewall, dan seolah-olah berada di jaringan lokal router meskipun diakses dari jauh.

---

## B. KONSEP DASAR (TEORI DAGING) 🥩

### 1. VPN (Virtual Private Network)
Bayangkan sebuah pipa selang air yang kita taruh di dasar laut. Air di dalam selang (Data VPN) tidak akan bercampur dengan air laut (Internet Publik).
* **Tunneling:** Teknik membungkus paket data di dalam paket lain.

### 2. PPTP (Point-to-Point Tunneling Protocol)
Protokol VPN "Klasik" buatan Microsoft.
* **Kelebihan:** Ringan, mudah, support bawaan di hampir semua OS (Windows 7/10/11, Android lama). Tidak butuh aplikasi tambahan.
* **Port:** Menggunakan TCP Port **1723**.

### 3. Logika IP Public vs IP Tunnel
* **Destination Address:** Alamat fisik Router (Pintu Masuk). Di Lab ini: `192.168.50.1`.
* **Local/Remote Address:** Alamat virtual setelah masuk terowongan.
* *Local:* IP Router di dalam terowongan (`10.10.10.1`).
* *Remote:* IP yang dipinjamkan ke Client (`10.10.10.2`).

---

## C. LANGKAH PENGERJAAN

### 1. Skenario
Client (Windows 7) ingin mengakses Router. Namun, IP Client (`192.168.50.50`) diblokir oleh Firewall (Misi 3). Solusinya: Masuk lewat jalur belakang (VPN).

### 2. Konfigurasi Mikrotik (Server)
**Langkah 1: Aktifkan Server**
```bash
/interface pptp-server server set enabled=yes
```
*Mengaktifkan fitur penerima tamu.*

**Langkah 2: Buat Akun (Secrets)**
```bash
/ppp secret add name="teungku-edu" password="12345" service=pptp local-address=10.10.10.1 remote-address=10.10.10.2
```
*Menentukan Username, Password, dan IP Address yang akan diberikan.*

**Langkah 3: Izin Firewall (Chain Input)**
```bash
/ip firewall filter add chain=input protocol=tcp dst-port=1723 action=accept comment="Izin Masuk VPN PPTP" place-before=0
```
*Satpam (Firewall) diperintah untuk mengizinkan paket Port 1723 (PPTP) masuk. Rule ditaruh paling atas (index 0) agar prioritas.*

### 3. Konfigurasi Client (Windows 7)
* **Setup:** `Control Panel ` **`>`** `Network and Sharing` **`>`** `Setup New Connection` **`>`** `Connect to Workplace` **`>`** `Use my Internet Connection (VPN)`.
* **Target IP:** `192.168.50.1` (IP Fisik Router).
* **Credential:** User `teungku-edu`, Pass `12345`.

### 4. Hasil Pengujian (Verification)
* **Status:** Connected.
* **IP Check (`ipconfig`):** Muncul adapter baru (PPP) dengan IP `10.10.10.2`.
* **Konektivitas:**
* Ping ke `192.168.50.1` -> **RTO** (Masih terblokir Firewall Misi 3, ini normal & bagus).
* Ping ke `10.10.10.1` -> **Reply** (Sukses tembus lewat jalur VPN).

* **Cek Sisi Router:** `/ppp active print` menunjukkan user `teungku-edu` sedang online.

---

## D. KESIMPULAN
Misi 4 sukses. Kita berhasil membangun infrastruktur VPN sederhana. Client kini memiliki "identitas ganda": IP Asli (yang diblokir) dan IP VPN (yang punya akses VIP). Teknik ini adalah dasar dari *Remote Working* (Waring From Home).

---
