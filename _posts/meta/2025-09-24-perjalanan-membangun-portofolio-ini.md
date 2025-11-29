---
title: "Dari Nol ke Publikasi: Perjalanan Membangun Portofolio Ini"
date: "2025-09-24"
category: "Meta"
tags: ["personal-project"]
---

# Latar Belakang & Tujuan
Setiap developer pada akhirnya akan sampai pada satu titik: kebutuhan untuk memiliki sebuah "rumah" digital. Bukan hanya sekadar CV, tetapi sebuah etalase hidup yang dapat menunjukkan kemampuan, proses berpikir, dan kepribadian. Inilah latar belakang utama mengapa saya memutuskan untuk membangun portofolio ini dari nol.

Tujuannya jelas: membuat sebuah situs yang cepat, bersih, mudah dirawat, dan sepenuhnya milik saya—tanpa bergantung pada framework atau template yang sudah jadi.

## Fase-fase Pembangunan
Perjalanan ini dibagi menjadi beberapa fase utama, mulai dari fondasi hingga sentuhan akhir.

### 1. Fondasi & Arsitektur
Langkah pertama adalah yang paling krusial: merancang struktur. Saya memutuskan untuk menggunakan arsitektur CSS modular, memecah gaya menjadi beberapa bagian:

`base.css`: Untuk variabel dan reset dasar.

`layout.css`: Untuk `header`, `main`, dan `footer`.

`components/*.css`: Untuk elemen yang dapat digunakan kembali seperti tombol dan kartu.

`pages/*.css`: Untuk gaya unik per halaman.

### 2. Otomatisasi Blog
Tantangan terbesar adalah bagaimana mengelola konten blog tanpa harus mengedit file JavaScript setiap kali ada artikel baru. Solusinya adalah sebuah skrip `build.py` sederhana yang melakukan tiga hal:

Memindai semua file `.md` di folder `_posts`.

Membaca <i>Front Matter</i> (judul, tanggal, tags) dari setiap file.

Menghasilkan satu file `manifest.json` yang berfungsi sebagai "database" untuk blog saya.

### 3. Fungsionalitas & Pengalaman Pengguna
Selain struktur, beberapa fitur penting ditambahkan untuk meningkatkan pengalaman pengguna:

Sistem Filter Dinamis: Pengguna dapat memfilter artikel berdasarkan kategori atau tag.

Multi-Bahasa: Dengan mendeteksi bahasa browser, situs dapat menyajikan konten dalam Bahasa Indonesia atau Inggris.

Desain Responsif: Tentu saja, memastikan semuanya terlihat sempurna di perangkat mobile.

## Apa Selanjutnya?
Portofolio ini akan terus menjadi kanvas saya untuk bereksperimen. Rencana selanjutnya adalah Fase 6: Optimasi, di mana saya akan fokus pada kecepatan loading, SEO, dan aksesibilitas.

Terima kasih telah mengikuti perjalanan ini!