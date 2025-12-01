---
title: "(Part 7): Konfigurasi NAT Router Sharing Internet"
date: "2025-09-30"
category: "Course"
tags: ["debian-server-series"]
---

<iframe src="https://www.youtube.com/embed/nznAZGlkP48?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# Dokumentasi Debian di Hyper V (Part 7): Konfigurasi NAT Router Sharing Internet
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

# 📖 BAB 2: JARINGAN & KONEKTIVITAS

## (Part 7) Menjadi Router: Segmen 1

**(NAT & Internet Sharing)**

### 🏷️ TAGLINE

*"Satu Pintu untuk Semua: Membagi Koneksi ke Seluruh Jaringan"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Bayangkan server Anda adalah satu-satunya orang yang punya **KTP** (IP Publik/Koneksi Internet) di sebuah asrama. Teman-teman asrama (Windows 7/Klien) ingin masuk ke klub malam (Internet), tapi mereka tidak punya KTP (IP Privat).

Apa solusinya? **NAT (Network Address Translation) Masquerade.**
Server Anda akan meminjamkan "Topeng Wajah"-nya.

1.  Windows 7 titip pesan ke Server.
2.  Server pergi ke Internet pakai KTP-nya sendiri.
3.  Server balik lagi ke asrama dan kasih hasilnya ke Windows 7.

Internet taunya yang akses cuma Server Debian, padahal di belakangnya ada banyak klien "nebeng".

-----

### 🎯 MISI OPERASI (Segmen 1)

1.  Mengaktifkan **IP Forwarding** (Supaya Server mau jadi kurir data).
2.  Memasang aturan **NAT Masquerade** (Supaya Server meminjamkan identitasnya).
3.  Menyimpan aturan firewall agar permanen.

-----

### 🛠️ PERSIAPAN

  * Login sebagai **root**.
  * Ingat kembali: `eth1` adalah internet, `br0` (atau `eth0`) adalah jaringan lokal.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 1)

#### TAHAP A: Membuka Keran (Enable Packet Forwarding)

Secara default, Linux itu "pelit". Dia menolak meneruskan paket data orang lain. Kita harus ubah sifatnya.

**1. Edit Kernel System:**

```bash
nano /etc/sysctl.conf
```

**2. Aktifkan Fitur Forward:**
Cari baris `#net.ipv4.ip_forward=1`.
**Hapus tanda pagar (\#)** di depannya agar aktif.

```bash
net.ipv4.ip_forward=1
```

Simpan (`Ctrl+O`) dan keluar (`Ctrl+X`).

**3. Terapkan Sekarang:**

```bash
sysctl -p
```

  * **Hasil:** Muncul output `net.ipv4.ip_forward = 1`. Keran sudah terbuka\!

-----

#### TAHAP B: Mantra Sihir IPTables (NAT)

Sekarang kita atur lalu lintasnya.

**1. Pasang Aturan Utama (Masquerade):**
Perintah ini artinya: *"Hai Firewall, semua paket dari jaringan lokal (`192.168.10.0/24`) yang mau keluar lewat `eth1`, tolong SAMARKAN (Masquerade) seolah-olah paket itu dari saya."*

```bash
iptables -t nat -A POSTROUTING -s 192.168.10.0/24 -o eth1 -j MASQUERADE
```

**2. Izinkan Jalur Masuk-Keluar (Forwarding):**
*(Catatan: Karena di Part 4 kita pakai Bridge `br0`, kita gunakan `br0` sebagai jalur lokal).*

```bash
# Izinkan paket BARU dari Lokal (br0) ke Internet (eth1)
iptables -A FORWARD -i br0 -o eth1 -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT

# Izinkan paket BALASAN dari Internet (eth1) ke Lokal (br0)
iptables -A FORWARD -i eth1 -o br0 -m state --state RELATED,ESTABLISHED -j ACCEPT
```

-----

#### TAHAP C: Membekukan Aturan (Persistence)

IPTables itu "pelupa". Kalau server restart, aturan di atas hilang semua. Kita butuh "Pendingin".

**1. Instal Paket Penyimpan:**

```bash
aptitude -y install iptables-persistent
```

*(Saat muncul layar konfirmasi biru/merah, pilih **YES** untuk Save IPv4 Rules).*

> **💡 Tips:** Jika nanti Anda nambah aturan firewall lagi, simpan manual dengan:
> `iptables-save > /etc/iptables/rules.v4`

-----

### 🚧 POJOK "BENANG MERAH" (Real Case Study)

**Kasus:** "Mas, IPTables sudah diketik, `sysctl` sudah diaktifkan, tapi klien tetap nggak bisa browsing?"
**Penyebab:** Biasanya masalah **DNS**. Router (Debian) sudah meneruskan paketnya, tapi Klien (Windows) tidak tahu alamat IP dari `google.com`. Jalur pipanya sudah benar, tapi buku teleponnya belum dibagi.
**Solusi:** Ini akan kita bereskan di **Segmen 2 (DNS Forwarding)** dan **Part 6 (DHCP)**.

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Segmen 1)

Cek tabel NAT Anda untuk memastikan aturan sudah tertulis.

**Perintah:**

```bash
iptables -t nat -L -v -n
```

**Hasil Sukses:**
Anda akan melihat baris di bagian `Chain POSTROUTING` yang berisi:
`MASQUERADE ... source 192.168.10.0/24 ...`

Jika baris itu ada, **Segmen 1 SELESAI\!** Pipa internet sudah terpasang.

-----

*(Lanjut ke Segmen 2: Kita perbaiki otak DNS-nya...)*

-----

# 📖 BAB 2: JARINGAN & KONEKTIVITAS

## (Part 7) Menjadi Router: Segmen 2

**(DNS Forwarding & Verification)**

### 🏷️ TAGLINE

*"Jangan Sok Tahu: Bertanya pada Ahlinya (Google)"*

-----

### ☕ KONSEP "WARUNG KOPI" (Analogi)

Di Part 3, Server kita punya "Buku Telepon Lokal" (`teungku.edu`). Tapi kalau Windows 7 tanya: *"Berapa nomor HP-nya Facebook?"*, server kita bakal bingung karena tidak ada di bukunya.

Solusinya: **DNS Forwarding**.
Kita ajarkan Server: *"Eh, kalau kamu nggak tau jawabannya, jangan diam aja. Teruskan (Forward) pertanyaan itu ke Guru Besar (Google DNS 8.8.8.8). Nanti kalau Google jawab, baru kamu kasih tau ke Windows 7."*

[Image of DNS forwarding diagram]

-----

### 🎯 MISI OPERASI (Segmen 2)

1.  Mengedit BIND9 agar punya "Guru Besar" (Forwarders).
2.  Mematikan validasi keamanan ribet (DNSSEC) agar koneksi lancar.

-----

### 💻 LANGKAH EKSEKUSI (Segmen 2)

#### TAHAP A: Konfigurasi Forwarder

**1. Edit Opsi BIND:**

```bash
nano /etc/bind/named.conf.options
```

**2. Masukkan Alamat Google:**
Cari bagian `forwarders { ... };`. Biasanya ada tanda `//` (komentar).
Hapus tanda `//` dan isi IP Google. Tambahkan juga baris `forward only`.

Isinya harus jadi seperti ini:

```bash
options {
        directory "/var/cache/bind";

        // === START DNS GOOGLE === //
        forwarders {
                8.8.8.8;
                8.8.4.4;
        };
        forward only;
        // ==== END DNS GOOGLE ==== //

        // Matikan Validasi DNSSEC (PENTING!)
        // dnssec-validation auto;  <-- Ubah jadi no
        dnssec-validation no;

        auth-nxdomain no;    # conform to RFC1035
        listen-on-v6 { any; };
};
```

**3. Restart BIND:**

```bash
service bind9 restart
```

-----

### 📸 MOMEN "KA-BOOM\!" (Verification Part 7)

Sekarang kita buktikan apakah Server Debian sudah pintar.

**1. Tes Tanya Alamat Luar:**
Gunakan perintah `nslookup` di terminal **Debian**.

```bash
nslookup google.com 192.168.10.1
```

*(Artinya: Hai Server 192.168.10.1, tau nggak alamat google.com?)*

  * **Hasil Sukses:**
    ```
    Server:     192.168.10.1
    Name:       google.com
    Address:    142.250.xxx.xxx
    ```
    (Server menjawab dengan IP Google. Berarti dia sukses bertanya ke 8.8.8.8).

**2. Tes Ping:**
Pastikan server sendiri masih konek internet.

```bash
ping google.com
```

-----

**🏁 PENUTUP PART 7:**
Misi Router Selesai\!

1.  Jalur pipa (NAT) sudah dibangun.
2.  Otak server (DNS) sudah diperbarui.

Sekarang infrastruktur sudah siap. Tapi... siapa yang mau pakai? Klien (Windows 7) masih belum punya IP Address.