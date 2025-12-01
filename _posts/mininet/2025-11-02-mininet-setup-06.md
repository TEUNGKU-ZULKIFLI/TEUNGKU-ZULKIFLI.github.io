---
title: "Tahapan 06: Topology VPLS EZ"
date: "2025-11-02"
category: "Course"
tags: ["mininet-series"]
---

<iframe src="https://www.youtube.com/embed/rrYD4ofdjco?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 6): TOPOLOGY VPLS EZ

## 🚀 Pendahuluan
**`Mininet`** adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.</br>

**`ONOS`** (Open Network Operating System) adalah sistem operasi yang dirancang untuk membantu penyedia layanan jaringan membangun jaringan berbasis perangkat lunak (SDN) dengan tingkat skalabilitas, ketersediaan, dan kinerja yang tinggi. ONOS berfungsi sebagai kontroler SDN yang mengelola komponen jaringan seperti switch dan link, serta menjalankan program perangkat lunak untuk menyediakan layanan komunikasi kepada perangkat akhir dan jaringan sekitarnya. Dengan arsitektur modularnya, ONOS memungkinkan penyesuaian yang lebih mudah dan meningkatkan ketersediaan jaringan.</br>

**`Topology`** Topologi mengacu pada bagaimana suatu jaringan diorganisasikan. Setiap jaringan terdiri dari node yang berbeda dan node ini terhubung satu sama lain dengan link. Tautan ini dapat didefinisikan baik secara fisik maupun logis. Dengan kata lain, topologi adalah desain atau tata letak dari elemen-elemen jaringan, termasuk komputer, server, printer, router, dan perangkat lainnya, serta bagaimana mereka terhubung.</br>

**`VPLS`** VPLS (Virtual Private LAN Service) adalah teknologi jaringan yang memungkinkan koneksi satu atau lebih jaringan area lokal (LAN) melalui internet melalui satu koneksi jembatan tunggal. VPLS menggunakan protokol switching label untuk menyediakan antarmuka Ethernet kepada pelanggan, sehingga memungkinkan mereka untuk memiliki akses ke internet dan mengelola informasi jaringan mereka sendiri. VPLS mendukung berbagai jenis konektivitas jaringan, termasuk titik-ke-titik dan multipoint-to-point, dan memungkinkan pelanggan untuk terhubung ke LAN virtual dari lokasi yang berbeda.</br>

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [ONOS](https://wiki.onosproject.org/display/ONOS/ONOS)
- [Docker ONOS](https://hub.docker.com/r/onosproject/onos/)
- [Github Ref](https://github.com/ArnoTroch/ONOS-Tutorial/blob/main/README.md)

---

## 🎯 Tujuan & Konsep
- Tujuan kita di tahap ini adalah mengonfigurasi `vpls` kedalam sebuah topology.

---

## 🧰 Prasyarat
- Windows 11 Pro atau Enterprise (Hyper-V hanya tersedia di edisi ini).
- Hyper-V sudah aktif (bisa diaktifkan lewat "Turn Windows features on or off").
- Koneksi internet untuk update dan instalasi paket.
- Sudah ada VM mininet [`Belum Ada ?👆🏻`](https://teungku-zulkifli.github.io/article.html?post=_posts/kuliah/2035-10-10-mininet-setup-01.md)
- Sudah bisa remote VM Mininet

---

## **🛠️ Langkah-langkah Eksekusi**

### **1. Persiapan & Pembersihan**
```bash
sudo mn -c
docker stop onos
docker rm onos
```
Untuk Membersihkan sisa proyek mininet dan onos.

### **2. Buat File Topologi (`vpls.py`)**
```bash
touch ~/mininet/custom/vpls.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `vpls.py`.

### **3. Buka File Python Anda**
```bash
nano ~/mininet/custom/vpls.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

### **4. Code Topologi**
Topologi ini didesain pas: `4 Switch`, `5 Host`, dan tepat `10 Kabel (Link)`.

```code
#!/usr/bin/python
from mininet.topo import Topo

class  VplsTopo( Topo ):
    "Topologi Penerapan VPLS: 4 Switch, 5 Host, 10 Link"

    def __init__( self ):
        Topo.__init__( self )

        # 1. Buat 4 Switch
        s1 = self.addSwitch('s1')
        s2 = self.addSwitch('s2')
        s3 = self.addSwitch('s3')
        s4 = self.addSwitch('s4')

        # 2. Buat 5 Host
        h1 = self.addHost('h1')
        h2 = self.addHost('h2')
        h3 = self.addHost('h3')
        h4 = self.addHost('h4')
        h5 = self.addHost('h5')

        # 3. Total 10 Link (5 Host-Switch + 5 Switch-Switch)
        
        # Link Host ke Switch (5 Link)
        self.addLink(h1, s1) # s1 port 2 (karena port 1 utk switch)
        self.addLink(h2, s2) 
        self.addLink(h3, s3)
        self.addLink(h4, s4)
        self.addLink(h5, s1) # h5 juga di s1

        # Link Antar Switch (5 Link - Mesh/Ring)
        self.addLink(s1, s2)
        self.addLink(s2, s3)
        self.addLink(s3, s4)
        self.addLink(s4, s1)
        self.addLink(s1, s3) # Diagonal

topos = { 'myvpls': ( lambda:  VplsTopo() ) }
```

### **5. Eksekusi Langkah-demi-Langkah**
#### **Langkah 1: Jalankan Docker (Tanpa fwd)**
```bash
docker run -d -p 6653:6653 -p 8181:8181 -p 8101:8101 -e ONOS_APPS=drivers,openflow,gui2 --name onos onosproject/onos:2.6-latest
```

#### **Langkah 2: Jalankan Topologi Mininet**
```bash
sudo mn --custom ~/mininet/custom/vpls.py --topo urgent --switch ovs,protocols=OpenFlow14 --controller remote,ip=127.0.0.1,port=6653
```

- *Cek `links` di mininet, pastikan ada 10 item OK. Jalankan `pingall` -> Harus `100% Dropped`.*

#### **Langkah 3: Masuk ONOS CLI**
Buka terminal baru:

```bash
ssh -p 8101 onos@127.0.0.1
```
- Pastinya ini muncul Warning kan? `OKE` Lanjut `ke bawah ini`

```bash
sudo rm -rf /home/mininet/.ssh/known_hosts
```
- Untuk menghapus hasil `key ssh` kemaren **(pada saat sebelum menghapus container onos terdahulu)**

- dan melanjutkan dengan masuk ssh onos lagi! Bingung yang mana? **`Langkah 3: brother`**
- Jangan Lupa Password: `rocks`

#### **Langkah 4: Cek App**
```bash
apps -a -s
```
- (Pastikan `fwd` TIDAK ADA, `vpls` BELUM ADA).

#### **Langkah 5: Hidupkan App VPLS**
```bash
app activate org.onosproject.vpls
```
- (Tunggu sampai `Activated`).

#### **Langkah 6: Daftarkan Interface (Port Mapping)**
```bash
vpls clean
```
```bash
interface-add of:0000000000000001/1 h1
```
```bash
interface-add of:0000000000000002/1 h2
```
```bash
interface-add of:0000000000000003/1 h3
```
```bash
interface-add of:0000000000000004/1 h4
```
```bash
interface-add of:0000000000000001/2 h5
```

#### **Langkah 7: Membuat VPLS (VPLS1 & VPLS2)**
Kita pisahkan jaringan mereka.

```bash
vpls create VPLS1
vpls create VPLS2
```

#### **Langkah 8: Daftarkan Interface ke VPLS**
##### **VPLS1: h1, h3, h4 (Satu Grup)**
```bash
vpls add-if VPLS1 h1
vpls add-if VPLS1 h3
vpls add-if VPLS1 h4
```

##### **VPLS2: h2, h5 (Satu Grup)**
```bash
vpls add-if VPLS2 h2
vpls add-if VPLS2 h5
```

##### **Dan Melihat Hasil add Interface tersebut pada tiap" VPLS**
```bash
vpls list
```
- Untuk melihat List" VPLS yang sudah di `create`.
```bash
vpls show
```
- Untuk Melihat Isian `Host` pada `Tiap" VPLS` Tersebut.

#### **Langkah 9: Verifikasi (Final)**
Kembali ke **`mininet>`**.
```bash
pingall
```

### **6. Testing**

#### **Testing Pertama**
- Ping Device `VPLS1`
```bash
h1 ping -c5 h3
```
```bash
h3 ping -c5 h4
```
```bash
h4 ping -c5 h1
```

- Ping Device `VPLS2`
```bash
h2 ping -c5 h5
```
```bash
h5 ping -c5 h2
```

#### **Testing Kedua**
- Ping **Host** `VPLS1` dengan **Host** `VPLS2`
- Pastikan `Gagal` atau `Uncharable` atau **apalah itu namanya**.
```bash
h1 ping -c5 h2
```
```bash
h1 ping -c5 h5
```

#### **Pokonya mah kek gini kira"**
`h1` <-> `h2` : SUKSES (VPLS1)

`h1` <->` h4` : SUKSES (VPLS1)

`h2` <-> `h5` : SUKSES (VPLS2)

`h1` <-> `h2` : GAGAL (Beda VPLS)

### **🥳 Selamat Kamu sudah Berhasil mengonfigurasikan VPLS dalam sebuah Topo**