---
title: "SmartBin: Sistem Manajemen Sampah Cerdas Berbasis IoT"
date: "2025-01-02"
tags: [projects-series, IoT, Laravel, Arduino, Hardware]
excerpt: ""
youtube_id: ""
---

**SmartBin** adalah solusi *Internet of Things (IoT)* yang mengintegrasikan perangkat keras sensor dengan platform web untuk memantau kapasitas sampah secara *real-time* dan memberikan *reward point* otomatis kepada pengguna.

![SmartBin Architecture](https://placehold.co/800x400/2c2c2c/f0f0f0?text=SmartBin+Architecture)

---

## 🚩 Latar Belakang
Di lingkungan perkotaan, pengelolaan sampah seringkali tidak efisien. Petugas kebersihan sering memeriksa tong sampah yang masih kosong (membuang waktu/bensin) atau terlambat mengangkut tong yang sudah penuh (menyebabkan polusi). Selain itu, kurangnya insentif membuat masyarakat malas membuang sampah pada tempatnya.

## 💡 Solusi yang Ditawarkan
SmartBin hadir dengan dua fungsi utama:
1.  **Monitoring Kapasitas:** Mendeteksi kepenuhan sampah menggunakan sensor ultrasonik.
2.  **Sistem Reward:** Memberikan poin kepada user yang membuang sampah, yang tercatat otomatis di dashboard.

## 🛠️ Arsitektur Teknis

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Hardware** | NodeMCU ESP8266 | Mikrokontroler utama dengan modul WiFi. |
| **Sensor** | Ultrasonik HC-SR04 | Mengukur jarak sampah untuk menentukan kepenuhan. |
| **Backend** | Laravel 9 | REST API untuk menerima data sensor dan manajemen user. |
| **Database** | MySQL | Menyimpan log transaksi sampah dan data user. |
| **Container** | Docker | Digunakan untuk lingkungan pengembangan yang konsisten. |

## 🚀 Tantangan Teknis
Salah satu tantangan terbesar adalah **latensi jaringan**. Terkadang koneksi WiFi pada ESP8266 terputus saat pengiriman data ke server Laravel.
* **Solusi:** Saya mengimplementasikan logika *reconnect* otomatis pada kode C++ Arduino dan membuat *queue* sederhana untuk menyimpan data sementara jika offline.

## 🔗 Tautan
[Lihat Kode di GitHub](https://github.com/TEUNGKU-ZULKIFLI/smartbin)