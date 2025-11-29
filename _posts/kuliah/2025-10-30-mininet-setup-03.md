---
title: "Tahapan 03: Topology Single Custom"
date: "2025-10-30"
category: "Kuliah"
tags: ["mininet-series"]
---

<iframe src="https://www.youtube.com/embed/T4xLQfwhbFA?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 3): TOPOLOGY FIRST EZ

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
- Tujuan kita di tahap ini adalah membuat `cetakan` file Python yang akan dikenali oleh Mininet. Kita belum akan membuat `topologi yang rumit`, hanya kerangka dasarnya saja.

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
nano ~/mininet/custom/single_custom.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `single_custom.py`.

#### **2. Tulis Kode Kerangka (Boilerplate)**
```bash
#!/usr/bin/python

"""
Skrip Topologi Single Kustom (Level EZ)
"""

from mininet.topo import Topo

class SingleTopo( Topo ):
    "Topologi single sederhana: 1 switch, 3 host."

    def __init__( self ):
        "Membuat topologi kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- (DI SINI KITA AKAN MENAMBAHKAN KODE DI LANGKAH 2/3) ---
        pass


# Baris ini WAJIB ada di akhir file
# Ini memberitahu Mininet bahwa 'mytopo' adalah alias untuk kelas SingleTopo
topos = { 'mytopo': ( lambda: SingleTopo() ) }
```
Ini adalah kode minimal yang dibutuhkan setiap file topologi Mininet. Salin dan tempel (`paste`) kode ini ke dalam editor `nano`:

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

- `from mininet.topo import Topo`: Ini seperti bilang, "Hei Python, kita mau meminjam `cetakan` topologi standar dari Mininet."
- `class SingleTopo( Topo ):`: Kita membuat "cetakan" baru kita sendiri bernama SingleTopo yang didasarkan pada "cetakan" standar Mininet.
- `def __init__( self ):`: Ini adalah fungsi "konstruktor" atau "cetakan utama". Semua perintah untuk addHost atau addSwitch akan diletakkan di dalam sini.
- `topos = { ... }`: Ini adalah "daftar isi" untuk Mininet. Baris ini memberitahu Mininet, "Jika seseorang menjalankan perintah `--topo mytopo`, tolong gunakan kelas SingleTopo yang ada di file ini."

### **Tahap 2: Menambahkan Komponen (Nodes & Links)**

#### **1. Buka File Python Anda**
```bash
nano ~/mininet/custom/single_custom.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

#### **2. Ganti Kode dengan Versi Lengkap Ini**
```code
#!/usr/bin/python

"""
Skrip Topologi Single Kustom (Level EZ)
"""

from mininet.topo import Topo

class SingleTopo( Topo ):
    "Topologi single sederhana: 1 switch, 3 host."

    # Perbaikan: Menambahkan spasi antara 'def' dan '__init__'
    def __init__( self ):
        "Membuat topologi kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- Mulai penambahan kode ---

        # 1. Tambahkan Switch
        # Kita buat 1 switch bernama 's1'
        s1 = self.addSwitch( 's1' )

        # 2. Tambahkan Hosts
        # Kita buat 3 host bernama 'h1', 'h2', 'h3'
        h1 = self.addHost( 'h1' )
        h2 = self.addHost( 'h2' )
        h3 = self.addHost( 'h3' )

        # 3. Tambahkan Links (Kabel)
        # Kita sambungkan semua host ke switch 's1'
        self.addLink( h1, s1 )
        self.addLink( h2, s1 )
        self.addLink( h3, s1 )
        
        # --- Selesai penambahan kode ---


# Baris ini WAJIB ada di akhir file
# Perbaikan: 'topo' menjadi 'topos' (plural)
topos = { 'mytopo': ( lambda: SingleTopo() ) }
```
Hapus semua isi file lama dan ganti dengan kode di atas ini.

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

- `s1 = self.addSwitch( 's1' )`: Ini adalah perintah untuk membuat switch baru dan memberinya nama variabel s1 agar kita bisa merujuknya nanti.
- `h1 = self.addHost( 'h1' )`: Perintah yang sama untuk membuat host.
- `self.addLink( h1, s1 )`: Perintah ini "mengambil kabel virtual" dan menyambungkan ujung pertamanya ke h1 dan ujung keduanya ke s1.

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
sudo mn --custom ~/mininet/custom/single_custom.py --topo mytopo --switch ovs,protocols=OpenFlow14 --controller remote,ip=127.0.0.1,port=6653
```

#### **3. Verifikasi Total**
##### Layar 1: Komputer Utama Anda (Web UI)
###### Buka browser Anda dan Refresh halaman ONOS (http://192.168.20.1:8181/onos/ui).
###### `BOOM!` Anda akan melihat topologi yang baru saja Anda gambar di Python: 1 switch (`s1`) di tengah, dikelilingi oleh 3 host (`h1`, `h2`, `h3`).
##### Layar 2: Terminal Mininet Anda (CLI)
###### Di dalam mininet>, jalankan tes konektivitas:
```bash
mininet> pingall
```
Hasilnya akan sukses `0% dropped`, membuktikan bahwa ONOS (`reactive.fwd`) berhasil mengendalikan topologi kustom Anda.

#### **Penjelasan Kode (Materi Dikit):**

- `--custom ~/mininet/custom/single_custom.py`: Ini adalah perintah yang memberitahu Mininet, "Jangan pakai topologi bawaanmu. Tolong muat 'cetakan' dari file ini."
- `--topo mytopo`: Ini adalah perintah yang memberitahu Mininet, "Dari dalam file itu, tolong gunakan 'cetakan' yang bernama 'mytopo'." (Ingat, nama ini kita definisikan di baris `topos = { ... }`).

-----