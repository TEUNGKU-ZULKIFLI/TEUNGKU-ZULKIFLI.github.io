---
title: "(Part 3): Konfigurasi NTP, SSH, DNS, DHCP Server"
date: "2025-09-26"
category: "Kuliah"
tags: ["debian-server-series", "debian-7", "wheezy", "linux"]
---

<iframe src="https://www.youtube.com/embed/9q8slK0ADcQ?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 3): Konfigurasi NTP, SSH, DNS, DHCP Server
**Catatan Perjalanan & Solusi Praktis untuk VM Debian 7.8.0 "Wheezy"**

---

## Pendahuluan 🚀

Selamat datang di catatan perjalanan saya dalam membangun sebuah server dari nol! Dokumen ini lebih dari sekadar terjemahan; ini adalah sebuah logbook praktis dari proses konfigurasi awal server **Debian 7.8.0 "Wheezy"**. Setiap langkah di dalamnya tidak hanya diriset, tetapi juga telah dipraktikkan, diuji, dan yang terpenting, dilengkapi dengan solusi untuk setiap masalah tak terduga yang muncul di tengah jalan.

Tujuannya adalah untuk menciptakan sebuah panduan yang jujur dan mudah diikuti, terutama bagi mereka yang mungkin menempuh jalur yang sama dengan perangkat lunak versi lama ini. Semoga catatan ini bisa menjadi peta yang berguna, menunjukkan bukan hanya jalan yang lurus, tetapi juga cara melewati setiap rintangan.

### Credits & Referensi

Proses ini tidak akan berjalan lancar tanpa sumber daya dan bantuan yang luar biasa. Kredit sepenuhnya diberikan kepada:

* **[Server-World](https://www.server-world.info/en/note?os=Debian_7.0)**: Sebagai referensi utama dan panduan dasar untuk semua tahapan konfigurasi. Panduan mereka yang komprehensif menjadi titik awal dari petualangan ini.
* **Gemini (Model AI Google)**: Sebagai mitra diskusi interaktif, asisten riset, dan "pengumpul data". Gemini membantu dalam menerjemahkan konsep, mendiagnosis masalah unik (seperti error GPG dan repositori arsip), serta menyusun penjelasan langkah demi langkah yang detail.

---

### **Panduan Lengkap - TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server (Bagian 1 dari 5)**

## Langkah 8: Membangun Fondasi Jaringan Dual-Adapter

### Tujuan

Misi kita di langkah ini adalah mengubah server kita dari yang tadinya memiliki satu "pintu" biasa, menjadi sebuah "pos jaga" canggih dengan dua gerbang terpisah:

1.  **Gerbang Depan (NAT / `eth1`):** Gerbang ini menghadap ke internet. Fungsinya untuk mengambil update, sinkronisasi waktu, dan semua kebutuhan server untuk "melihat dunia luar".
2.  **Gerbang Belakang (Host-Only / `eth0`):** Ini adalah gerbang pribadi, aman, dan rahasia yang hanya menghubungkan server dengan komputer Host (laptop/PC) kita. Semua aktivitas manajemen (seperti SSH) akan kita lakukan lewat gerbang ini.

Tujuannya adalah untuk meningkatkan keamanan secara drastis dan membangun arsitektur jaringan yang lebih realistis dan profesional.

### Langkah-langkah Eksekusi

**Langkah 0: Persiapan di Luar VM (Konfigurasi Jaringan Host-Only)**

Sebelum memberi alamat pada "Gerbang Belakang" kita, kita harus pastikan "jalan pribadi" menuju gerbang itu sudah dibangun di komputer Host. (Kita menggunakan IP `192.168.10.x` sesuai diskusi kita).

1.  Buka aplikasi **VirtualBox/VMWare/Hiper-V** (jendela utamanya).
2.  Klik `File` \> `Host Network Manager`.
3.  Pilih adapter yang ada (misal, `vboxnet0`), lalu klik `Properties`.
4.  Di tab **Adapter**, atur:
      * **IPv4 Address:** `192.168.10.10` (Ini alamat untuk komputer Host Anda di jaringan ini).
      * **IPv4 Network Mask:** `255.255.255.0`.
5.  Pindah ke tab **DHCP Server** dan **pastikan "Enable Server" TIDAK DICENTANG**. Kita ingin kendali penuh atas IP di jaringan ini.
6.  Klik `Apply` lalu `Close`.

**Langkah 1: Memasang "Dua Gerbang" di VM**

1.  Matikan VM Debian Anda secara aman dengan perintah `sudo shutdown -h now`.
2.  Di jendela utama VirtualBox/VMWare/Hiper-V, pilih VM Anda, klik **Settings \> Network**.
3.  Atur **Adapter 1**:
      * **Enable Network Adapter**: ✅ (Centang)
      * **Attached to**: `Host-only Adapter`
      * **Name**: Pilih nama adapter yang tadi kita siapkan (misal, `vboxnet0`).
4.  Pindah ke tab **Adapter 2**:
      * **Enable Network Adapter**: ✅ (Centang)
      * **Attached to**: `NAT`
5.  Klik **OK**.

**Langkah 2: Mengkonfigurasi "Peta Jaringan" di Debian**

1.  Nyalakan kembali VM Anda dan login (sebagai `teungku`, lalu `sudo su -`).

2.  Buat backup konfigurasi jaringan Anda:

    ```bash
    sudo cp /etc/network/interfaces /etc/network/interfaces.dual.backup
    ```

3.  Buka file konfigurasi:

    ```bash
    sudo nano /etc/network/interfaces
    ```

4.  Hapus semua isi file tersebut, lalu ganti dengan "peta jaringan" final kita di bawah ini. Inilah codingan yang Anda minta:

    ```
    # File Konfigurasi Jaringan Dual Adapter

    # Antarmuka loopback (wajib ada)
    auto lo
    iface lo inet loopback

    # Antarmuka #1: Gerbang Belakang (Host-Only)
    # Jalur pribadi & aman untuk manajemen server.
    allow-hotplug eth0
    iface eth0 inet static
        address 192.168.10.1
        netmask 255.255.255.0

    # Antarmuka #2: Gerbang Depan (NAT)
    # Jalur untuk koneksi keluar ke internet.
    allow-hotplug eth1
    iface eth1 inet dhcp
    ```

5.  Simpan dan keluar (`Ctrl + o`, `Enter`, `Ctrl + x`).

6.  Terapkan peta baru ini dengan me-restart seluruh layanan jaringan:

    ```bash
    sudo /etc/init.d/networking restart
    ```

### Verifikasi

Setelah semua langkah di atas selesai, saatnya melakukan inspeksi kualitas untuk memastikan kedua gerbang berfungsi sempurna.

  * **Tes 1: Koneksi Internet (Gerbang Depan)**
    Jalankan dari dalam VM Debian untuk memastikan `eth1` (NAT) bekerja:

    ```bash
    ping -c 4 google.com
    ```

      * **Hasil Sukses:** Anda mendapat balasan (`reply from...`) dan `0% packet loss`.

  * **Tes 2: Koneksi Manajemen (Gerbang Belakang, Arah Masuk)**
    Jalankan dari **Command Prompt (cmd) atau PowerShell di komputer Host/laptop Anda** untuk memastikan Anda bisa "mengetuk" pintu gerbang belakang:

    ```bash
    ping 192.168.10.1
    ```

      * **Hasil Sukses:** Anda mendapat balasan dari IP tersebut.

  * **Tes 3: Koneksi Balik (Gerbang Belakang, Arah Keluar)**
    Jalankan dari dalam VM Debian untuk memastikan server bisa "melihat" komputer Host Anda:

    ```bash
    ping -c 4 192.168.10.10
    ```

      * **Hasil Sukses:** Anda mendapat balasan dari IP Host Anda.

Jika ketiga tes ini berhasil, maka fondasi jaringan dual-adapter Anda telah dibangun dengan sempurna dan siap untuk langkah selanjutnya\!

-----

### **Panduan Lengkap - TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server (Bagian 2 dari 5)**

## Langkah 9: Sinkronisasi Waktu Server (NTP) 🕰️

### Tujuan

Setiap server adalah seorang pencatat sejarah. Semua kejadian, baik itu login yang berhasil, upaya hacking yang gagal, atau error pada aplikasi, semuanya dicatat dalam file **log**. Catatan ini tidak ada gunanya jika stempel waktunya salah.

Tujuan dari langkah ini adalah memasang "jam tangan atom" pada server kita. Kita akan menggunakan **NTP (Network Time Protocol)** untuk memastikan jam server secara otomatis dan terus-menerus sinkron dengan jam paling akurat di dunia. Waktu yang presisi sangat krusial untuk:

  * **Keakuratan Log:** Bukti digital yang andal untuk analisis keamanan dan troubleshooting.
  * **Penjadwalan Tugas (Cron):** Agar semua skrip dan pekerjaan otomatis berjalan tepat pada waktunya.
  * **Sertifikat Keamanan (SSL):** Proses enkripsi dan validasi sertifikat sangat bergantung pada waktu yang akurat.

### Langkah-langkah Eksekusi

**1. Instalasi Paket NTP**

Pertama, kita instal perangkat lunak `ntp`. Sistem akan secara otomatis menggunakan "Gerbang Depan" (`eth1` - NAT) untuk terhubung ke internet dan mengunduh paket ini.

```bash
sudo aptitude -y install ntp
```

**2. Konfigurasi Server Waktu (Pro-Level)**

Secara default, Debian akan menggunakan server waktu miliknya. Kita akan tingkatkan ini dengan menunjuk langsung ke server-server di regional kita (Asia/Indonesia) untuk mendapatkan koneksi yang lebih cepat dan lebih andal.

1.  Buat salinan keamanan dari file konfigurasi:
    ```bash
    sudo cp /etc/ntp.conf /etc/ntp.conf.backup
    ```
2.  Buka file konfigurasi `ntp`:
    ```bash
    sudo nano /etc/ntp.conf
    ```
3.  Cari blok server default yang terlihat seperti ini:
    ```
    server 0.debian.pool.ntp.org iburst
    server 1.debian.pool.ntp.org iburst
    ...
    ```
4.  Nonaktifkan semua baris `server debian` tersebut dengan menambahkan tanda pagar (`#`) di depannya.
5.  Di bawahnya, tambahkan blok server baru kita yang lebih optimal:
    ```
    # Menggunakan server pool regional untuk performa lebih baik
    # Server pool Indonesia untuk latensi rendah
    server 0.id.pool.ntp.org iburst
    server 1.id.pool.ntp.org iburst

    # Server pool Asia sebagai cadangan
    server 2.asia.pool.ntp.org iburst
    server 3.asia.pool.ntp.org iburst
    ```
6.  Simpan dan keluar dari `nano` (`Ctrl + o`, `Enter`, `Ctrl + x`).

**3. Restart Layanan NTP**

Agar server membaca "jadwal" baru kita, restart layanannya:

```bash
sudo /etc/init.d/ntp restart
```

Pastikan Anda melihat pesan `[ ok ]` yang menandakan layanan berhasil di-restart.

### Verifikasi

Sinkronisasi waktu tidak terjadi dalam sekejap. Server perlu "berkenalan" dan menghitung perbedaan waktu dengan server-server di internet. Proses ini bisa memakan waktu satu atau dua menit.

1.  Jalankan perintah berikut untuk melihat status "perkenalan":
    ```bash
    ntpq -p
    ```
2.  **Tunggu sekitar satu menit**, lalu jalankan lagi perintah `ntpq -p`.

**Tanda Kesuksesan Mutlak:**
Anda mencari **tanda bintang (`*`)** yang muncul di paling kiri dari salah satu alamat server. Tanda bintang itu berarti: *"Misi berhasil\! Saya sudah memilih server ini sebagai sumber waktu utama saya dan sekarang jam saya sudah sinkron."*

Contoh output yang sukses:

```
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
*ntp.gwb.net.id  .GPS.            1 u   22   64  377   25.867   -0.564   1.234
+pad-zego.cenai  193.79.237.14    2 u   21   64  377   14.485   -1.129   0.876
```

Jika Anda sudah melihat tanda bintang `*` itu, berarti server Anda kini memiliki jam dengan presisi kelas dunia\!

-----

### **Panduan Lengkap - TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server (Bagian 3 dari 5)**

## Langkah 10: Mengamankan Akses Jarak Jauh (SSH) 🔒

### Tujuan

SSH adalah "pintu masuk" utama kita untuk mengelola server dari jarak jauh. Secara default, pintu ini menggunakan kunci standar (port 22) dan mengizinkan "Tamu VVIP" (`root`) untuk mencoba masuk. Ini membuatnya menjadi target empuk bagi bot-bot jahat di internet yang kerjaannya hanya mencoba mendobrak pintu-pintu standar.

Misi kita di langkah ini adalah mengubah pintu standar kita menjadi **pintu baja tersembunyi yang hanya bisa diakses lewat jalur rahasia**:

1.  **Memindahkan Pintu:** Kita akan memindahkan port SSH dari nomor 22 yang diketahui semua orang ke nomor acak yang hanya kita yang tahu.
2.  **Melarang Tamu VVIP:** Kita akan melarang `root` untuk login via SSH. Semua admin harus masuk sebagai pengguna biasa (`teungku`) dan menggunakan `sudo`. Ini adalah praktik keamanan fundamental.
3.  **Menyembunyikan Pintu:** Ini adalah keuntungan utama dari setup dual-adapter kita. Kita akan membuat pintu SSH ini **hanya terlihat** dari "Gerbang Belakang" (`eth0` - Host-Only) dan sama sekali tidak bisa diakses dari "Gerbang Depan" (`eth1` - Internet).

### Langkah-langkah Eksekusi

**🥇. Install Package SSH**

Sebelum kita memulai kita install package sshnya.

```bash
aptitude -y install ssh
```

**1. Buat Salinan Keamanan (Wajib\!)**

Sebelum kita menyentuh file konfigurasi sepenting ini, backup adalah langkah pertama yang tidak bisa ditawar.

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
```

**2. Mengedit "Buku Peraturan" SSH**

Buka file konfigurasi utama SSH dengan `vim`. Di dalam `vim`, Anda bisa mencari teks dengan cepat menggunakan tombol `/` (misal: `/Port` lalu `Enter`).

```bash
sudo vi /etc/ssh/sshd_config
```

Cari dan ubah tiga baris berikut:

**A. Mengubah Port**

  * **Cari:** Baris `#Port 22`.
  * **Aksi:** Hapus tanda pagar (`#`) dan ganti `22` dengan nomor port pilihan Anda (antara 1024-65535). Kita akan gunakan `2280` sebagai contoh.
  * **Hasil Akhir:**
    ```
    Port 2280
    ```

**B. Melarang `root` Login**

  * **Cari:** Baris yang kemungkinan `PermitRootLogin yes`.
  * **Aksi:** Ganti `yes` menjadi `no`.
  * **Hasil Akhir:**
    ```
    PermitRootLogin no
    ```

**C. Mengatur Alamat IP Pendengar (Paling Penting\!)**

  * **Cari:** Baris `#ListenAddress 0.0.0.0`.
  * **Aksi:** Hapus tanda pagar (`#`) dan ganti `0.0.0.0` (artinya "dengarkan di semua alamat") dengan alamat IP "Gerbang Belakang" (`eth0`) kita.
  * **Hasil Akhir:**
    ```
    ListenAddress 192.168.10.1
    ```

Setelah ketiga perubahan selesai, simpan dan keluar (`Esc`, `:wq`).

**3. Restart Layanan SSH**

Terapkan aturan baru kita dengan me-restart layanan SSH.

```bash
sudo /etc/init.d/ssh restart
```

**⚠️ PERINGATAN PENTING:** Jika ada kesalahan ketik di file konfigurasi, layanan SSH bisa gagal启动 (start). **JANGAN PANIK\!** Keuntungan kita adalah kita masih punya akses langsung ke server melalui konsol VirtualBox. Jika SSH tidak bisa diakses setelah ini, cukup login lewat konsol VirtualBox, perbaiki file `sshd_config` dengan `vi`, lalu restart lagi layanannya.

### Verifikasi

Saatnya menjadi "penguji keamanan". Buka **PowerShell atau Terminal di komputer Host Anda** (laptop/PC) dan lakukan tiga tes berikut.

  * **Tes 1: Coba Masuk Lewat Pintu Lama (Harus GAGAL)**
    Coba hubungi server di port 22 yang lama.

    ```powershell
    ssh teungku@192.168.10.1 -p 22
    ```

      * **Hasil Sukses:** Perintah ini akan gagal dengan pesan `Connection refused` atau `timeout`. Ini membuktikan pintu lama sudah berhasil kita tutup.

  * **Tes 2: Coba Masuk sebagai `root` (Harus GAGAL)**
    Coba masuk sebagai `root` melalui pintu baru kita.

    ```powershell
    ssh root@192.168.10.1 -p 2280
    ```

      * **Hasil Sukses:** Server akan langsung menolak koneksi, seringkali dengan pesan `Permission denied`. Ini membuktikan `root` tidak bisa lagi masuk dari luar.

  * **Tes 3: Masuk Lewat Jalur Rahasia (Harus SUKSES)**
    Ini adalah cara masuk kita yang baru, aman, dan benar.

    ```powershell
    ssh teungku@192.168.10.1 -p 2280
    ```

      * **Hasil Sukses:** Anda akan diminta memasukkan kata sandi untuk **`teungku`**, dan setelah itu Anda akan berhasil login\!

Jika ketiga tes ini memberikan hasil seperti yang diharapkan, berarti Anda telah berhasil membangun benteng digital yang kokoh untuk server Anda.

-----

### **Panduan Lengkap - TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server (Bagian 4 dari 5)**

## Langkah 11: Menjadi "Buku Telepon" Jaringan (DNS Server) 📖

### Tujuan

Saat ini, untuk terhubung ke server kita via SSH, kita menggunakan alamat IP `192.168.10.1`. Ini sama seperti harus menghafal nomor telepon semua orang. Repot\!

Tujuan kita adalah membangun **DNS (Domain Name System) Server** pribadi. Server ini akan bertindak sebagai "buku telepon" pintar untuk jaringan internal kita. Dengan begitu, kita bisa memanggil server kita dengan nama yang mudah diingat seperti `debian.custom.csm` dan server akan otomatis menerjemahkannya ke `192.168.10.1`.

Kita akan membangun dua fungsi utama:

1.  **Forward Lookup:** Menerjemahkan **Nama** menjadi **IP** (misal: `debian.custom.csm` -\> `192.168.10.1`).
2.  **Reverse Lookup:** Menerjemahkan **IP** menjadi **Nama** (misal: `192.168.10.1` -\> `debian.custom.csm`), seperti fitur "Caller ID".

### Langkah-langkah Eksekusi

**1. Instalasi BIND9**
Pertama, kita instal perangkat lunak DNS server standar industri, `BIND9`.

```bash
sudo aptitude -y install bind9
```

**2. Konfigurasi "Daftar Isi" (`named.conf.local`)**
Kita beritahu BIND9 "buku telepon" mana saja yang akan ia kelola.

1.  Backup file konfigurasi:
    ```bash
    sudo cp /etc/bind/named.conf.local /etc/bind/named.conf.local.backup
    ```
2.  Buka file tersebut:
    ```bash
    sudo vi /etc/bind/named.conf.local
    ```
3.  Masukkan "daftar isi" berikut, yang mendefinisikan domain pribadi kita dan jaringan IP kita:
    ```
    // Zona untuk Forward Lookup (Nama => IP)
    zone "custom.csm" {
        type master;
        file "/etc/bind/db.custom.csm";
    };

    // Zona untuk Reverse Lookup (IP => Nama)
    zone "10.168.192.in-addr.arpa" {
        type master;
        file "/etc/bind/db.10.168.192";
    };
    ```
4.  Simpan dan keluar (`Esc`, `:wq`).

**3. Mengisi "Buku Telepon" (Forward Zone File: `db.custom.csm`)**
Saatnya menulis halaman utama buku telepon kita. Kita akan menyalin dari template `db.local` agar lebih aman.

1.  Salin template:
    ```bash
    sudo cp /etc/bind/db.local /etc/bind/db.custom.csm
    ```
2.  Buka dan edit file baru tersebut:
    ```bash
    sudo vi /etc/bind/db.custom.csm
    ```
3.  Hapus semua isinya dan ganti dengan catatan A (Address) kita:
    ```
    ; BIND data file for custom.csm
    $TTL    604800
    @   IN  SOA     debian.custom.csm. root.custom.csm. (
                          2      ; Serial
                     604800      ; Refresh
                      86400      ; Retry
                    2419200      ; Expire
                     604800 )    ; Negative Cache TTL
    ;
    ; Name Servers
        IN  NS      debian.custom.csm.

    ; Host Addresses (Nama => IP)
    @       IN  A       192.168.10.1
    debian  IN  A       192.168.10.1
    www     IN  A       192.168.10.1
    ```
4.  Simpan dan keluar.

**⚠️ PERINGATAN KETELITIAN:**

  * **Tanda Titik (`.`)** di akhir nama domain lengkap (seperti `debian.custom.csm.`) **WAJIB ADA**.
  * **Serial Number** harus dinaikkan setiap kali Anda mengedit file ini. Format `YYYYMMDDnn` adalah yang terbaik (Tahun-Tanggal-Bulan-RevisiKe).

**4. Mengisi "Buku Telepon Terbalik" (Reverse Zone File: `db.10.168.192`)**
Sekarang kita buat halaman "Caller ID". Kita salin dari template `db.127`.

1.  Salin template:
    ```bash
    sudo cp /etc/bind/db.127 /etc/bind/db.10.168.192
    ```
2.  Buka dan edit file baru:
    ```bash
    sudo vi /etc/bind/db.10.168.192
    ```
3.  Hapus isinya dan ganti dengan catatan PTR (Pointer) kita:
    ```
    ; BIND reverse data file for 192.168.10.x network
    $TTL    604800
    @   IN  SOA     debian.custom.csm. root.custom.csm. (
                          1      ; Serial
                     604800      ; Refresh
                      86400      ; Retry
                    2419200      ; Expire
                     604800 )    ; Negative Cache TTL
    ;
    ; Name Servers
        IN  NS      debian.custom.csm.

    ; Pointer Records (IP => Nama)
    1   IN  PTR     debian.custom.csm.
    ```
4.  Simpan dan keluar. Angka `1` di `PTR record` adalah angka terakhir dari IP server kita (`192.168.10.1`).

**5. Pengecekan Sintaks & Menyalakan Mesin**
Sebelum dinyalakan, kita periksa semua pekerjaan kita.

1.  Cek file konfigurasi utama (jika tidak ada output, berarti bagus):
    ```bash
    sudo named-checkconf
    ```
2.  Cek file forward zone (harus berakhir `OK`):
    ```bash
    sudo named-checkzone custom.csm /etc/bind/db.custom.csm
    ```
3.  Cek file reverse zone (harus berakhir `OK`):
    ```bash
    sudo named-checkzone 10.168.192.in-addr.arpa /etc/bind/db.10.168.192
    ```
4.  Jika semua aman, restart BIND9:
    ```bash
    sudo /etc/init.d/bind9 restart
    ```

### Verifikasi

Terakhir, kita uji apakah "buku telepon" kita benar-benar berfungsi.

**1. Arahkan Server ke Dirinya Sendiri**
Edit file `/etc/resolv.conf` dan pastikan `nameserver 192.168.10.1` ada di **baris paling atas**.

```bash
sudo vi /etc/resolv.conf
```

**2. Interogasi Server dengan `dig`**
`dig` adalah alat detektif DNS kita. Jika belum ada, instal dengan `sudo aptitude -y install dnsutils`.

  * **Tes Forward (Nama -\> IP):**

    ```bash
    dig debian.custom.csm
    ```

      * **Hasil Sukses:** Di `ANSWER SECTION`, Anda akan melihat `debian.custom.csm. ... A 192.168.10.1`.

  * **Tes Reverse (IP -\> Nama):**

    ```bash
    dig -x 192.168.10.1
    ```

      * **Hasil Sukses:** Di `ANSWER SECTION`, Anda akan melihat `... PTR debian.custom.csm.`.

Jika kedua tes `dig` ini berhasil, Anda baru saja membangun dan mengkonfigurasi sebuah DNS Server fungsional dari nol\!

-----

### **Panduan Lengkap - TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server (Bagian 5 dari 5)**

## Langkah 12: Menjadi "Manajer Alamat IP" (DHCP Server) 👔

### Tujuan

Setelah membangun "buku telepon" (DNS) yang canggih, kini saatnya kita menyewa seorang "resepsionis" yang akan membagikan buku telepon tersebut ke semua "tamu" (klien) di jaringan kita secara otomatis. Inilah peran **DHCP (Dynamic Host Configuration Protocol) Server**.

Tujuan kita adalah membuat server Debian kita mampu:

1.  **Memberikan Alamat IP Otomatis:** Setiap perangkat baru yang terhubung ke jaringan Host-Only kita akan langsung diberi alamat IP tanpa perlu pengaturan manual.
2.  **Memberi Arah (Gateway & DNS):** Selain IP, server kita juga akan memberitahu setiap klien, "Pintu keluar ke internet ada di `192.168.10.1`" dan "Buku telepon jaringan ada di `192.168.10.1`."
3.  **Menciptakan Sinergi:** Ini adalah langkah yang mengikat semua kerja keras kita. Server DHCP akan "mempromosikan" server DNS yang baru saja kita bangun, menciptakan ekosistem jaringan internal yang cerdas dan mandiri.

### Langkah-langkah Eksekusi

**1. Instalasi Paket DHCP Server**

Pertama, kita instal perangkat lunak `isc-dhcp-server`.

```bash
sudo aptitude -y install isc-dhcp-server
```

**⚠️ PERHATIAN: INSTALASI AKAN GAGAL DI AKHIR\!**
Jangan khawatir saat melihat pesan `[fail]` di akhir proses instalasi. Ini **100% normal**. Server DHCP mencoba berjalan sebelum kita memberitahunya di "pintu" mana ia harus bertugas.

**2. Menentukan Wilayah Kerja (Antarmuka Jaringan)**

Langkah paling krusial adalah memberitahu DHCP server agar ia **hanya** melayani permintaan di "Gerbang Belakang" (`eth0` - Host-Only) dan tidak di tempat lain.

1.  Buat salinan keamanan:
    ```bash
    sudo cp /etc/default/isc-dhcp-server /etc/default/isc-dhcp-server.backup
    ```
2.  Buka file konfigurasi antarmuka:
    ```bash
    sudo vi /etc/default/isc-dhcp-server
    ```
3.  Cari baris `INTERFACES=""` dan ubah menjadi:
    ```
    INTERFACES="eth0"
    ```
4.  Simpan dan keluar (`Esc`, `:wq`).

**3. Membuat "Buku Peraturan" Resepsionis (`dhcpd.conf`)**

Sekarang kita akan menulis aturan main untuk DHCP server: siapa yang dilayani, alamat apa yang diberikan, dan informasi apa yang dibagikan.

1.  Buat salinan keamanan:
    ```bash
    sudo cp /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf.backup
    ```
2.  Buka file konfigurasi utama:
    ```bash
    sudo vi /etc/dhcp/dhcpd.conf
    ```
3.  Tambahkan blok konfigurasi bersih kita di bagian bawah file (abaikan contoh-contoh yang sudah ada). Gunakan konfigurasi yang sudah kita rancang untuk jaringan `custom.csm`:
    ```
    # --- Konfigurasi DHCP untuk Jaringan Internal custom.csm ---

    # Menginformasikan nama domain dan alamat server DNS ke klien
    option domain-name "custom.csm";
    option domain-name-servers 192.168.10.1;

    # Waktu sewa alamat IP (dalam detik)
    default-lease-time 600;
    max-lease-time 7200;

    # Menegaskan bahwa server ini adalah otoritas resmi untuk jaringan ini
    authoritative;

    # Blok konfigurasi spesifik untuk jaringan 192.168.10.0/24
    subnet 192.168.10.0 netmask 255.255.255.0 {
      # Rentang alamat IP yang boleh "disewakan" ke klien
      range 192.168.10.100 192.168.10.200;
      # Memberitahu klien di mana letak Gateway
      option routers 192.168.10.1;
      # Memberitahu alamat broadcast
      option broadcast-address 192.168.10.255;
    }
    ```
4.  Simpan dan keluar.

**4. Menyalakan Layanan DHCP**

Setelah semua aturan dibuat, saatnya menyalakan "resepsionis" kita. Kali ini, ia akan berjalan dengan sukses.

```bash
sudo /etc/init.d/isc-dhcp-server start
```

Anda harus melihat pesan `[ ok ] Starting ISC DHCP server: dhcpd.` sebagai tanda keberhasilan.

### Verifikasi

Bagaimana cara tahu "resepsionis" kita bekerja? Cara terbaik adalah dengan **mendatangkan "tamu" baru** dan melihat apakah ia dilayani secara otomatis.

Cara termudah untuk melakukan ini adalah:

1.  **Buat VM baru yang sederhana** (misalnya, Debian atau Ubuntu versi ringan dengan setting *default*).
2.  Atur adapter jaringan **satu-satunya** di VM baru tersebut ke mode **Host-Only** (sama seperti `eth0` server kita).
3.  Nyalakan VM baru tersebut.
4.  Setelah boot, buka terminal di VM baru dan jalankan perintah `ifconfig` atau `ip a`.

**Tanda Kesuksesan Mutlak:**
Anda akan melihat VM baru tersebut secara ajaib mendapatkan:

  * Alamat IP di antara `192.168.10.100` dan `192.168.10.200`.
  * Jika Anda memeriksa file `/etc/resolv.conf` di VM baru itu, Anda akan melihat `nameserver 192.168.10.1` dan `search custom.csm` sudah terisi otomatis\!

Jika ini terjadi, berarti server DHCP Anda bekerja dengan sempurna dan telah berhasil mengintegrasikan seluruh layanan jaringan yang telah kita bangun.

🎉 **SELAMAT\! TAHAPAN Konfigurasi NTP, SSH, DNS, DHCP Server SELESAI\!** 🎉
