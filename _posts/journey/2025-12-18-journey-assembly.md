<div align="center">
    <picture>
    <img src="https://www.nasm.us/images/nasmlogw.png" width="400" alt="NASM Logo">
    </picture>
    <h1 align="center">🚀 Journey 01: Menembus Jantung Komputer dengan Assembly (x86)</h1>
    <p align="center">
    <b>Low-Level Fundamental: Understanding How CPU and Kernel Communicates</b><br/>
    Laboratorium: Debian 7 "Wheezy" i386 | NASM | GNU Linker
    </p>
</div>

---

### 1. Pendahuluan: Bertamu ke Rumah CPU

Dalam perjalanan ini, saya meninggalkan kenyamanan bahasa tingkat tinggi. Saya menggunakan **Assembly x86**, bahasa yang langsung memanipulasi **Register CPU**. Di sini tidak ada variabel gaib; yang ada hanyalah aliran data fisik antar register dan alamat memori.

### 2. Required (Persiapan Lab)

* **Arsitektur:** i386 (32-bit) Memilih 32-bit agar struktur register lebih mudah dipahami pemula (EAX, EBX, ECX, EDX).
* **Toolchain:**
* `nasm`: Mengubah instruksi menjadi *Machine Code*.
* `ld`: Menghubungkan kode kita dengan protokol eksekusi sistem operasi (ELF).

---

### 3. Langkah-Langkah & Eksperimen Logika

#### 🔴 Langkah 01: The Silent Success (sys_exit)

**Tujuan:** Memahami cara mengakhiri program secara elegan di mata sistem operasi.

```assembly
; exit.asm
section .text
    global _start
_start:
    mov eax, 1    ; Syscall number for sys_exit
    mov ebx, 0    ; Exit status 0 (Success)
    int 0x80      ; Interrupt to call kernel

```

* **Analogi:** Seperti mematikan saklar lampu dengan benar agar tidak terjadi korsleting.
* **Result:** Perintah `echo $?` menghasilkan `0`, tanda komunikasi dengan Kernel sukses.

#### 🟡 Langkah 02 & 03: The Digital Pulse (sys_write)

**Tujuan:** Memahami bagaimana teks muncul di layar melalui alokasi memori statis.

```assembly
; pulse.asm
section .data
    msg db 'Hello!', 10  ; 10 adalah kode ASCII untuk New Line
    len equ $ - msg      ; Trik assembler untuk menghitung panjang data secara otomatis

section .text
    global _start
_start:
    mov eax, 4      ; Syscall sys_write
    mov ebx, 1      ; File descriptor (1 = stdout/layar)
    mov ecx, msg    ; Pointer: Alamat memori teks kita
    mov edx, len    ; Panjang data
    int 0x80

```

* **Insight:** Tanpa angka `10` (Line Feed), output menyatu dengan prompt terminal. Komputer tidak punya "perasaan", dia hanya mencetak apa yang kita minta secara literal.

#### 🟢 Checkpoint: The Interactive Greeting (sys_read)

**Tujuan:** Mengelola memori dinamis (input user) menggunakan buffer.

```assembly
; greet.asm
section .bss
    name resb 16    ; Memesan 16 byte "tanah kosong" di RAM

section .text
    global _start
_start:
    ; (Input Section)
    mov eax, 3      ; Syscall sys_read
    mov ebx, 0      ; File descriptor (0 = stdin/keyboard)
    mov ecx, name   ; Simpan ke buffer 'name'
    mov edx, 16     ; Batas maksimal input
    int 0x80
    ; (Output Section memanggil kembali 'name' yang sudah terisi)

```

* **Analogi:** Kita menyediakan kotak kosong (`.bss`), menunggu user mengisinya, lalu mengambil isi kotak tersebut untuk diproses kembali.

---

### 4. Kesimpulan & Impact

* **Pointers:** Saya kini paham bahwa variabel sebenarnya adalah label untuk sebuah alamat di memori fisik.
* **Kernel Call:** Program tidak bisa berjalan sendirian; ia harus meminta izin ke Kernel (via `int 0x80`) untuk mengakses hardware.
* **Efficiency:** Saya melihat betapa ringannya program hasil kompilasi Assembly (hanya beberapa ratus byte!).

**Next Stop:** Migrasi ke **Bahasa C** Saya akan melihat bagaimana C bertindak sebagai "Penerjemah" yang membungkus kerumitan instruksi Assembly ini menjadi fungsi yang lebih manusiawi tanpa kehilangan kontrol pada memori.

---

<div align="center">
<p><b>Created with ❤️ by Teungku | 🤖 Gemini</b></p>
<p><i>"Understanding the bits before the bytes."</i></p>
</div>
