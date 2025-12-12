---
title: "Tahapan 07: Praktikum QoS (Quality of Service)"
date: "2025-11-03"
category: "Course"
tags: ["mininet-series"]
---

<iframe src="https://www.youtube.com/embed/XnEqtm8Ou8c?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 7): Praktikum QoS (Quality of Service)

## 🚀 Pendahuluan
**`Mininet`** adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.</br>

**`ONOS`** (Open Network Operating System) adalah sistem operasi yang dirancang untuk membantu penyedia layanan jaringan membangun jaringan berbasis perangkat lunak (SDN) dengan tingkat skalabilitas, ketersediaan, dan kinerja yang tinggi. ONOS berfungsi sebagai kontroler SDN yang mengelola komponen jaringan seperti switch dan link, serta menjalankan program perangkat lunak untuk menyediakan layanan komunikasi kepada perangkat akhir dan jaringan sekitarnya. Dengan arsitektur modularnya, ONOS memungkinkan penyesuaian yang lebih mudah dan meningkatkan ketersediaan jaringan.</br>

**`Topologi Dumbbell`** **Topologi Dumbbell (Barbel) pada SDN** adalah arsitektur jaringan yang memanfaatkan dua node utama yang saling terhubung melalui satu kabel. Dalam topologi ini, data mengalir dari node ke node melalui kabel yang terputus, sehingga setiap node dapat berkomunikasi langsung dengan node pusat.</br>

**Kelebihan**: Sederhana dalam instalasi dan memungkinkan pengelolaan yang efisien karena setiap node hanya terhubung langsung ke node pusat. </br>

**Kekurangan**: Jika satu kabel terputus, semua node akan terganggu, sehingga penting untuk memastikan ketersediaan kabel.</br>

Topologi ini sering digunakan dalam jaringan komputer untuk memastikan keandalan dan efisiensi dalam pengiriman data..</br>

**`QoS`** **QoS pada SDN (Software Defined Networking)** adalah metode yang digunakan untuk mengelola lalu lintas data dengan memberikan prioritas pada jenis lalu lintas tertentu. Dalam konteks SDN, QoS memungkinkan pengelolaan sumber daya jaringan untuk meningkatkan kualitas layanan, seperti mengurangi *kehilangan paket*, *latensi*, dan *jitter*. Dengan QoS, aplikasi yang sensitif terhadap keterlambatan, seperti *panggilan suara* dan *video*, dapat mendapatkan akses yang lebih baik ke sumber daya jaringan, sehingga memastikan **kinerja yang optimal dan kualitas** layanan yang lebih baik.</br>

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [ONOS](https://wiki.onosproject.org/display/ONOS/ONOS)
- [Docker ONOS](https://hub.docker.com/r/onosproject/onos/)
- [Github Ref](https://github.com/ArnoTroch/ONOS-Tutorial/blob/main/README.md)

---

### 1\. Materi: Teori Dasar QoS (Apa yang Kita Ukur?)

Bayangkan jaringan (kabel switch) Anda adalah sebuah **Pipa Air**.

#### A. Throughput (Debit Air)

  * **Definisi:** Seberapa banyak data yang *berhasil* sampai dari A ke B dalam satu detik.
  * **Satuan:** Mbps (Megabits per second) atau Gbps.
  * **Analogi:** Seberapa deras air yang keluar dari ujung selang.
  * **Di SDN:** Kita akan ukur seberapa kuat Switch OVS dan Link Mininet mengirim data sebelum "tersedak".

#### B. Packet Loss (Air Tumpah)

  * **Definisi:** Persentase paket yang dikirim tapi **hilang** di tengah jalan (tidak sampai).
  * **Satuan:** Persen (%).
  * **Penyebab:** Jaringan penuh (Congestion), kabel rusak, atau Switch *overload*.
  * **Di SDN:** Jika kita membanjiri link 10Mbps dengan data 20Mbps, paket akan mulai *dropped*.

#### C. Delay / Latency (Waktu Tempuh)

  * **Definisi:** Waktu yang dibutuhkan paket untuk pergi dari A ke B (One-way) atau bolak-balik (RTT - Round Trip Time).
  * **Satuan:** ms (millisecond).
  * **Analogi:** Berapa detik waktu yang dibutuhkan air sejak keran dibuka sampai airnya keluar di ujung selang.

#### D. Jitter (Kestabilan Arus)

  * **Definisi:** Variasi dari Delay. Kadang cepat, kadang lambat.
  * **Satuan:** ms (millisecond).
  * **Analogi:** Apakah airnya mengalir lancar (Jitter rendah) atau "muncrat-muncrat" tersendat (Jitter tinggi)? Ini musuh utama VoIP dan Video Call.

-----

### 2\. Skenario Praktikum: Apa yang Kita QoS?

Di Mininet, switch (OVS) itu sangat kuat karena software-based. Jika kita hanya pakai topologi biasa, hasilnya akan "terlalu bagus" (Throughput max, Loss 0%, Jitter 0ms). Itu tidak seru dan tidak bisa diukur.

Untuk melihat QoS bekerja, kita harus **Membatasi Jaringan** (Limiting). Kita akan menggunakan fitur Mininet bernama **`TCLink`** (Traffic Control Link).

**Skenario:**
Kita akan membuat "Jalan Sempit" di antara dua switch. Lalu kita paksa data besar lewat sana. Di situlah kita akan melihat Packet Loss dan Jitter muncul.

-----

### 3\. Rancang Bangun Topologi (Dumbbell Topology)

Untuk pengujian QoS, topologi terbaik bukanlah yang rumit, tapi yang **terisolasi**. Saya menyarankan topologi **Dumbbell (Barbel)**.

**Struktur:**
`Server(h1) --[Link Cepat]-- (s1) --[JALAN SEMPIT]-- (s2) --[Link Cepat]-- Client(h2)`

  * **h1 (Server):** Pengirim Traffic (Video/File).
  * **h2 (Client):** Penerima yang mengukur kualitas.
  * **Link s1-s2 (Bottleneck):** Kita akan set Bandwidth misal **10 Mbps**, Delay **5ms**, Loss **1%**.

---

## 🎯 Tujuan & Konsep
- Tujuan kita di tahap ini adalah melihat `QoS` berkerja.
- Kita akan menggunakan alat bernama `iperf3` untuk `Throughput`, `Jitter`, dan `Packet Loss`. Dan kita akan menggunakan `ping` (dengan opsi timestamp) untuk `Delay`. Alat-alat ini berbasis CLI, ringan, dan jauh lebih akurat memberikan angka `QoS` dibandingkan membedah file `pcap Wireshark` secara manual.

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

### **2. Buat File Topologi (`qos_topo.py`)**
```bash
touch mininet/custom/qos_topo.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `qos_topo.py`.

### **3. Buka File Python Anda**
```bash
nano mininet/custom/qos_topo.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

### **4. Code Topologi**
Code ini akan membuat `topologi Dumbbell (Barbel)`. `h1 (Client)` **<-->** `s1 <== JALUR TEST ==> s2` **<-->** `h2 (Server)`

```code
#!/usr/bin/python

"""
Skrip Topologi QoS (Dumbbell)
Untuk pengukuran Throughput, Jitter, Loss, Delay.
"""

from mininet.topo import Topo

class QoSTopo( Topo ):
    "Topologi Dumbbell dengan Link Terbatas (Bottleneck)."

    def __init__( self ):
        Topo.__init__( self )

        # 1. Buat 2 Switch
        s1 = self.addSwitch('s1')
        s2 = self.addSwitch('s2')

        # 2. Buat 2 Host (Client & Server)
        h1 = self.addHost('h1') # Pengirim / Client
        h2 = self.addHost('h2') # Penerima / Server

        # 3. KONEKSI KABEL (LINKS)
        
        # --- Link Lokal (Cepat & Stabil) ---
        # Dari Host ke Switch masing-masing.
        # Bandwidth 100Mbps, Delay 1ms (Sangat cepat)
        self.addLink(h1, s1, bw=100, delay='1ms')
        self.addLink(h2, s2, bw=100, delay='1ms')

        # --- LINK BOTTLENECK (Jalur yang Kita Ukur) ---
        # Ini adalah simulasi jaringan WAN / Internet yang jelek.
        # bw     = 10 Mbps (Kecil, supaya cepat penuh)
        # delay  = 20ms    (Ada jeda waktu)
        # jitter = 5ms     (Delay tidak stabil, naik turun +- 5ms)
        # loss   = 2       (2% paket akan sengaja dibuang/hilang)
        
        self.addLink(s1, s2, bw=10, delay='20ms', jitter='5ms', loss=2)

# Registrasi Topologi
topos = { 'qos': ( lambda: QoSTopo() ) }
```

### **5. Eksekusi Langkah-demi-Langkah**
#### **Langkah 1: Jalankan Docker**
```bash
docker run -d -p 6653:6653 -p 8181:8181 -p 8101:8101 -e ONOS_APPS=drivers,openflow,gui2,fwd --name onos onosproject/onos:2.6-latest
```
*(Tunggu 1 menit sampai ONOS siap).*

#### **Langkah 2: Jalankan Topologi Mininet**
```bash
sudo mn --custom mininet/custom/qos_topo.py --topo qos --switch ovs,protocols=OpenFlow14 --controller remote,ip=127.0.0.1,port=6653 --link=tc
```

- *Perhatikan ada flag `--link=tc` di akhir.*

#### **📊 Langkah 3: Pengujian & Pengukuran (The Real Deal)**
Setelah masuk ke prompt `mininet>`, kita akan mulai mengukur 4 parameter tadi.

#### **1\. Mengukur DELAY (Latency)**

Kita gunakan `ping`. Di kode tadi, kita set delay bottleneck 20ms. Ditambah link lokal 1ms + 1ms.
Secara teori, bolak balik (RTT) harusnya sekitar: (20+1+1) x 2 = **44ms**. Mari kita buktikan.

Di `mininet>`:

```bash
h1 ping -c 5 h2
```

  * **Lihat output `time=... ms`.**
  * Apakah mendekati 44-50 ms?
  * Itu adalah **Delay**.

#### **2\. Mengukur PACKET LOSS**

Di kode tadi, kita set `loss=2` (2%).
Di `mininet>`:

```bash
h1 ping -c 20 h2
```

  * Lihat hasil akhir `...% packet loss`.
  * Apakah ada sekitar 2% - 5% paket hilang?
  * Itu adalah **Packet Loss**.

Kita akan menggunakan fitur **Background Process (`&`)** linux langsung di dalam prompt Mininet.

Ikuti langkah ini persis:

#### **3\. Mengukur THROUGHPUT (Bandwidth)**
##### **Langkah 1: Jalankan Server di Background (h2)**
Kita suruh `h2` menjadi server, dan taruh di belakang layar (`&`) supaya terminal tidak macet.

Ketik di `mininet>`:

```bash
h2 iperf3 -s &
```

*(Tidak akan muncul output apa-apa, itu tandanya berhasil jalan diam-diam).*

##### **Langkah 2: Ukur THROUGHPUT (TCP Mode)**

Sekarang `h1` menembak ke `h2`.

Ketik di `mininet>`:

```bash
h1 iperf3 -c 10.0.0.2 -t 10
```

  * Tunggu 10 detik.
  * Lihat kolom **Bitrate**.
  * **Target:** Karena kita limit `bw=10` Mbps, hasilnya harusnya di sekitar **9.xx Mbits/sec**.

#### **4\. Mengukur JITTER**
TCP tidak punya Jitter. Kita harus pakai UDP (`-u`). Kita tembak bandwidth 5Mbps (`-b 5M`).

Ketik di `mininet>`:

```bash
h1 iperf3 -c 10.0.0.2 -u -b 5M -t 10
```

  * Tunggu 10 detik.
  * Lihat hasil akhir di tabel paling bawah:
      * Kolom **Jitter**: Lihat angkanya (ms). Di kode kita set 5ms.
      * Kolom **Lost/Total Datagrams**: Ini Packet Loss versi data stream.

#### **5\. Matikan Server (Penting\!)**
Setelah selesai, kita harus mematikan proses iperf3 yang jalan diam-diam di `h2` tadi.

Ketik di `mininet>`:

```bash
h2 pkill iperf3
```

---

### 📊 LAPORAN ANALISA QOS: DUMBBELL TOPOLOGY

**Konfigurasi Skenario (Yang Kita Set di Python):**
* Bandwidth: **10 Mbps**
* Delay: **20ms** (RTT ~40ms)
* Jitter: **5ms**
* Packet Loss: **2%**

#### 1. Analisa Throughput (Kecepatan)
* **Teori:** Link capacity adalah 10 Mbps.
* **Hasil TCP (Kasus Saya):** Rata-rata **3.17 Mbits/sec**.
* **Kenapa Rendah?**
    Ini adalah fenomena menarik! Padahal jalannya selebar 10 Mbps, kenapa mobil yang lewat cuma 3 Mbps?
    * **Jawabannya:** Karena **TCP Protocol**. TCP itu "sopan". Ketika dia mendeteksi ada paket yang hilang (Loss 2%), dia panik dan berpikir "Waduh, macet nih!". Maka TCP secara otomatis **menurunkan kecepatan** pengiriman data (Throttling) untuk mencegah kemacetan lebih parah.
    * **Kesimpulan:** Packet Loss kecil (2%) bisa menghancurkan kecepatan TCP secara signifikan.

#### 2. Analisa Packet Loss (Kehilangan Data)
* **Hasil UDP (Kasus Saya):** `82/4316 (1.9%)` -> **1.9% Loss**.
* **Hasil Ping (Kasus Saya):** `15% packet loss`.
* **Analisa:**
    * Hasil UDP (1.9%) sangat akurat dengan settingan kita (2%). Ini membuktikan `TCLink` bekerja sempurna.
    * Hasil Ping lebih tinggi (15%) karena ICMP (Ping) memiliki prioritas rendah dan sering dibuang duluan saat antrian switch penuh.

#### 3. Analisa Delay (Latency)
* **Teori:** 20ms (pergi) + 20ms (pulang) + overhead = **~42ms**.
* **Hasil Kasus Saya:** Rata-rata **44.343 ms**.
* **Kesimpulan:** **Sangat Akurat.** Delay injeksi berhasil.

#### 4. Analisa Jitter (Kestabilan)
* **Teori:** Kita set jitter 5ms.
* **Hasil Kasus Saya:** `3.902 ms` dan `4.841 ms`.
* **Kesimpulan:** **Sangat Akurat.** Angka ini menunjukkan delay paket naik-turun di kisaran 4-5ms, sesuai perintah kita.

---

### 🏁 KESIMPULAN AKHIR PRAKTIKUM QOS

Anda telah berhasil membuktikan bahwa di dunia SDN (Software Defined Network):
1.  Kita bisa **memanipulasi kualitas jaringan** secara software (menggunakan `TCLink` di Python).
2.  Kita bisa **mengukur dampaknya** secara presisi menggunakan `iperf3` dan `ping` via CLI.
3.  Anda melihat langsung bagaimana **Network Impairment** (Gangguan Jaringan) mempengaruhi aplikasi (Throughput drop drastis).

Praktikum QoS ini **COMPLETE & CLEARED.** 🏆