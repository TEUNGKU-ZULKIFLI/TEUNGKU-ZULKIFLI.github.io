---
title: "Lifehack Windows: Part-01"
date: "2025-10-31"
category: "LifeHack"
tags: ["lifehack-win-series", "Windows11"]
---

# 💡 Lifehack Windows: Bebaskan Drive C dengan Junction & Symlink

Apakah drive C:\ kamu mulai penuh dan bikin sistem lemot? Padahal kamu cuma simpan video, dokumen, atau file rekaman? Tenang, ada trik cerdas yang bisa bantu kamu **pindahkan isi folder ke drive lain** tanpa bikin aplikasi bingung: pakai **Junction** atau **Symbolic Link (Symlink)**.

Artikel ini akan bantu kamu memahami dua teknik ini dengan gaya yang santai dan langsung bisa dipraktikkan.

---

## 🧠 Apa itu Junction dan Symlink?

Bayangkan kamu punya **pintu palsu** di rumah. Saat orang buka pintu itu, mereka langsung masuk ke ruangan lain — padahal pintunya tetap di tempat lama. Itulah konsep **link folder** di Windows.

| Fitur         | Junction                          | Symbolic Link (Symlink)             |
|---------------|-----------------------------------|-------------------------------------|
| Jenis         | Khusus folder                     | Bisa folder & file                  |
| Lintas drive  | ✅ Bisa                            | ✅ Bisa                              |
| Kompatibilitas| ✅ Stabil di Windows               | ⚠️ Kadang gagal di aplikasi lama     |
| Tujuan        | Pindah folder tanpa ganggu sistem | Pindah file/folder dengan fleksibel |

---

## 🎯 Kapan pakai Junction?

Gunakan **Junction** kalau:
- Kamu ingin pindahkan folder besar (misalnya video, rekaman, dokumen) dari C:\ ke D:\ atau E:\
- Tapi tetap ingin aplikasi mengaksesnya seolah-olah masih di C:\
- Kamu tidak butuh link ke file individual

**Contoh kasus:** Folder `C:\Users\i3len\Videos\Screen Recordings` mau dipindah ke `E:\Videos`, tapi tetap bisa diakses dari lokasi lama.

---

## 🛠️ Tutorial: Pindahkan Folder dengan Junction

Langkah-langkahnya:

1. **Buka PowerShell sebagai Administrator**

2. **Pindahkan folder ke drive tujuan:**
   ```powershell
   Move-Item "C:\Users\i3len\Videos\Screen Recordings" "E:\Videos\Screen Recordings"
   ```

3. **Buat Junction di lokasi lama:**
   ```powershell
   New-Item -ItemType Junction -Path "C:\Users\i3len\Videos\Screen Recordings" -Target "E:\Videos\Screen Recordings"
   ```

✅ Sekarang, semua aplikasi yang buka folder di C:\ akan diarahkan ke E:\ secara otomatis!

---

## 🧩 Kapan pakai Symlink?

Gunakan **Symlink** kalau:
- Kamu ingin link ke **file individual** (misalnya `config.json`)
- Kamu butuh fleksibilitas lebih, misalnya untuk pengembangan software atau testing
- Kamu tahu aplikasi yang kamu pakai **mendukung symlink**

**Contoh perintah:**
```powershell
New-Item -ItemType SymbolicLink -Path "C:\Project\config.json" -Target "D:\Configs\config.json"
```

---

## ⚠️ Tips & Catatan

- Jalankan PowerShell sebagai **Administrator**
- Pastikan folder tujuan sudah ada
- Jangan buat link ke folder yang aktif dipakai sistem saat proses berlangsung
- Untuk folder, **Junction lebih aman dan stabil** di Windows

---

## 🎁 Bonus Lifehack

Kamu bisa pakai trik ini untuk:
- Pindahkan folder cache atau temp ke drive lain
- Simpan file backup di HDD tapi tetap bisa diakses dari SSD
- Buat struktur proyek modular tanpa duplikasi file

---

## 🏁 Penutup

Dengan memahami dan menggunakan **Junction** dan **Symlink**, kamu bisa menghemat ruang di drive C:\, mempercepat sistem, dan tetap menjaga kompatibilitas aplikasi. Trik ini cocok untuk pengguna awam, pelajar, developer, atau siapa pun yang ingin sistemnya tetap ringan dan rapi.

Kalau kamu suka lifehack seperti ini, jangan lupa simpan artikel ini dan coba langsung di sistem kamu!

---