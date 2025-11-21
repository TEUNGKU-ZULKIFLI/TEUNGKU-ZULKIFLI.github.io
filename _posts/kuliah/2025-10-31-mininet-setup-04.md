---
title: "Tahapan 04: Topology Tree Custom"
date: "2025-10-31"
category: "Kuliah"
tags: ["mininet-series", "HyperV", "linux", "initial-setup", "networking", "onos"]
---

<iframe src="https://www.youtube.com/embed/3sOGQxwXLhQ?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 4): TOPOLOGY SECOND BEGINNER

## 🚀 Pendahuluan
**`Mininet`** adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.</br>

**`ONOS`** (Open Network Operating System) adalah sistem operasi yang dirancang untuk membantu penyedia layanan jaringan membangun jaringan berbasis perangkat lunak (SDN) dengan tingkat skalabilitas, ketersediaan, dan kinerja yang tinggi. ONOS berfungsi sebagai kontroler SDN yang mengelola komponen jaringan seperti switch dan link, serta menjalankan program perangkat lunak untuk menyediakan layanan komunikasi kepada perangkat akhir dan jaringan sekitarnya. Dengan arsitektur modularnya, ONOS memungkinkan penyesuaian yang lebih mudah dan meningkatkan ketersediaan jaringan.</br>

**`Topology`** Topologi mengacu pada bagaimana suatu jaringan diorganisasikan. Setiap jaringan terdiri dari node yang berbeda dan node ini terhubung satu sama lain dengan link. Tautan ini dapat didefinisikan baik secara fisik maupun logis. Dengan kata lain, topologi adalah desain atau tata letak dari elemen-elemen jaringan, termasuk komputer, server, printer, router, dan perangkat lainnya, serta bagaimana mereka terhubung.</br>

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [ONOS](https://wiki.onosproject.org/display/ONOS/ONOS)
- [Docker ONOS](https://hub.docker.com/r/onosproject/onos/)
- [Github Ref](https://github.com/ArnoTroch/ONOS-Tutorial/blob/main/README.md)

---

## 🎯 Tujuan & Konsep
- Tujuan kita di tahap ini adalah membuat file Python baru khusus untuk topologi pohon kita.
- Kita akan mereplikasi topologi `tree,depth=2,fanout=2` yang sudah kita kenal, tapi kali ini kita yang membangunnya `bata` demi `bata`.

---

## 🧰 Prasyarat
- Windows 11 Pro atau Enterprise (Hyper-V hanya tersedia di edisi ini).
- Hyper-V sudah aktif (bisa diaktifkan lewat "Turn Windows features on or off").
- Koneksi internet untuk update dan instalasi paket.
- Sudah ada VM mininet [`Belum Ada ?👆🏻`](https://teungku-zulkifli.github.io/article.html?post=_posts/kuliah/2035-10-10-mininet-setup-01.md)
- Sudah bisa remote VM Mininet

---

## **🛠️ Langkah-langkah Eksekusi**

### **Tahap 1: Membuat Kerangka Skrip Python**

#### **1. Buat File Python Baru**
```bash
nano ~/mininet/custom/tree_custom.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `tree_custom.py`.

#### **2. Tulis Kode Kerangka (Boilerplate)**
```bash
#!/usr/bin/python

"""
Skrip Topologi Tree Kustom (Level Beginner)
depth=2, fanout=2
"""

from mininet.topo import Topo

class TreeTopo( Topo ):
    "Topologi pohon sederhana: depth=2, fanout=2."

    def __init__( self ):
        "Membuat topologi pohon kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- (DI SINI KITA AKAN MENAMBAHKAN KODE DI LANGKAH 2/3) ---
        # Kita akan menggunakan looping (perulangan) di sini!
        pass


# Baris ini WAJIB ada di akhir file
# Kali ini, kita beri nama 'mytree' agar berbeda
topos = { 'mytree': ( lambda: TreeTopo() ) }
```
Ini adalah kode minimal yang dibutuhkan setiap file topologi Mininet. Salin dan tempel (`paste`) kode ini ke dalam editor `nano`:

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

`from mininet.topo import Topo`: Ini seperti bilang, "Hei Python, kita mau meminjam 'cetakan' topologi standar dari Mininet."

`class TreeTopo( Topo ):`: Kita membuat "cetakan" baru kita sendiri bernama TreeTopo yang didasarkan pada "cetakan" standar Mininet.

`def __init__( self ):`: Ini adalah fungsi "konstruktor" atau "cetakan utama". Semua perintah untuk addHost atau addSwitch akan diletakkan di dalam sini.

`topos = { ... }`: Ini adalah "daftar isi" untuk Mininet. Baris ini memberitahu Mininet, "Jika seseorang menjalankan perintah `--topo mytree`, tolong gunakan kelas TreeTopo yang ada di file ini."

### **Tahap 2: Membangun Arsitektur Pohon (Nodes & Links)**

#### **1. Buka File Python Anda**
```bash
nano ~/mininet/custom/tree_custom.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

#### **2. Ganti Kode dengan Versi Lengkap Ini**
```code
#!/usr/bin/python

"""
Skrip Topologi Tree Kustom (Level Beginner)
depth=2, fanout=2
"""

from mininet.topo import Topo

class TreeTopo( Topo ):
    "Topologi pohon sederhana: depth=2, fanout=2."

    def __init__( self ):
        "Membuat topologi pohon kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- Mulai penambahan kode ---

        # 1. Tambahkan Switch "Akar" (Level 1)
        s1 = self.addSwitch( 's1' )

        # 2. Tambahkan Switch "Cabang" (Level 2)
        s2 = self.addSwitch( 's2' )
        s3 = self.addSwitch( 's3' )

        # 3. Tambahkan Host "Daun"
        h1 = self.addHost( 'h1' )
        h2 = self.addHost( 'h2' )
        h3 = self.addHost( 'h3' )
        h4 = self.addHost( 'h4' )

        # 4. Tambahkan Links (Kabel)
        
        # Hubungkan Akar (s1) ke Cabang (s2, s3)
        self.addLink( s1, s2 )
        self.addLink( s1, s3 )

        # Hubungkan Cabang (s2) ke Daunnya (h1, h2)
        self.addLink( s2, h1 )
        self.addLink( s2, h2 )

        # Hubungkan Cabang (s3) ke Daunnya (h3, h4)
        self.addLink( s3, h3 )
        self.addLink( s3, h4 )

        # --- Selesai penambahan kode ---


# Baris ini WAJIB ada di akhir file
# Kali ini, kita beri nama 'mytree' agar berbeda
topos = { 'mytree': ( lambda: TreeTopo() ) }
```
Hapus semua isi file lama dan ganti dengan kode di atas ini.

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

- Tidak ada `looping` dulu! Kita sengaja melakukannya secara manual (`s1`, `s2`, `s3``...`) untuk benar-benar memahami strukturnya. Kita akan pakai `looping` di level `Hard`.

- Logikanya sangat sederhana: kita membuat semua `benda` (`switch` dan `host`) terlebih dahulu, baru kemudian kita `menyambungkan kabel` `(addLink)` di antara mereka sesuai dengan diagram pohon yang kita inginkan.

### **Tahap 3: Menjalankan Skrip dan Verifikasi**

#### **1. Pastikan "Mata" ONOS Anda Menyala**

```bash
docker ps
```
Pastikan Anda melihat kontainer onos dalam status Up. Jika tidak, jalankan:
```bash
docker start onos
```

#### **2. Jalankan Mininet dengan "Cetakan" Kustom Anda**
##### **`PENTING:`** Anda berada di direktori `/home/mininet/mininet/custom`. Kembalilah ke direktori home Anda dulu agar path-nya benar.
```bash
cd ~
```
##### **Jalankan Perintah Kustom:**
```bash
sudo mn --custom ~/mininet/custom/tree_custom.py --topo mytree --switch ovs,protocols=OpenFlow14 --controller remote,ip=127.0.0.1,port=6653
```

#### **3. Verifikasi Total**
##### Layar 1: Komputer Utama Anda (Web UI)
###### Buka browser Anda dan Refresh halaman ONOS (http://192.168.20.1:8181/onos/ui).
###### `BOOM!` Anda akan melihat topologi pohon yang Anda buat: 1 `switch akar` (`s1`) terhubung ke 2 `switch cabang` (`s2`, `s3`), dan `4 host` terhubung di bawahnya.
##### Layar 2: Terminal Mininet Anda (CLI)
###### Di dalam mininet>, jalankan tes konektivitas:
```bash
mininet> pingall
```
Hasilnya akan sukses `0% dropped`, membuktikan bahwa ONOS (`reactive.fwd`) berhasil mengendalikan topologi kustom Anda.

#### **Penjelasan Kode (Materi Dikit):**
- `--custom ~/mininet/custom/tree_custom.py`: Ini adalah shortcut untuk direktori `home` Anda (`/home/mininet`). Dengan menentukan path lengkap ini, Mininet akan menemukan file Anda di mana pun Anda berada.
- `--topo mytree`: Ini memberitahu Mininet untuk menggunakan `cetakan` bernama `mytree` yang kita definisikan di `topos = { ... }` di dalam file skrip Anda.

-----