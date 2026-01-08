---
title: "Tahapan 08: VPLS (Private Connectivity) and QoS (Quality of Service Analysis)"
date: "2025-11-04"
category: "Course"
tags: ["mininet-series"]
---

<iframe src="https://www.youtube.com/embed/IkT2eJtU_Dc?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap  Mininet di Hyper-V (Part 8): VPLS (Private Connectivity) and QoS (Quality of Service Analysis)

## 🚀 Pendahuluan
**`Mininet`** adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.</br>

**`ONOS`** (Open Network Operating System) adalah sistem operasi yang dirancang untuk membantu penyedia layanan jaringan membangun jaringan berbasis perangkat lunak (SDN) dengan tingkat skalabilitas, ketersediaan, dan kinerja yang tinggi. ONOS berfungsi sebagai kontroler SDN yang mengelola komponen jaringan seperti switch dan link, serta menjalankan program perangkat lunak untuk menyediakan layanan komunikasi kepada perangkat akhir dan jaringan sekitarnya. Dengan arsitektur modularnya, ONOS memungkinkan penyesuaian yang lebih mudah dan meningkatkan ketersediaan jaringan.</br>

**`Topologi Linear (Daisy Chain)`** **Topologi Linear (Daisy Chain) pada SDN** adalah jenis topologi jaringan di mana setiap `node (perangkat)` terhubung langsung ke node berikutnya dalam `satu garis lurus`. Dalam pengaturan ini, data ditransmisikan dari satu perangkat ke perangkat lainnya secara berurutan hingga mencapai tujuan akhir. Topologi ini mirip dengan `sirkuit seri dalam listrik`, di mana `satu kegagalan pada node` dapat mempengaruhi seluruh jaringan.</br>

**Kelebihan**: </br>
- **Ekspansi Mudah**: Menambahkan perangkat baru ke dalam jaringan dapat dilakukan dengan mudah tanpa mempengaruhi perangkat lain. </br>
- **Biaya Rendah**: Menggunakan beberapa sakelar kecil dalam rantai bisa lebih hemat biaya dibandingkan dengan menggunakan sakelar besar dan berkapasitas tinggi. </br>
- **Fleksibilitas**: Konfigurasi ini memungkinkan penempatan perangkat di lokasi yang berbeda dalam rantai.</br>

**Kekurangan**: </br>
- **Risiko Kegagalan**: Jika satu node mengalami kegagalan, hal ini dapat mengganggu seluruh komunikasi dalam jaringan.</br>
- **Keterbatasan Bandwidth**: Setiap perangkat dalam rantai berbagi bandwidth yang sama, sehingga semakin banyak perangkat yang terhubung, semakin sedikit bandwidth yang tersedia untuk masing-masing perangkat. </br>
- **Kemacetan Data**: Jika satu perangkat dalam rantai memproses data lebih lambat, hal ini dapat menyebabkan kemacetan dan mengurangi efisiensi jaringan secara keseluruhan.</br>

**`QoS`** **QoS pada SDN (Software Defined Networking)** adalah metode yang digunakan untuk mengelola lalu lintas data dengan memberikan prioritas pada jenis lalu lintas tertentu. Dalam konteks SDN, QoS memungkinkan pengelolaan sumber daya jaringan untuk meningkatkan kualitas layanan, seperti mengurangi *kehilangan paket*, *latensi*, dan *jitter*. Dengan QoS, aplikasi yang sensitif terhadap keterlambatan, seperti *panggilan suara* dan *video*, dapat mendapatkan akses yang lebih baik ke sumber daya jaringan, sehingga memastikan **kinerja yang optimal dan kualitas** layanan yang lebih baik.</br>

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [ONOS](https://wiki.onosproject.org/display/ONOS/ONOS)
- [Docker ONOS](https://hub.docker.com/r/onosproject/onos/)
- [Github Ref](https://github.com/ArnoTroch/ONOS-Tutorial/blob/main/README.md)

---

## **🛠️ TAHAP 1: Script Topologi (Python)**

### **1. Persiapan & Pembersihan**
```bash
sudo mn -c
docker stop onos
docker rm onos
```
Untuk Membersihkan sisa proyek mininet dan onos.

### **2. Buat File Topologi (`vpls_qos.py`)**
```bash
touch ~/mininet/custom/vpls_qos.py
```
Pertama, buat file` .py` baru di dalam direktori `mininet/custom`. Mari kita beri nama `vpls_qos.py`.

### **3. Buka File Python Anda**
```bash
nano ~/mininet/custom/vpls_qos.py
```
Gunakan editor `nano` untuk mengedit file yang sudah Anda buat.

### **4. Code Topologi**
Topologi ini didesain pas: `5 Switch`, `11 Host`.

```code
#!/usr/bin/python

"""
Script Topologi Final Task
- 11 Host, 5 Switch (Linear Topology)
- Menggunakan TCLink untuk membatasi Bandwidth, Delay, Jitter, dan Loss
- Tujuan: Simulasi VPLS dan Pengukuran QoS
"""

from mininet.topo import Topo
from mininet.link import TCLink

class VplsQos( Topo ):
    "Topologi Linear 5 Switch 11 Host dengan Limitasi QoS"

    def __init__( self ):
        Topo.__init__( self )

        # --- BAGIAN 1: MEMBUAT SWITCH (5 Buah) ---
        # Switch disusun berurutan s1 sampai s5
        s1 = self.addSwitch('s1')
        s2 = self.addSwitch('s2')
        s3 = self.addSwitch('s3')
        s4 = self.addSwitch('s4')
        s5 = self.addSwitch('s5')

        # --- BAGIAN 2: MEMBUAT HOST (11 Buah) ---
        h1 = self.addHost('h1'); h2 = self.addHost('h2')
        h3 = self.addHost('h3'); h4 = self.addHost('h4')
        h5 = self.addHost('h5'); h6 = self.addHost('h6')
        h7 = self.addHost('h7'); h8 = self.addHost('h8')
        h9 = self.addHost('h9'); h10 = self.addHost('h10'); h11 = self.addHost('h11')

        # --- BAGIAN 3: LINK HOST KE SWITCH (ACCESS LINK) ---
        # Link ini kita buat cepat (100Mbps) dan stabil
        # Agar bottleneck murni terjadi di antar switch
        access_link = dict(bw=100, delay='1ms', loss=0, use_htb=True)
        
        # S1 handle h1, h2
        self.addLink(h1, s1, **access_link)
        self.addLink(h2, s1, **access_link)
        
        # S2 handle h3, h4
        self.addLink(h3, s2, **access_link)
        self.addLink(h4, s2, **access_link)

        # S3 handle h5, h6
        self.addLink(h5, s3, **access_link)
        self.addLink(h6, s3, **access_link)

        # S4 handle h7, h8
        self.addLink(h7, s4, **access_link)
        self.addLink(h8, s4, **access_link)

        # S5 handle h9, h10, h11 (3 Host di ujung)
        self.addLink(h9, s5, **access_link)
        self.addLink(h10, s5, **access_link)
        self.addLink(h11, s5, **access_link)

        # --- BAGIAN 4: LINK ANTAR SWITCH (BACKBONE LINK) ---
        # INI KUNCI QOS-NYA!
        # Kita batasi BW 20Mbps, Delay 5ms, Jitter 2ms, Loss 1%
        # use_htb=True agar limitasi bandwidth lebih akurat
        backbone_link = dict(bw=20, delay='5ms', jitter='2ms', loss=1, use_htb=True)
        
        self.addLink(s1, s2, **backbone_link)
        self.addLink(s2, s3, **backbone_link)
        self.addLink(s3, s4, **backbone_link)
        self.addLink(s4, s5, **backbone_link)

# Registrasi topologi agar bisa dipanggil dengan --topo final
topos = { 'vplsqos': ( lambda: VplsQos() ) }
```
- *Perhatikan bagian `linkopts_backbone`. Di situlah kita "menyabotase" jaringan agar punya `delay` dan `loss` (untuk bahan `ukur QoS`).*

## **🚀 TAHAP 2: Eksekusi Mininet & ONOS**
### **Langkah 1: Jalankan Docker (Tanpa fwd)**
```bash
docker run -d -p 6653:6653 -p 8181:8181 -p 8101:8101 -e ONOS_APPS=drivers,openflow,gui2 --name onos onosproject/onos:2.6-latest
```

### **Langkah 2: Jalankan Topologi Mininet**
```bash
sudo mn --custom /home/mininet/mininet/custom/vpls_qos.py --topo vplsqos --controller remote,ip=127.0.0.1 --switch ovs,protocols=OpenFlow14 --link=tc
```

- *Jalankan `pingall` -> Harus `100% Dropped`.*

## **⚙️ TAHAP 3: Konfigurasi ONOS**
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

### **Langkah 1: Cek App**
```bash
apps -a -s
```
- (Pastikan `fwd` TIDAK ADA, `vpls` BELUM ADA).

### **Langkah 2: Hidupkan App VPLS**
```bash
app activate org.onosproject.vpls
```
- (Tunggu sampai `Activated`).

### **Langkah 3: Daftarkan Interface (Port Mapping)**
```bash
vpls clean
```
```bash
interface-add of:0000000000000001/1 h1
```
```bash
interface-add of:0000000000000003/1 h5
```
```bash
interface-add of:0000000000000005/3 h11
```
- *Verifikasi: Ketik interfaces. Sekarang harusnya sudah muncul 3 baris.*

### **Langkah 4: Membuat Network VPLS**
Membuat instance VPLS bernama VPLS_DEMO dan memasukkan ketiga host tadi ke dalamnya.
```bash
vpls create VPLS_DEMO
```

### **Langkah 5: Daftarkan Interface ke VPLS**
```bash
vpls add-if VPLS_DEMO h1
```
```bash
vpls add-if VPLS_DEMO h5
```
```bash
vpls add-if VPLS_DEMO h11
```

#### **Dan Melihat Hasil add Interface tersebut pada tiap" VPLS**
```bash
vpls list
```
- Untuk melihat List" VPLS yang sudah di `create`.
```bash
vpls show
```
- *(Pastikan outputnya menunjukkan VPLS_DEMO memiliki member h1, h5, dan h11).*

### **Langkah 6: Verifikasi (Final)**
Kembali ke **`mininet>`**.
```bash
pingall
```

### **6. Testing**
*Sekarang konfigurasi sudah selesai. Mari kita coba ping antar `host VPLS yang berjauhan`, dari `h1 (Switch 1)` ke `h11 (Switch 5)`.*
#### **Testing Pertama**
```bash
h1 ping -c 3 h11
```
- *`TARGET:` Harus `REPLY` (Mungkin ping pertama loss buat ARP, tapi selanjutnya reply).*

*Untuk membuktikan `isolasi`, saya coba ping dari `h1 ke h2`. Padahal `satu switch`, tapi `h2` tidak masuk VPLS, jadi harusnya gagal.*
#### **Testing Kedua**
```bash
h1 ping -c5 h2
```
- *`TARGET:` Harus `100% Packet Loss`.*

## **📊 TAHAP 4: Pengujian & QoS**
### **1\. Mengukur DELAY (Latency)**
Di `mininet>`:

```bash
h1 ping -c 5 h2
```
  * **Lihat output `time=... ms`.**
  * Itu adalah **Delay**.

### **2\. Mengukur PACKET LOSS**
Di `mininet>`:
```bash
h1 ping -c 20 h2
```
  * Lihat hasil akhir `...% packet loss`.
  * Itu adalah **Packet Loss**.

Kita akan menggunakan fitur **Background Process (`&`)** linux langsung di dalam prompt Mininet.
Ikuti langkah ini persis:

### **3\. Mengukur THROUGHPUT (Bandwidth)**
#### **Langkah 1: Jalankan Server di Background (h11)**
Kita suruh `h11` menjadi server, dan taruh di belakang layar (`&`) supaya terminal tidak macet.

Ketik di `mininet>`:
```bash
h11 iperf3 -s &
```
*(Tidak akan muncul output apa-apa, itu tandanya berhasil jalan diam-diam).*

#### **Langkah 2: Ukur THROUGHPUT (TCP Mode)**
Sekarang `h1` menembak ke `h11`.

Ketik di `mininet>`:
```bash
h1 iperf3 -c 10.0.0.11 -t 5
```
  * Tunggu 10 detik.
  * Lihat kolom **Bitrate**.

### **4\. Mengukur JITTER**
TCP tidak punya Jitter. Kita harus pakai UDP (`-u`). Kita tembak bandwidth 10Mbps (`-b 10M`).

Ketik di `mininet>`:
```bash
h1 iperf3 -c 10.0.0.11 -u -b 10M -t 5
```
  * Tunggu 10 detik.
  * Lihat hasil akhir di tabel paling bawah:
      * Kolom **Jitter**: Lihat angkanya (ms).
      * Kolom **Lost/Total Datagrams**: Ini Packet Loss versi data stream.

### **5\. Matikan Server (Penting\!)**
Setelah selesai, kita harus mematikan proses iperf3 yang jalan diam-diam di `h11` tadi.

Ketik di `mininet>`:
```bash
h11 pkill iperf3
```
---

## **📊 Analisa Hasil QoS**
- *Data ini membuktikan bahwa skenario `Linear Topology` + `Lossy Link` berhasil total.*

### 1. Packet Loss: Matematika-nya Pas!
* **Config:** Loss 1% per link.
* **Hasil UDP:** 3.7% Loss.
* **Analisa:**
Kenapa 3.7% padahal settingnya 1%? Karena h1 ke h11 melewati **4 Link Backbone** (S1→S2→S3→S4→S5).
Kalau setiap lompatan ada kemungkinan gagal 1%, maka total kegagalan di ujung menumpuk.
*Hitungan kasar:* `1% x 4 link = 4%`.
Hasil `Kasus Saya` **3.7%** itu **sangat akurat secara statistik!** Ini bukan error, ini bukti simulasi `Kasus Saya` jalan.

### 2. Throughput TCP (Bitrate): 2.12 Mbits/sec
* **Config:** Limit 20 Mbps.
* **Hasil:** ~2 Mbps.
* **Analisa:**
*"Kenapa kecil banget? Katanya 20 Mbps?"*
Jawabannya: **TCP sangat benci Packet Loss.**
Ketika ada packet loss 3.7% (seperti data UDP tadi), protokol TCP menganggap jaringan sedang macet parah. TCP otomatis "menginjak rem" (memperkecil Window Size). Ditambah lagi laptop yang *lagging*, proses *acknowledgement* (ACK) jadi telat.
**Kesimpulan:** Jaringan VPLS `Kasus Saya` stabil secara koneksi, tapi kualitasnya "buruk" karena noise (loss/jitter), sesuai dengan skenario yang kita buat.

### 3. Jitter: 2.692 ms
* **Config:** 2ms.
* **Hasil:** ~2.7 ms.
* **Analisa:**
Ini hasil yang sangat presisi. Selisih 0.6ms adalah wajar karena *processing delay* di dalam virtual switch dan antrian CPU laptop.

---

**The Result:** *"Hasil iperf menunjukkan Loss 3.7% karena akumulasi dari 4 switch, dan Jitter stabil di 2.7ms. Ini membuktikan QoS limiting di Mininet berfungsi."*