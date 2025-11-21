---
title: "Tahapan 05: Topology Linear Custom"
date: "2025-11-01"
category: "Kuliah"
tags: ["mininet-series", "HyperV", "linux", "initial-setup", "networking", "onos"]
---

<iframe src="https://www.youtube.com/embed/yr6hPOEFkXU?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 5): TOPOLOGY THIRD HARD

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
- Tujuan kita di tahap ini adalah membuat file Python baru untuk `topologi linear` kita, di mana kita akan menggunakan `looping`.
- Kita akan berhenti mengetik `s1`, `s2`, `s3` satu per satu. Kita akan belajar menggunakan perulangan `(looping)` Python `(for)` untuk membuat jaringan secara terprogram. Ini adalah skill yang sangat penting dan menjadi inti dari otomatisasi jaringan.

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
nano ~/mininet/custom/linear_custom.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `linear_custom.py`.

#### **2. Tulis Kode Kerangka (Boilerplate)**
```bash
#!/usr/bin/python

"""
Skrip Topologi Linear Kustom (Level Hard)

Tujuan: Membuat 3 switch dan 3 host menggunakan looping 'for'.

Struktur:
Setiap host terhubung ke switch-nya (h1-s1, h2-s2, h3-s3).
Semua switch terhubung berantai (s1-s2, s2-s3).
"""

from mininet.topo import Topo

class LinearTopo( Topo ):
    "Topologi linear kustom (N=3) dengan looping."

    def __init__( self ):
        "Membuat topologi linear kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- (DI SINI KITA AKAN MENAMBAHKAN LOOPING 'FOR' DI 2/3) ---
        pass


# Baris ini WAJIB ada di akhir file
topos = { 'mylinear': ( lambda: LinearTopo() ) }
```
Ini adalah kode minimal yang dibutuhkan setiap file topologi Mininet. Salin dan tempel (`paste`) kode ini ke dalam editor `nano`:

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

- `from mininet.topo import Topo`: Ini seperti bilang, "Hei Python, kita mau meminjam `cetakan` topologi standar dari Mininet."
- `class LinearTopo( Topo ):`: Kita membuat "cetakan" baru kita sendiri bernama LinearTopo yang didasarkan pada "cetakan" standar Mininet.
- `def __init__( self ):`: Ini adalah fungsi "konstruktor" atau "cetakan utama". Semua perintah untuk addHost atau addSwitch akan diletakkan di dalam sini.
- `topos = { ... }`: Ini adalah "daftar isi" untuk Mininet. Baris ini memberitahu Mininet, "Jika seseorang menjalankan perintah `--topo mylinear`, tolong gunakan kelas LinearTopo yang ada di file ini."

### **Tahap 2: Menambahkan Komponen (Nodes & Links)**

#### **1. Buka File Python Anda**
```bash
nano ~/mininet/custom/linear_custom.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

#### **2. Ganti Kode dengan Versi Lengkap Ini**
```code
#!/usr/bin/python

"""
Skrip Topologi Linear Kustom (Level Hard)
Tujuan: Membuat 3Switch & 3Host menggunakan loop
Struktur:
Setiap host terhubung ke switchnya h1=>s1, h2=>s2, h3=>s3.
Semua switch terhubung berantai s1=>s2, s2=>s3.
"""

from mininet.topo import Topo

class LinearTopo( Topo ):
    "Topologi linear kustom N=3 dengan loop."

    def __init__( self ):
        "Membuat topologi linear kustom."

        # Inisialisasi topologi
        Topo.__init__( self )

        # --- Mulai penambahan kode ---
        
        # Tentukan jumlah switch/host yang kita inginkan
        N = 3

        # Kita butuh "kantong" untuk menyimpan host dan switch
        # yang kita buat di dalam loop
        switches = []
        hosts = []

        # Loop 1: Buat semua switch dan host
        # 'i' akan berisi 0, lalu 1, lalu 2
        for i in range( N ):
            # Buat host (h1, h2, h3)
            h = self.addHost( f'h{i+1}' )
            hosts.append(h)
            
            # Buat switch (s1, s2, s3)
            s = self.addSwitch( f's{i+1}' )
            switches.append(s)

            # Sambungkan host ke switch-nya masing-masing
            # (h1-s1), (h2-s2), (h3-s3)
            self.addLink( h, s )

        # Loop 2: Sambungkan switch secara berantai
        # Kita hanya perlu loop N-1 kali (2 kali)
        for i in range( N - 1 ):
            # Sambungkan switch[i] ke switch[i+1]
            # Saat i=0: sambungkan switches[0] (s1) ke switches[1] (s2)
            # Saat i=1: sambungkan switches[1] (s2) ke switches[2] (s3)
            self.addLink( switches[i], switches[i+1] )
        
        # --- Selesai penambahan kode ---


# Baris WAJIB
topos = { 'mylinear': ( lambda: LinearTopo() ) }
```
Hapus semua isi file lama dan ganti dengan kode di atas ini.

#### **3. Simpan dan Keluar**
Tekan `Ctrl + O` (tahan Ctrl lalu tekan O) untuk menyimpan.
Tekan `Enter` untuk mengonfirmasi nama file.
Tekan `Ctrl + X` untuk keluar dari nano.

#### **Penjelasan Kode (Materi Dikit):**

- `N = 3`: Kita membuat variabel agar jika nanti Anda ingin membuat 10 switch, Anda tinggal ganti angka ini menjadi `10`.
- `switches = []`: Kita membuat `"daftar belanja"` kosong untuk menampung semua switch yang kita buat.
- `for i in range( N )`: Ini adalah inti dari looping. Python akan mengulangi kode di bawahnya sebanyak `N` kali (3 kali). Variabel `i` akan bernilai `0`, lalu `1`, lalu `2`.
- `f'h{i+1}'`: Ini disebut `"f-string"`. Ini adalah cara canggih untuk membuat nama.
  - Saat `i=0`, ` i+1` adalah `1`, jadi namanya menjadi `'h1'`.
  - Saat `i=1`, ` i+1` adalah `2`, jadi namanya menjadi `'h2'`.
- `switches.append(s)`: Memasukkan switch `s` yang baru dibuat ke dalam `"daftar belanja"` switches kita.
- `for i in range( N - 1 )`: Ini adalah `loop kedua`. Untuk 3 switch, kita hanya butuh `2 "kabel"` penghubung `(s1-s2 dan s2-s3)`. Karena itu kita loop `N-1` (atau 2) kali.
- `self.addLink( switches[i], switches[i+1] )`: Ini adalah bagian paling cerdas. Kita mengambil switch dari `"daftar belanja"` kita.
  - Saat `i=0`: `switches[0]` (s1) disambungkan ke `switches[1]` (s2).
  - Saat `i=1`: `switches[1]` (s2) disambungkan ke `switches[2]` (s3).

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
sudo mn --custom ~/mininet/custom/linear_custom.py --topo mylinear --switch ovs,protocols=OpenFlow14 --controller remote,ip=127.0.0.1,port=6653
```

#### **3. Verifikasi Total**
##### Layar 1: Komputer Utama Anda (Web UI)
###### Buka browser Anda dan Refresh halaman ONOS (http://192.168.20.1:8181/onos/ui).
###### `BOOM!` Anda akan melihat topologi rantai 3-switch yang baru saja Anda buat secara terprogram.
##### Layar 2: Terminal Mininet Anda (CLI)
###### Di dalam mininet>, jalankan tes konektivitas:
```bash
mininet> pingall
```
Hasilnya akan sukses `0% dropped`. Ini membuktikan `h1` bisa mengirim ping ke `h3` dengan melompati `s2`, berkat routing cerdas dari ONOS.

#### **Penjelasan Kode (Materi Dikit):**

- `--custom ~/mininet/custom/linear_custom.py`: Ini adalah perintah yang memberitahu Mininet, "Jangan pakai topologi bawaanmu. Tolong muat 'cetakan' dari file ini."
- `--topo mylinear`: Ini adalah perintah yang memberitahu Mininet, "Dari dalam file itu, tolong gunakan 'cetakan' yang bernama 'mylinear'." (Ingat, nama ini kita definisikan di baris `topos = { ... }`).

-----

### Pencapaian Anda
- [x] (Custom EZ): Berhasil membuat file .py untuk topologi single.
- [x] (Custom Beginner): Berhasil membuat file .py untuk topologi tree manual.
- [x] (Custom Hard): Berhasil menggunakan looping Python untuk membuat topologi linear secara terprogram.
- [ ] Mengenal Lebih mendalam (Konsep Virtualisasi Jaringan VPLS)

----