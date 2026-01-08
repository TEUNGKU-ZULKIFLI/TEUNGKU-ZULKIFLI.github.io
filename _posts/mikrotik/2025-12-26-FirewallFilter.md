---
title: "Tembok Pertahanan (Firewall Filter - Input Chain)"
date: "2025-12-26"
category: "Course"
tags: ["mikrotik-series"]
---

# 📂 DOKUMENTASI LAB MIKROTIK: MISI 3

## A. TUJUAN MISI
Mengamankan Router dari akses yang tidak diinginkan oleh Client. Menerapkan aturan "Siapa yang boleh mengetuk pintu Router".

---

## B. KONSEP DASAR (TEORI DAGING) 🥩

### 1. Firewall Chains (3 Pintu Gerbang)
Ibarat rumah, Mikrotik punya 3 jenis lalu lintas:

* **INPUT (Pintu Masuk):** Trafik dari luar menuju **KE DALAM** Router itu sendiri.
* *Target:* IP Router (`192.168.50.1`).
* *Contoh:* Client nge-Ping Router, Client buka Web Router, Client Login Winbox.

* **FORWARD (Jalan Depan Rumah):** Trafik yang hanya **NUMPANG LEWAT**.
* *Target:* Internet / Komputer Lain.
* *Contoh:* Client browsing Google (Google ada di luar, bukan di dalam Router).

* **OUTPUT (Pintu Keluar):** Trafik dari Router mau keluar.

### 2. Action: Drop vs Reject
* **Drop:** Paket dibuang diam-diam. Pengirim akan menunggu sampai *Request Timed Out* (RTO). (Lebih aman, bikin bingung hacker).
* **Reject:** Paket ditolak dan dikasih tahu "Dilarang Masuk!". (Lebih sopan, tapi memberi info ke lawan).

---

## C. LANGKAH PENGERJAAN

### 1. Skenario & Target
* **Suspect:** `192.168.50.50` (Teungku-PC).
* **Tujuan:**
1. Memblokir Ping (ICMP) ke Router.
2. Memblokir Akses Web Router (HTTP - TCP Port 80).

* **Syarat:** Internet Client harus tetap jalan.

### 2. Implementasi (CLI Command)
**A. Blokir PING (ICMP)**
```bash
/ip firewall filter add chain=input src-address=192.168.50.50 protocol=icmp action=drop comment="Dilarang Ping Router"
```

**B. Blokir WEB ROUTER (TCP Port 80)**
*Note: Wajib pakai `dst-port=80` agar Winbox (Port 8291) tidak ikut terblokir.*
```bash
/ip firewall filter add chain=input src-address=192.168.50.50 protocol=tcp dst-port=80 action=drop comment="Dilarang Buka Web Router"
```

### 3. Hasil Pengujian (Verification)
* **Ping ke 192.168.50.1:** `Request Timed Out` (Sukses Terblokir).
* **Buka Browser ke 192.168.50.1:** Loading terus / *Site can't be reached* (Sukses Terblokir).
* **Ping ke 8.8.8.8 (Internet):** `Reply` (Sukses, Internet Aman).

---

## D. KESIMPULAN
Rule pada Chain **INPUT** berhasil melindungi Router. Kita membedakan antara trafik yang tujuannya "Kepada Router" (Input) dan trafik yang "Melewati Router" (Forward). Keamanan Router kini meningkat.

---
