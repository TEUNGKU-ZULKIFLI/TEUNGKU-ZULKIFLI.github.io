---
title: "(Part 3): Konfigurasi NTP, SSH, DNS, DHCP Server"
date: "2025-09-26"
category: "Course"
tags: ["debian-server-series"]
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

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 3) Identitas Server: Segmen 1

**(Network Architecture & NTP)**

### 🏷️ TAGLINE

*"Membangun Dua Wajah dan Menyamakan Jam Tangan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

1.  **Dual Adapter (Wajah Ganda):**
    Bayangkan server Anda adalah sebuah **Ruko (Rumah Toko)**.

      * **Pintu Depan (NAT/eth1):** Menghadap jalan raya (Internet). Kurir paket (Update/Download) masuk lewat sini.
      * **Pintu Belakang (Host-Only/eth0):** Menghadap ke garasi pribadi (Laptop Anda). Hanya Anda (Admin) yang boleh masuk lewat sini untuk ngopi dan kerja. Aman dari maling jalan raya\!

2.  **NTP (Network Time Protocol):**
    Pernah nonton film perampokan bank? *"Samakan jam tangan kita... 3, 2, 1, Mark\!"*
    Server butuh jam yang presisi. Kalau jam server ngaco (telat 5 menit saja), log keamanan jadi tidak valid, dan sertifikat SSL akan dianggap palsu. NTP adalah cara server mencocokkan jam tangannya dengan Jam Atom Dunia secara otomatis.

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Memasang dua kartu jaringan: **Host-Only** (untuk manajemen) dan **NAT** (untuk internet).
2.  Menginstal **NTP** agar waktu server akurat.

-----

### 🛠️ PERSIAPAN

  * Matikan dulu VM Debian Anda (`shutdown -h now`).
  * Siapkan kopi, kita mainan konfigurasi IP lagi.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Setup Hardware Virtual (Di VirtualBox/Hyper-V)

Sebelum menyalakan server, kita pasang kabelnya dulu.

**1. Setting Adapter di Host (Laptop Anda):**

  * Buka Network Manager di VirtualBox/VMware.
  * Pastikan ada adapter **Host-Only**.
  * Set IP Host (Laptop) Anda jadi: `192.168.10.10` (Agar satu jaringan dengan server nanti).
  * **PENTING:** Matikan DHCP Server bawaan VirtualBox/VMware\! Kita mau server Debian yang jadi bos DHCP nanti.

**2. Setting Adapter di VM Debian:**

  * Buka Settings VM Debian -\> Network.
  * **Adapter 1:** Ubah ke **Host-only Adapter**. (Ini jadi `eth0`).
  * **Adapter 2:** Ubah ke **NAT**. (Ini jadi `eth1`).
  * *Nyalakan VM Anda sekarang.*

-----

#### TAHAP B: Konfigurasi "Peta Jaringan" (Interfaces)

Login sebagai user biasa, lalu masuk mode admin (`sudo su` atau `su`).

**1. Edit File Network:**

```bash
nano /etc/network/interfaces
```

**2. Masukkan Konfigurasi Wajah Ganda:**
Hapus isinya (atau sesuaikan) menjadi seperti ini:

```bash
# Loopback (Wajib ada)
auto lo
iface lo inet loopback

# Wajah 1: Pintu Belakang (Manajemen Lokal)
# Hubungkan ke Laptop via Host-Only
allow-hotplug eth0
iface eth0 inet static
    address 192.168.10.1
    netmask 255.255.255.0

# Wajah 2: Pintu Depan (Internet)
# Minta IP otomatis ke Router Virtual via NAT
allow-hotplug eth1
iface eth1 inet dhcp
```

Simpan (`Ctrl+O`) dan keluar.

**3. Restart Network:**

```bash
/etc/init.d/networking restart
```

**4. Verifikasi Koneksi:**

  * Cek Internet: `ping google.com` (Harus reply).
  * Cek Lokal: `ping 192.168.10.10` (Harus reply ke Laptop Anda).

-----

#### TAHAP C: Menyamakan Jam (NTP Setup)

**1. Instal NTP:**

```bash
apt-get install ntp -y
```

**2. Arahkan ke Server Indonesia (Agar Presisi):**

```bash
nano /etc/ntp.conf
```

Cari baris `server 0.debian.pool...` dst. Beri tanda `#` di depannya (matikan).
Ganti dengan server lokal Indonesia:

```bash
# Server NTP Indonesia
server 0.id.pool.ntp.org iburst
server 1.id.pool.ntp.org iburst
server 2.asia.pool.ntp.org iburst
```

Simpan dan keluar.

**3. Restart NTP:**

```bash
/etc/init.d/ntp restart
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** Internet jalan (`ping google` aman), tapi tidak bisa ping ke Laptop (`192.168.10.10`).
**Penyebab:** Firewall di Windows (Laptop) Anda memblokir ping masuk\!
**Solusi:** Matikan sementara Windows Firewall atau buat rule *ICMP Allow*. Atau, coba sebaliknya: Ping dari Laptop ke Server (`ping 192.168.10.1`). Kalau reply, berarti aman\!

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

1.  **Cek Waktu:**
    Ketik: `ntpq -p`

      * **Hasil:** Anda akan melihat daftar server (`.id.pool.ntp.org`). Tunggu beberapa menit, jika ada tanda bintang `*` di sebelah kirinya, berarti jam sudah sinkron akurat\!

2.  **Cek IP:**
    Ketik: `ifconfig`

      * **Hasil:**
          * `eth0`: `192.168.10.1` (Siap untuk manajemen).
          * `eth1`: `10.0.x.x` (Siap untuk internet).

-----

*(Segmen 1 Selesai. Lanjut ke Segmen 2: Kita akan mengamankan pintu manajemen ini dengan SSH Custom...)*

Sekarang kita masuk ke **Segmen 2**. Ini adalah bagian favorit saya karena kita akan bermain layaknya agen rahasia: **Menyembunyikan pintu masuk server.**

Di Segmen 1, kita sudah membuat "Pintu Belakang" (Host-Only Adapter). Di Segmen 2 ini, kita akan memasang kunci digital super aman di pintu tersebut.

-----

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 3) Identitas Server: Segmen 2

**(SSH Security & Remote Access)**

### 🏷️ TAGLINE

*"Membangun Pintu Rahasia dan Membuang Kunci Cadangan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan server Anda adalah sebuah **Brankas Bank**.

1.  **Port 22 (Default SSH):** Ini seperti menempelkan tulisan besar "LUBANG KUNCI DI SINI" di pintu brankas. Semua maling (bot/hacker) tahu ke mana harus mencongkel. Kita akan pindahkan lubang kuncinya ke tempat tersembunyi (**Custom Port 2280**).
2.  **Root Login:** Ini seperti memperbolehkan penggunaan "Kunci Master" dari luar gedung. Kalau kunci ini dicuri, tamatlah riwayat bank. Kita akan melarang kunci master dipakai dari jauh. Admin harus masuk pakai kunci karyawan biasa (**User**), baru boleh buka brankas di dalam (**Sudo**).
3.  **Listen Address:** Kita akan memaksa pintu ini hanya muncul di "Lorong Pribadi" (IP 192.168.10.1), bukan di jalan raya internet.

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Menginstal paket **OpenSSH Server**.
2.  Mengganti Port standar (22) menjadi Port rahasia (**2280**).
3.  Mematikan izin login **Root**.
4.  Membatasi akses hanya dari jaringan lokal (Host-Only).

-----

### 🛠️ PERSIAPAN

  * Masih login di terminal Debian (bisa lewat Console VirtualBox/VMware).
  * Pastikan IP `eth0` sudah `192.168.10.1` (Hasil Segmen 1).

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Instalasi & Backup

**1. Instal Paket SSH:**
Agar kita bisa me-remote server ini dari Windows (putty/cmd).

```bash
apt-get install ssh -y
```

**2. Backup Konfigurasi (SOP Wajib):**
Sebelum mengacak-acak keamanan, simpan file aslinya.

```bash
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
```

-----

#### TAHAP B: Modifikasi "Buku Peraturan" SSH

Kita edit konfigurasi utamanya.

**1. Buka File Config:**

```bash
nano /etc/ssh/sshd_config
```

**2. Terapkan 3 Aturan Emas:**
Cari baris-baris di bawah ini, hilangkan tanda `#` jika ada, dan ubah nilainya:

  * **Aturan 1: Ganti Port**
    Cari `Port 22`. Ubah menjadi:

    ```bash
    Port 2280
    ```

    *(Angka 2280 itu acak, Anda boleh pilih angka lain antara 1024-65535, tapi ingat angkanya\!)*

  * **Aturan 2: Batasi Alamat (Listen Address)**
    Cari `ListenAddress 0.0.0.0` (Dengar dari semua arah). Ubah menjadi IP lokal kita:

    ```bash
    ListenAddress 192.168.10.1
    ```

    *(Artinya: SSH tidak akan melayani permintaan dari internet/eth1).*

  * **Aturan 3: Matikan Root (PermitRootLogin)**
    Cari `PermitRootLogin yes`. Ubah menjadi:

    ```bash
    PermitRootLogin no
    ```

**3. Simpan dan Keluar:**
`Ctrl+O`, `Enter`, `Ctrl+X`.

**4. Restart Layanan SSH:**

```bash
/etc/init.d/ssh restart
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, saya habis ganti port dan restart SSH, kok saya **nggak bisa masuk** lagi pakai Putty?"

**Penyebab:**

1.  Lupa ganti nomor port di Putty (masih pakai 22, padahal sudah jadi 2280).
2.  Salah ketik IP di `ListenAddress` (Typo itu mematikan\!).

**Solusi Penyelamatan:**
Jangan panik\! Anda tidak terkunci total. Kembali ke jendela **VirtualBox/VMware** (Console Fisik). Login langsung di layar hitam itu, edit lagi file config-nya, perbaiki typo, restart service, dan coba lagi.
*Inilah gunanya punya akses fisik (Console) vs akses remote (SSH).*

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 2)

Sekarang kita tinggalkan layar hitam Debian, kita pindah ke **Windows (Laptop Host)** Anda. Kita akan coba membobol server sendiri.

Buka **CMD** atau **PowerShell** di Windows.

**1. Tes Masuk Pintu Lama (Harus GAGAL):**

```cmd
ssh teungku@192.168.10.1
```

  * **Hasil:** `Connection refused`. (Mantap\! Pintu standar sudah ditembok).

**2. Tes Masuk Pakai Root (Harus GAGAL):**

```cmd
ssh root@192.168.10.1 -p 2280
```

  * **Hasil:** `Permission denied`. (Mantap\! Bos besar dilarang masuk langsung).

**3. Tes Masuk Jalur Rahasia (Harus SUKSES):**

```cmd
ssh teungku@192.168.10.1 -p 2280
```

*(Ganti `teungku` dengan user Anda)*

  * **Hasil:** Diminta password user teungku -\> Masuk\! -\> Prompt berubah jadi `teungku@debian:~$`.

**BONUS:**
Jika berhasil, mulai sekarang Anda bisa membuang jendela VirtualBox yang sempit itu. Gunakan **Putty** atau **VS Code Remote SSH** dengan Port 2280 untuk mengerjakan part-part selanjutnya. Jauh lebih nyaman, bisa copy-paste\!

-----

*(Segmen 2 Selesai. Kita lanjut ke Final Boss\!  Part 3 di Segmen 3: DNS Server BIND9...)*

Siap\! Ini adalah **Final Boss** dari Part 3.

Konfigurasi DNS BIND9 terkenal sebagai salah satu konfigurasi yang paling *tricky* (menjebak) karena salah satu titik (`.`) atau titik koma (`;`) saja bisa membuat service gagal start.

Tapi tenang, kita akan membuatnya menjadi masuk akal dan mudah diikuti.

-----

# 📖 BAB 1: THE GENESIS (Lanjutan)

## (Part 3) Identitas Server: Segmen 3

**(DNS Server BIND9)**

### 🏷️ TAGLINE

*"Membangun Buku Telepon Digital & Stop Menghafal Angka"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Di dunia nyata, apakah Anda menghafal nomor HP teman Anda (misal: `0812-3456-7890`)? Tentu tidak. Anda menyimpan nomor itu dengan nama **"Budi"**. Saat mau nelpon, Anda cari "Budi", dan HP Anda otomatis menelpon nomornya.

Itulah **DNS (Domain Name System)**.

1.  **Forward Lookup:** Kita tanya "Siapa IP dari `debian.teungku.edu`?" -\> DNS jawab `192.168.10.1`.
2.  **Reverse Lookup:** Kita tanya "Siapa pemilik IP `192.168.10.1`?" -\> DNS jawab `debian.teungku.edu` (Seperti fitur Caller ID).

Tanpa DNS, kita harus mengetik IP Address untuk mengakses website atau kirim email. Dengan DNS, kita punya identitas keren: `teungku.edu`.

-----

### 🎯 MISI OPERASI (Segmen 3)

1.  Menginstal **BIND9** (Software DNS Paling Populer).
2.  Membuat Domain Lokal bernama **`teungku.edu`**.
3.  Mengatur agar server bisa dipanggil dengan nama, bukan cuma angka.

-----

### 🛠️ PERSIAPAN

  * **Fokus Tinggi:** Konfigurasi ini sensitif terhadap *typo*.
  * Pastikan IP Server sudah statis di `192.168.10.1`.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 3)

#### TAHAP A: Instalasi Paket

Kita butuh `bind9` (servernya) dan `dnsutils` (alat tes/dig).

```bash
apt-get install bind9 dnsutils -y
```

-----

#### TAHAP B: Mendaftarkan Zona (Daftar Isi)

Kita harus memberitahu BIND9 bahwa kita adalah penguasa dari domain `teungku.edu`.

**1. Edit File Zona Lokal:**

```bash
nano /etc/bind/named.conf.local
```

**2. Tambahkan Konfigurasi Ini:**
(Taruh di bawah, jangan hapus yang sudah ada).

```bash
# Zona Maju (Nama ke IP)
zone "teungku.edu" {
    type master;
    file "/etc/bind/db.teungku.edu";
};

# Zona Mundur (IP ke Nama)
# Angka IP dibalik: 192.168.10.x menjadi 10.168.192
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192";
};
```

Simpan (`Ctrl+O`) dan keluar.

-----

#### TAHAP C: Membuat File Database (Isi Buku Telepon)

Sekarang kita buat file aslinya.

**1. Buat File Forward (`db.teungku.edu`):**
Kita copy dari template agar tidak ngetik dari nol.

```bash
cp /etc/bind/db.local /etc/bind/db.teungku.edu
nano /etc/bind/db.teungku.edu
```

**2. Edit Isinya (Hati-hati Titik\!):**
Ubah `localhost.` menjadi `debian.teungku.edu.` (Ingat titik di akhir\!).
Ubah IP `127.0.0.1` menjadi `192.168.10.1`.

Hasil akhirnya harus persis seperti ini:

```bash
; Forward Zone untuk teungku.edu
$TTL    604800
@       IN      SOA     debian.teungku.edu. root.teungku.edu. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      debian.teungku.edu.
@       IN      A       192.168.10.1    ; IP Domain Utama
debian  IN      A       192.168.10.1    ; Subdomain debian
www     IN      A       192.168.10.1    ; Subdomain www
```

Simpan dan keluar.

**3. Buat File Reverse (`db.192`):**
Copy dari template angka.

```bash
cp /etc/bind/db.127 /etc/bind/db.192
nano /etc/bind/db.192
```

**4. Edit Isinya:**
Ubah `localhost.` menjadi `debian.teungku.edu.`
Pada bagian paling bawah, ganti angka `1.0.0` menjadi `1` (Digit terakhir IP server kita).

Hasil akhirnya:

```bash
; Reverse Zone
$TTL    604800
@       IN      SOA     debian.teungku.edu. root.teungku.edu. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      debian.teungku.edu.
1       IN      PTR     debian.teungku.edu.
```

Simpan dan keluar.

-----

#### TAHAP D: Aktivasi & Pengecekan

**1. Restart BIND9:**

```bash
/etc/init.d/bind9 restart
```

*Pastikan muncul `[ ok ]`. Jika `[ fail ]`, cek Pojok Benang Merah\!*

**2. Arahkan Server ke Dirinya Sendiri:**
Agar server Debian menggunakan DNS-nya sendiri untuk bertanya.

```bash
nano /etc/resolv.conf
```

Pastikan baris paling atas adalah:

```bash
nameserver 192.168.10.1
search teungku.edu
```

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Masalah:** `[FAIL] Starting domain name service... bind9 failed!`
**Penyebab Paling Umum:**

1.  **Kurang Titik (.):** Menulis `debian.teungku.edu` tanpa titik di akhir (`.`) di dalam file `db.*`.
2.  **Kurang Titik Koma (;):** Di file `named.conf.local`, setiap baris dalam kurung kurawal `{}` harus diakhiri titik koma `;`.

**Cara Detektif (Debugging):**
Gunakan perintah ini untuk mencari letak kesalahan:

```bash
named-checkconf -z
```

Ini akan memberitahu Anda: *"Error on line 12: missing semicolon"*. Sangat membantu\!

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 3)

Mari kita uji apakah "Buku Telepon" kita berfungsi. Gunakan perintah `nslookup` atau `dig`.

**1. Tes Panggil Nama:**

```bash
nslookup debian.teungku.edu
```

  * **Hasil:**
    ```
    Server:     192.168.10.1
    Name:       debian.teungku.edu
    Address:    192.168.10.1
    ```

**2. Tes Panggil Nomor (Reverse):**

```bash
nslookup 192.168.10.1
```

  * **Hasil:** `1.10.168.192.in-addr.arpa name = debian.teungku.edu.`

**3. Tes Ping:**

```bash
ping debian.teungku.edu
```

  * **Hasil:** `PING debian.teungku.edu (192.168.10.1)...`

Jika `ping` berhasil merespons dari nama domain, **SELAMAT\!** Server Anda sekarang punya identitas resmi. Anda tidak perlu lagi mengingat IP Address.