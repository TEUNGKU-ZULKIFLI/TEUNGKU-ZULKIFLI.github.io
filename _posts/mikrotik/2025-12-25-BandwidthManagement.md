---
title: "Bandwidth Management (Polisi Lalu Lintas)"
date: "2025-12-25"
tags: [mikrotik-series, HyperV, MikroTikOS, Winbox]
excerpt: "Konsep Dasar Bandwidth dan Simple Queue"
youtube_id: "https://youtu.be/584cWqFxz4I"
---

<!-- MikroTik di Hyper-V (#5): Limit Bandwidth via Simple Queue (GUI & CLI) -->
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0; border-radius: 8px; box-shadow: var(--shadow-md);">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="https://www.youtube.com/embed/584cWqFxz4I?" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

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