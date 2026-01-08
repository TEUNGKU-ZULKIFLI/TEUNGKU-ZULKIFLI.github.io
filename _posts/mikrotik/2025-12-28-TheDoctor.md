---
title: "Monitoring & Diagnosa (The Network Doctor)"
date: "2025-12-28"
category: "Course"
tags: ["mikrotik-series"]
---

# 📂 DOKUMENTASI LAB MIKROTIK: MISI 5

## A. TUJUAN MISI
Menguasai alat diagnosa untuk memantau lalu lintas jaringan secara *Real-time* (Torch), merekam sejarah penggunaan bandwidth/resource (Graphing), dan mencatat kejadian sistem (Logging).

---

## B. KONSEP DASAR (TEORI DAGING) 🥩

### 1. Torch (Stetoskop Jaringan)
Alat untuk melihat trafik yang sedang berjalan *detik ini juga*.
* **Fungsi:** Menangkap basah IP mana yang sedang download besar atau melakukan Ping.
* **Parameter:** Bisa filter berdasarkan Src IP, Dst IP, Protocol (TCP/UDP/ICMP), dan Port.

### 2. Graphing (Rekam Medis)
Alat untuk melihat sejarah. Jika Torch adalah "Video", Graphing adalah "Foto Album".
* **Resource:** Mencatat beban CPU, Memory, dan Disk usage.
* **Interface:** Mencatat trafik Download/Upload (bps) Harian, Mingguan, Bulanan.
* **Akses:** Hasilnya dilihat via Web Browser (`http://IP-Router/graphs`).

### 3. Logging (Buku Harian)
Catatan tekstual tentang apa saja yang terjadi di router.
* **Penting untuk:** Melacak kapan VPN putus, kapan user login gagal, atau error hardware.

---

## C. LANGKAH PENGERJAAN

### 1. Monitoring Real-Time (TORCH)
Kita memantau aktivitas Ping dari Client.

**A. Metode GUI (Winbox)**
* **Menu:** Tools > Torch.
* **Interface:** `ether1-LAN-HostOnly` (Jalur ke Client).
* **Filter:** Centang *Src. Address*, *Dst. Address*, *Protocol*, *Port*.
* **Action:** Start.

**B. Metode CLI (Terminal)**
```bash
/tool torch interface=ether1-LAN-HostOnly src-address=192.168.50.50/32 dst-address=0.0.0.0/0 ip-protocol=any port=any
```

*Hasil:* Terdeteksi protokol **ICMP** (Ping) berjalan dari `192.168.50.50` ke `192.168.50.1`.

---

### 2. Monitoring Sejarah (GRAPHING)
Kita mengaktifkan pencatatan grafik agar bisa dilihat via Web.

**A. Persiapan Firewall (PENTING)**
Agar Web Graphing bisa dibuka, Rule Firewall Misi 3 (Blokir Web Router) harus dimatikan sementara.
```bash
/ip firewall filter set numbers=2 disabled=yes
```

*(Asumsi Rule no.2 adalah rule Drop TCP Port 80).*

**B. Metode GUI (Winbox)**
* **Menu:** Tools > Graphing.
* **Interface Rules:** Add (+) > Interface: `ether1-LAN-HostOnly` > Allow Address: `0.0.0.0/0` > Store on Disk: `Checked`.
* **Resource Rules:** Add (+) > Allow Address: `0.0.0.0/0` > Store on Disk: `Checked`.

**C. Metode CLI (Terminal)**
```bash
/tool graphing interface add interface=ether1-LAN-HostOnly allow-address=0.0.0.0/0 store-on-disk=yes
```
```bash
/tool graphing resource add allow-address=0.0.0.0/0 store-on-disk=yes
```

**D. Hasil Pengujian (Via Browser)**
* **URL:** Akses `http://192.168.50.1/graphs` dari Browser Client.
* **Output:** Terlihat grafik batang/garis (Hijau/Biru) untuk trafik `ether1` dan grafik penggunaan CPU/Memory/Disk.

---

### 3. Pencatatan Kejadian (LOGGING)
Kita memantau aktivitas User VPN (Connect/Disconnect).

**A. Metode CLI (Live Monitoring)**
Kita menggunakan perintah `follow` untuk melihat log berjalan real-time.
```bash
/log print follow
```

**B. Hasil Pengujian**
Saat User VPN (`TEUNGKU.Tbk`) melakukan koneksi/diskoneksi, muncul log:
```
<pptp-teungku-edu>: authenticated
<pptp-teungku-edu>: using encoding - MPPE128 stateless
<pptp-teungku-edu>: connected
```

*Diagnosa:* Koneksi VPN berhasil, otentikasi sukses, enkripsi aktif.

---

## D. KESIMPULAN

Misi 5 Sukses. Router kini tidak lagi "Blackbox". Kita bisa melihat isinya (Torch), masa lalunya (Graphing), dan catatannya (Log). Kemampuan ini sangat vital untuk troubleshooting masalah jaringan di masa depan.

---
