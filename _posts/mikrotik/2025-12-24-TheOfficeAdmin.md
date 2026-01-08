---
title: "Otomatisasi & Manajemen Dasar (The Office Admin)"
date: "2025-12-24"
category: "Course"
tags: ["mikrotik-series"]
---

# 📂 DOKUMENTASI LAB MIKROTIK: MISI 1

## A. TUJUAN MISI
Mengubah sistem jaringan manual menjadi otomatis. Client (Windows 7) tidak perlu lagi setting IP satu per satu. Router bertindak sebagai pengelola pusat yang membagikan akses internet, memberi alamat IP, dan mencatat siapa saja yang terhubung.

---

## B. KONSEP DASAR (KAMUS PEMULA) 🧠

### 1. DHCP Server (Sang Resepsionis)
* **Teknis:** *Dynamic Host Configuration Protocol*.
* **Bahasa Manusia:** Bayangkan resepsionis hotel. Saat tamu (Client) datang, resepsionis otomatis memberikan nomor kamar (IP Address) dan kunci akses. Tamu tidak perlu milih kamar sendiri (bisa bentrok).
* **Lease Time:** Durasi "sewa" kamar. Jika waktu habis, IP bisa ditarik kembali atau diperpanjang.

### 2. Static Lease (Tamu VVIP)
* **Teknis:** *Reservation based on MAC Address*.
* **Bahasa Manusia:** Meskipun pembagian kamarnya otomatis, kita mem-booking nomor khusus (misal: IP `192.168.50.50`) khusus untuk Bos (Komputer Teungku-PC). Kapanpun Bos datang, kamarnya pasti itu, tidak akan diberikan ke orang lain.

### 3. NAT Masquerade (Topeng Pesta)
* **Teknis:** *Network Address Translation*.
* **Bahasa Manusia:** Satpam di gerbang. Orang luar (Internet) tidak boleh tahu siapa yang ada di dalam rumah (IP Lokal `192.168.x.x`). Jadi, setiap kali orang dalam mau keluar internetan, Satpam memakaikan "Topeng" (IP Publik Router). Internet hanya tahu yang minta data adalah Satpam (Router), bukan orang dalam.

### 4. ARP (Buku Tamu)
* **Teknis:** *Address Resolution Protocol*.
* **Bahasa Manusia:** Daftar yang mencocokkan Wajah Asli (MAC Address Hardware) dengan Nama Panggilan (IP Address). Tanpa buku ini, paket data nyasar karena Router bingung IP sekian milik HP/Laptop yang mana.

### 5. Backup vs Export
* **Backup (`.backup`):** Seperti *Save Game* di PS/Game. Menyimpan segalanya (termasuk password). Hanya bisa di-load di router yang sama.
* **Export (`.rsc`):** Seperti *Cheat Sheet* atau contekan skrip. Isinya teks yang bisa dibaca manusia. Berguna untuk dipelajari atau dicopy ke router berbeda tipe.

---

## C. LANGKAH PENGERJAAN (SUMMARY)

### 1. Setup Interface
* `ether1` dinamakan **LAN-HostOnly** (Arah ke Client Lokal).
* `ether2` dinamakan **WAN-DefaultSwitch** (Arah ke Internet).

### 2. Koneksi Internet (WAN)
* Mengaktifkan **DHCP Client** di `ether2` agar Router dapat internet dari ISP/Hyper-V.
* Mengaktifkan **DNS** (`allow-remote-requests=yes`) agar Router jadi server DNS lokal.
* Mengaktifkan **NAT Masquerade** di `ether2` agar Client bisa "nebeng" internetnya Router.

### 3. Distribusi IP (LAN)
* Membuat **IP Address** Gateway: `192.168.50.1/24`.
* Setting **DHCP Server** via Wizard:
* **Pool (Kolam IP):** `192.168.50.10` s/d `192.168.50.50` (Hanya 40 perangkat).
* **Lease Time:** 8 Jam (Jam kerja kantor).

### 4. Penguncian Client (Static Lease)
* Target: `Teungku-PC`.
* Action: Diubah dari *Dynamic* menjadi *Static*.
* Hasil: Terkunci permanen di IP `192.168.50.50`.

---

## D. HASIL PENGUJIAN & ARTIFAK

**1. Status Client (Windows 7 VM):**
* Mode Network: **Obtain Automatically**.
* Hasil: Mendapat IP `192.168.50.50`, Gateway `192.168.50.1`.
* Koneksi: Sukses ping ke `8.8.8.8` dan browsing.

**2. File Backup (Disimpan di Drive E:\Mikrotik BackUp):**
* `Complete-DHCP.backup` (File Binary - 15KB)
* `Settings-TheOfficeAdmin.rsc` (File Script - 1KB)

---
