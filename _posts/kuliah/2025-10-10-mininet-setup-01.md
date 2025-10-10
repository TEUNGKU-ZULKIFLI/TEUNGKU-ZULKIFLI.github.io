---
title: "Installasi Mininet VM - Tahapan 01: Setup Mininet VM"
date: "2025-10-10"
category: "Kuliah"
tags: ["mininet-series", "HyperV", "linux", "initial-setup", "networking"]
---

<iframe src="https://www.youtube.com/embed/KYJy2arn2u4?controls=0&modestbranding=1&rel=0&disablekb=1&autoplay=0" style="display:block;margin:auto;border:none;width:100%;max-width:960px;height:540px;" allow="autoplay; encrypted-media" allowfullscreen></iframe>

# 🧠 Panduan Lengkap Setup Mininet VM di Hyper-V (Windows 11)

## 🚀 Pendahuluan
Mininet adalah simulator jaringan ringan berbasis Linux yang memungkinkan kita membuat topologi jaringan virtual untuk belajar dan menguji protokol seperti OpenFlow. Cocok untuk pelajar, peneliti, dan pengembang jaringan.

### 📚 Referensi Resmi
- [Mininet.org](http://mininet.org/)
- [Download Mininet VM](http://mininet.org/download/)
- [VM Installation Guide](http://mininet.org/download/#option-1-mininet-vm-installation-easy-recommended)
- [VM Setup Notes](http://mininet.org/vm-setup-notes/)

---

## 🎯 Tujuan & Konsep
- Menjalankan Mininet VM di Windows 11 menggunakan Hyper-V.
- Menghubungkan VM ke internet dan host melalui adapter virtual.
- Mengaktifkan akses SSH agar bisa remote dari terminal Windows.

---

## 🧰 Prasyarat
- Windows 11 Pro atau Enterprise (Hyper-V hanya tersedia di edisi ini).
- Hyper-V sudah aktif (bisa diaktifkan lewat "Turn Windows features on or off").
- File VM Mininet dalam format `.vhd` atau `.vhdx`.
- Koneksi internet untuk update dan instalasi paket.

---

## 🛠️ Langkah-langkah Eksekusi

### 1. 🔽 Unduh File Mininet VM
- Bisa dari situs resmi atau link alternatif berikut:  
  [`Download Mininet VM`](https://drive.google.com/drive/folders/1_hwvg3CvoA8R4qGL6qFd5a371D6cQ_99)

> ⚠️
> Jika file yang kamu unduh berformat `.zip`, pastikan di dalamnya ada file `.vhd` atau `.vhdx`. Jika tidak, kamu perlu konversi terlebih dahulu.

---

### 2. 🖥️ Buat Virtual Machine di Hyper-V
1. Buka **Hyper-V Manager**.
2. Klik **New → Virtual Machine**.
3. Ikuti wizard, dan pada bagian:
   - **Memory**: isi minimal `1024 MB`.
   - **Processor**: isi `2 virtual processors`.
   - **Hard Disk**: pilih file `.vhdx` Mininet yang sudah diunduh.

---

### 3. 🌐 Setup Network Adapter
Tambahkan dua adapter:
- **Adapter 1**: pilih `Default Switch` → untuk akses internet.
- **Adapter 2**: buat virtual switch baru bernama `HostOnlyMininet` → untuk komunikasi dengan host.

> 🛑
> **Adapter 2** untuk membuatnya lihat video!

---

### 4. ▶️ Jalankan VM
- Klik kanan VM → pilih **Connect**.
- Di jendela baru, klik tombol **Start**.

---

### 5. 🔐 Login ke Mininet VM
Masukkan kredensial default:
```bash
Username : mininet
Password : mininet
```

---

## ⚙️ Konfigurasi Jaringan Mininet VM

### 6.1 🧾 Backup File Konfigurasi
```bash
cd /etc/netplan
ls
sudo cp 01-netcfg.yaml 01-netcfg.yaml.backup
ls
```

---

### 6.2 📝 Edit Konfigurasi Network
```bash
sudo nano 01-netcfg.yaml
```

Ubah isi file menjadi:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: yes
    eth1:
      dhcp4: no
      addresses: [192.168.20.1/24]
```

>⚠️
> Gunakan **spasi**, bukan **tab**, saat menulis file YAML.

Simpan dan keluar:
`Ctrl + o` `Enter` `Ctrl + x`

---

### 6.3 🚀 Terapkan Konfigurasi
```bash
sudo netplan apply
ip a
```

Pastikan:
- `eth0` mendapat IP dari DHCP.
- `eth1` beralamat `192.168.20.1/24`.

---

### 6.4 🧪 Uji Koneksi
- Ping dari VM ke host:  
  `ping <IP host>`
- Ping dari host ke VM:  
  `ping 192.168.20.1`
- Uji internet:  
  `ping google.com` atau `ping 8.8.8.8`

> 🛑
>Jika gagal, ulangi langkah konfigurasi di **6.2**.

---

## 🔄 Update & SSH Access

### 7.1 ⬆️ Update Sistem
```bash
sudo apt-get update
```

---

### 7.2 🔍 Cek & Install SSH
```bash
dpkg -l | grep openssh-server
sudo apt-get install openssh-server
```

---

### 7.3 🛡️ Konfigurasi SSH
```bash
cd /etc/ssh
ls
sudo cp sshd_config sshd_config.backup
sudo nano sshd_config
```

Ubah dua baris berikut:
```bash
#Port 22       → Port 2220
#ListenAddress 0.0.0.0 → ListenAddress 192.168.20.1
```

Simpan dan keluar:
`Ctrl + o` `Enter` `Ctrl + x`

---

### 7.4 🔁 Restart & Uji SSH
```bash
sudo systemctl restart ssh
systemctl status ssh
```

Di Windows Terminal:
```bash
ssh mininet@192.168.20.1 -p 2220
```
Pastinya muncul `Connection refused` nah ini saya juga muncul sekarang buka `Control Panel` dan ke bagian setup adapter mah pokoknya cari adapter `HostOnlyMininet` dan mencet 2x dan cari text yang ada ipv4 nya dan mencet 2x dan juga coba ubah ip ujung itu ke `192.168.20.10` dan `apply` `ok` `ok` dan kembali ke `Terminal windows` dan sekarang menyobanya lagi dan `💥Boom` . jangan `boom-boom` juga aja kamu, udah bisa apa belom itu kalau udah ya `💫Super` `💥Boom` buat kamuNya.

---

## ✅ Penutup
Selamat! 🎉 Kamu sudah berhasil menjalankan Mininet VM di Hyper-V dengan koneksi internet dan akses SSH.  Jika ada kendala, ulangi langkah dengan teliti dan jangan ragu untuk bertanya, bukan pada `saya` ya tapi, pada `Dosen`.

---