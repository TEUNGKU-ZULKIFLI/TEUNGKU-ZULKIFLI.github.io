---
title: "SmartBin: Sistem Manajemen Sampah Cerdas Berbasis IoT"
date: "2025-01-02"
tags: [projects-series, IoT, Laravel, Arduino, Hardware]
excerpt: ""
youtube_id: ""
---

# SmartBin Dokumentasi — TONG BROH CAROENG

## Ringkasan
**SmartBin** adalah solusi Internet of Things yang menggabungkan perangkat keras sensor dengan platform web untuk memberikan **reward point otomatis** kepada pengguna saat membuang sampah pada tempatnya.  
Nama alternatif: **TONG BROH CAROENG**.

---

## Latar Belakang
Banyak orang malas membuang sampah pada tempatnya. Akibatnya sampah menumpuk, menyumbat saluran air, dan memicu banjir serta masalah kesehatan lingkungan lainnya. Upaya edukasi dan kampanye seringkali kurang efektif karena tidak ada insentif langsung yang mendorong perubahan kebiasaan.

**Masalah inti**
- **Kebiasaan buruk**: Banyak orang enggan membuang sampah pada tempatnya.  
- **Dampak lingkungan**: Banjir, penyumbatan saluran, dan penurunan kualitas lingkungan.  
- **Rendahnya partisipasi**: Tanpa insentif nyata, perilaku positif sulit dipertahankan.

**Mengapa proyek ini dibuat**  
Untuk mengubah perilaku publik dengan mekanisme insentif: ketika seseorang membuang sampah pada tempatnya, sistem otomatis memberikan poin sebagai reward. Poin ini menjadi motivator langsung yang mendorong kebiasaan membuang sampah yang benar, sehingga secara bertahap meningkatkan kepatuhan dan mengurangi masalah lingkungan seperti banjir.

---

## Solusi dan Alur Penggunaan
SmartBin menerapkan logika **reward-for-action** untuk mendorong perilaku membuang sampah yang benar.

**Alur singkat**
1. Pengguna terhubung ke jaringan lokal yang sama dengan perangkat SmartBin.  
2. Pengguna mendaftar akun di aplikasi web melalui `http://smartbin.test`.  
3. Saat akan membuang sampah, pengguna menekan tombol klaim pada halaman utama aplikasi web.  
4. Pengguna membuang sampah ke tong yang dilengkapi sensor.  
5. Sistem mendeteksi aksi lewat sensor dan **memberikan poin otomatis** yang langsung tercatat di dashboard pengguna.

**Logika perubahan perilaku**
- **Imbalan langsung** (immediate reward) memperkuat kebiasaan positif.  
- **Visibilitas hasil** (dashboard poin dan riwayat) membuat kontribusi pengguna terasa nyata.  
- **Gamifikasi sederhana** (poin, level, atau reward) meningkatkan keterlibatan jangka panjang.

**Fitur utama**
- **Pencatatan otomatis** saat sampah terdeteksi.  
- **Sistem reward** real time ke akun pengguna.  
- **Dashboard** untuk melihat riwayat, total poin, dan statistik.  
- **Manajemen akun** pendaftaran dan autentikasi.  
- **Toleransi offline lokal** untuk operasi dasar di jaringan LAN.

---

## Arsitektur Teknis
**Perangkat keras**
- **ESP8266 Wemos D1 R1** — mikrokontroler dengan WiFi.  
- **Sensor Ultrasonic HC-SR04** — deteksi keberadaan sampah / level tong.  
- **LCD 16x2 I2C** — tampilan status lokal.

**Perangkat lunak**
- **Backend**: Laravel berjalan di Docker (laradoc) untuk kemudahan deployment.  
- **Frontend**: Aplikasi web sederhana (Laravel Blade atau SPA) untuk dashboard dan interaksi pengguna.  
- **Firmware**: Arduino IDE untuk ESP8266, menangani pembacaan sensor dan komunikasi HTTP ke backend.

**Tech Stack ringkas**

| Komponen | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Mikrokontroler** | ESP8266 Wemos D1 R1 | Murah; WiFi terintegrasi |
| **Sensor** | HC-SR04 Ultrasonic | Pengukuran jarak sederhana dan andal |
| **Display** | LCD 16x2 I2C | Informasi lokal mudah dibaca |
| **Backend** | Laravel di Docker | Deployment konsisten dan mudah dikelola |
| **Firmware** | Arduino IDE | Sederhana untuk pengembangan perangkat

---

## Tantangan Teknis dan Rekomendasi
**Tantangan**
- Ketergantungan pada jaringan lokal (LAN) yang sama antara pengguna dan tong.  
- False positive atau false negative pada sensor ultrasonic akibat kondisi lingkungan (angin, objek lain, pantulan).

**Rekomendasi**
- Terapkan **debounce** dan threshold pada pembacaan sensor untuk mengurangi false trigger.  
- Simpan buffer lokal pada perangkat untuk sinkronisasi saat koneksi ke backend terputus.  
- Pertimbangkan opsi konektivitas alternatif (WiFi Direct, hotspot) untuk skenario tanpa infrastruktur jaringan.  
- Tambahkan logging dan metrik untuk memantau akurasi sensor dan tingkat partisipasi pengguna.