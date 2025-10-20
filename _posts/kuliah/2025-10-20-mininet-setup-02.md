---
title: "Integrasi Mininet VM - Tahapan 02: Integrasi ONOS dengan Mininet VM"
date: "2025-10-20"
category: "Kuliah"
tags: ["mininet-series", "HyperV", "linux", "initial-setup", "networking", "onos"]
---

<iframe src="https://www.youtube.com/embed/4c9R0YHQAAY?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap Integrasi ONOS dengan MININET

## 🚀 Pendahuluan
**`Mininet`** adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.</br>

**`ONOS`** (Open Network Operating System) adalah sistem operasi yang dirancang untuk membantu penyedia layanan jaringan membangun jaringan berbasis perangkat lunak (SDN) dengan tingkat skalabilitas, ketersediaan, dan kinerja yang tinggi. ONOS berfungsi sebagai kontroler SDN yang mengelola komponen jaringan seperti switch dan link, serta menjalankan program perangkat lunak untuk menyediakan layanan komunikasi kepada perangkat akhir dan jaringan sekitarnya. Dengan arsitektur modularnya, ONOS memungkinkan penyesuaian yang lebih mudah dan meningkatkan ketersediaan jaringan.</br>

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [ONOS](https://wiki.onosproject.org/display/ONOS/ONOS)
- [Docker ONOS](https://hub.docker.com/r/onosproject/onos/)
- [Github Ref](https://github.com/ArnoTroch/ONOS-Tutorial/blob/main/README.md)

---

## 🎯 Tujuan & Konsep
- Menjalankan Mininet VM di Windows 11 menggunakan Hyper-V.
- Menghubungkan VM ke internet dan host melalui adapter virtual.
- Mengintegrasikan ONOS dengan Mininet VM.

---

## 🧰 Prasyarat
- Windows 11 Pro atau Enterprise (Hyper-V hanya tersedia di edisi ini).
- Hyper-V sudah aktif (bisa diaktifkan lewat "Turn Windows features on or off").
- Koneksi internet untuk update dan instalasi paket.
- Sudah ada VM mininet [`Belum Ada ?👆🏻`](https://teungku-zulkifli.github.io/article.html?post=_posts/kuliah/2025-10-10-mininet-setup-01.md)
- Sudah bisa remote VM Mininet

---

## 🛠️ Langkah-langkah Eksekusi

### Tahap 1: Persiapan VM dan Instalasi Docker

Langkah ini meintegrasikan ONOS ke mininet simak baik" dan jika bisa sambilan nonton video diatas tersebut.

1.  **Update Sistem & Instal Prasyarat:**

    ```bash
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt-get install -y git python3 zip unzip
    ```

2.  **Bersihkan Sisa Percobaan Gagal (Wajib):**
    Kita hapus semua percobaan membuat topology terdahulu.

    ```bash
    sudo mn -c
    ```

3.  **Instal Docker:**

    ```bash
    sudo apt-get install -y docker.io
    ```

4.  **Aktifkan Service Docker:**

    ```bash
    sudo systemctl enable docker && sudo systemctl start docker
    ```

5.  **Beri Izin User `mininet` (Sangat Penting):**
    Ini agar Anda tidak perlu `sudo` untuk setiap perintah Docker.

    ```bash
    sudo usermod -aG docker mininet
    ```

6.  **Terapkan Izin (Krusial):**
    Anda harus **logout** dari VM lalu **login kembali**.

    ```bash
    exit
    ```

    (Sekarang, login kembali ke VM Anda).

-----

### Tahap 2: Menyiapkan Kontainer ONOS

Sekarang kita akan mengunduh dan menjalankan "paket jadi" ONOS.

1.  **Verifikasi Instalasi Docker:**
    Setelah login kembali, jalankan perintah ini. Seharusnya berhasil tanpa `sudo`.

    ```bash
    docker --version
    ```

    Terapkan Perintah berikut digunakan untuk membuat symbolic link (symlink) `DOCKER`
    ```bash
    sudo ln -sf /usr/bin/docker /usr/local/bin/docker
    ```

2.  **Unduh "Paket" ONOS (Versi 2.6-latest):**

    ```bash
    docker pull onosproject/onos:2.6-latest
    ```

3.  **Jalankan Kontainer ONOS:**
    Ini adalah perintah utama yang menyalakan ONOS di latar belakang dan secara otomatis mengaktifkan semua aplikasi yang kita butuhkan.

    ```bash
    docker run -d -p 6653:6653 -p 8181:8181 -p 8101:8101 -e ONOS_APPS=openflow,reactive.fwd,gui2 --name onos onosproject/onos:2.6-latest
    ```

    *Catatan: Parameter `-e ONOS_APPS=...` adalah kunci sukses kita. Ia mencegah semua masalah `feature:install` karena aplikasi sudah langsung diaktifkan.*

-----

### Tahap 3: Verifikasi dan Integrasi

Kita pastikan ONOS berjalan, lalu kita sambungkan Mininet.

1.  **Cek Kontainer yang Berjalan:**
    Tunggu sekitar 1-2 menit agar ONOS siap, lalu jalankan:

    ```bash
    docker ps
    ```

    Anda akan melihat kontainer bernama `onos` dengan status `Up`.

2.  **(Opsional) Cek Log Startup ONOS:**
    Untuk melihat apa yang terjadi di dalam, Anda bisa "mengintip" log-nya.

    ```bash
    docker logs -f onos
    ```

    (Tekan `Ctrl+C` untuk keluar dari log).

3.  **(Opsional) Login ke Konsol ONOS/Karaf:**
    Untuk verifikasi level dewa, buka terminal baru dan login ke konsol Karaf.

    ```bash
    ssh -p 8101 karaf@127.0.0.1
    ```

    (Password: `karaf`). Lalu jalankan `apps -a -s` untuk melihat `reactive.fwd` dan `gui2` sudah aktif.

4.  **Bersihkan dan Jalankan Mininet (Momen Kemenangan):**
    Di terminal baru, jalankan perintah Mininet yang sudah terbukti sukses.

    ```bash
    sudo mn -c
    ```
    ```bash
    sudo mn --topo single,3 --mac --switch ovs,protocols=OpenFlow14  --controller remote,ip=127.0.0.1
    ```

5.  **Akses Web UI (Dari Komputer Utama Anda):**
    Buka browser di **komputer host** Anda (bukan di VM) dan kunjungi:
    `http://192.168.20.1:8181/onos/ui`

      * **Login:** `onos`
      * **Password:** `rocks`
        **BOOM\!** Topologi Anda akan muncul di sana.

6.  **Tes Akhir di Mininet:**
    Kembali ke terminal Mininet Anda dan jalankan:

    ```bash
    mininet> pingall
    ```

    Hasilnya akan `0% dropped`.

-----

# BASIC Command Docker

### Mengelola Kontainer (Si "Akuarium" yang Sedang Berjalan) 📦

Kontainer adalah ONOS Anda yang sedang *hidup* dan *berjalan*.

  * **Melihat kontainer yang sedang berjalan:**
    Perintah ini akan menunjukkan kontainer apa saja yang sedang aktif (status `Up`). Ini adalah cara tercepat untuk mengecek apakah `onos` Anda berjalan.

    ```bash
    docker ps
    ```

  * **Melihat SEMUA kontainer (termasuk yang mati/stop):**
    Kadang kontainer berhenti karena error. Perintah ini akan menampilkannya.

    ```bash
    docker ps -a
    ```

  * **Menghentikan kontainer:**
    Ini cara yang aman untuk mematikan ONOS tanpa menghapusnya.

    ```bash
    docker stop onos
    ```

  * **Menyalakan kembali kontainer yang sudah di-stop:**
    Jika Anda sudah `stop`, ini cara menyalakannya lagi (tidak perlu `docker run` lagi).

    ```bash
    docker start onos
    ```

  * **Melihat log (pesan) dari kontainer:**
    Sangat berguna untuk *troubleshooting* jika kontainer tidak mau jalan.

    ```bash
    docker logs onos
    ```

    (Gunakan `docker logs -f onos` untuk melihat log secara *live*).

  * **Menghapus kontainer:**
    Ini akan menghapus kontainer `onos` secara permanen. Anda **hanya bisa menghapus kontainer yang sudah di-`stop`**.

    ```bash
    docker rm onos
    ```

-----

### Mengelola Image (Si "Cetakan" atau "File Instalasi") 💿

Image adalah "file .tar.gz" atau "cetakan" yang Anda unduh (`docker pull`).

  * **Melihat semua image yang ada di mesin Anda:**

    ```bash
    docker images
    ```

  * **Menghapus image:**
    Ini akan menghapus "cetakan" `onos:2.6-latest` dari disk Anda. Berguna untuk menghemat ruang.

    ```bash
    docker rmi onosproject/onos:2.6-latest
    ```

    *Catatan: Anda hanya bisa menghapus image jika sudah tidak ada kontainer (termasuk yang sudah di-`stop`) yang menggunakannya.*

-----

### Jawaban untuk Pertanyaan Spesifik Anda 💡

  * **"Cara nanti aman container sebelum shutdownkan mechine?"**
    Kabar baik\! Docker modern (yang Anda instal) sudah pintar. Saat Anda menjalankan `sudo shutdown` atau `sudo reboot` pada VM Anda, Docker akan secara otomatis mengirim sinyal "STOP" yang aman ke semua kontainer yang sedang berjalan (seperti `docker stop onos`). Anda **tidak perlu mematikannya secara manual** satu per satu. Semuanya aman\!

  * **"Hapus chache?" (Sapu Bersih) 🧹**
    Ini adalah perintah "ajaib" yang paling Anda butuhkan untuk bersih-bersih. Ini menjawab pertanyaan Anda soal "cache" dan "lain-lain".

    ```bash
    docker system prune
    ```

    Perintah ini akan secara otomatis menghapus:

    1.  Semua kontainer yang sudah di-`stop`.
    2.  Semua jaringan yang tidak terpakai.
    3.  Semua *build cache* yang menggantung.

    Jika Anda ingin lebih "sadis" dan menghapus **image yang tidak terpakai** juga, gunakan:

    ```bash
    docker system prune -a
    ```

-----