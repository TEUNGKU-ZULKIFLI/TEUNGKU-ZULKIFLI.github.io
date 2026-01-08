---
title: "Bandwidth Management (Polisi Lalu Lintas)"
date: "2025-12-25"
category: "Course"
tags: ["mikrotik-series"]
---

# 📂 DOKUMENTASI LAB MIKROTIK: MISI 2

## A. TUJUAN MISI
Mencegah satu pengguna menghabiskan kapasitas internet kantor (monopoli bandwidth). Mengimplementasikan fitur *Simple Queue* untuk membatasi kecepatan Download dan Upload pada client spesifik.

---

## B. KONSEP DASAR (TEORI DAGING) 🥩

### 1. Bandwidth vs Throughput
* **Bandwidth:** Lebar pipa maksimum (Kapasitas Jalan Tol).
* **Throughput:** Kecepatan data yang sebenarnya lewat (Jumlah mobil yang lewat).
* *Tugas kita:* Mengecilkan lebar jalan untuk user tertentu supaya tidak macet.

### 2. Simple Queue
Fitur paling sederhana di Mikrotik untuk melimitasi bandwidth berdasarkan IP Address.

* **Target:** Siapa yang mau dibatasi (IP `192.168.50.50`).
* **Max Limit:** Batas mentok kecepatan. (Jika diset 128k, user tidak akan pernah bisa lewat dari angka itu, meskipun internet sedang kosong).

### 3. Logika Urutan (Top-Down)
Mikrotik membaca aturan antrian dari **Atas ke Bawah**.

* Aturan untuk IP Spesifik harus ditaruh di urutan **0 (Paling Atas)**.
* Aturan untuk Network Global (Sekantor) ditaruh di **Bawahnya**.
* *Analogi:* VIP diperiksa duluan, baru antrian umum.

### 4. Satuan Kecepatan
* **b (bit):** Satuan kecepatan internet (Mbps/Kbps).
* **B (Byte):** Satuan ukuran file.
* **Rumus:** 1 Byte = 8 bit. (Download 1 Mbps = Kecepatan transfer file sekitar 125 KB/s).

---

## C. LANGKAH PENGERJAAN

### 1. Skenario Pengujian (Before)
* Melakukan Speedtest tanpa limitasi.
* **Hasil:** ~940 Kbps (Note: Terlimit oleh Lisensi CHR Free Tier 1Mbps).
* **Experience:** Youtube lancar, browsing cepat.

### 2. Implementasi Queue (Action)
**Metode GUI (Winbox):**
* Menu: **Queues** > **Simple Queues**.
* Add (+):
* Name: `Limit-PC-TEUNGKU`
* Target: `192.168.50.50`
* Max Limit: `128k` (Upload) / `128k` (Download).

**Metode CLI (Script):**
```bash
/queue simple add name="Limit-PC-TEUNGKU" target=192.168.50.50 max-limit=128k/128k
```

### 3. Hasil Pengujian (After)
* **Speedtest:** Turun drastis menjadi ~110 Kbps.
* **Experience:**
* Membuka YouTube hanya muncul kerangka (*wireframe*). Video tidak bisa diputar atau sangat patah-patah.
* Indikator Queue di Winbox berubah warna menjadi **Merah 🔴** (Tanda trafik penuh/mentok).

### 4. Normalisasi
* Mengubah limit menjadi **1M/1M**.
* **Hasil:** YouTube bisa diputar kembali (Resolusi 1080p buffer sedikit).

---

## D. KESIMPULAN
Fitur Simple Queue berhasil diterapkan. Admin memiliki kendali penuh untuk menentukan seberapa cepat client boleh mengakses internet. Ini vital untuk menjaga stabilitas jaringan di kantor agar tidak ada user yang egois.

---