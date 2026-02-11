# Contributing

Terima kasih telah berkontribusi. File ini menjelaskan standar pesan commit, mapping emoji, dan praktik yang disarankan agar riwayat git konsisten, mudah dibaca, dan kompatibel dengan tooling industri.

---

## Prinsip Utama
- **Gunakan Conventional Commits** sebagai dasar: `<type>(<scope>): <subject>`.
- **Tambahkan emoji** sebagai lapisan visual, tetapi jangan menggantikan struktur semantik.
- **Letakkan referensi issue** di body/footer menggunakan kata kunci GitHub seperti `Closes`, `Fixes`, atau `Resolves`.
- **Konsistensi** lebih penting daripada gaya; dokumentasikan konvensi dan patuhi.

---

## Format Pesan Commit
**Struktur dasar**
```bash
<type>(<scope>): <subject>

<body>

<footer>
```

**Aturan singkat**
- **type** wajib. Contoh: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `ci`.
- **scope** opsional. Gunakan nama modul atau area yang terpengaruh (mis. `core`, `ui`, `docs`).
- **subject** singkat, imperatif, maksimal ~50 karakter.
- **body** opsional. Jelaskan alasan, detail implementasi, atau catatan migrasi.
- **footer** untuk referensi issue dan breaking changes. Gunakan `Closes #N` untuk menutup issue.

**Contoh penggunaan `-m` berulang**
```bash
git commit -m "feat(core): ✨ setup basic boilerplate with import map" -m "Closes #2"
```
Hasil:
```
feat(core): ✨ setup basic boilerplate with import map

Closes #2
```

---

## Emoji Mapping
Gunakan emoji untuk memperjelas tipe perubahan. **Posisi yang direkomendasikan**: setelah `type` untuk menjaga kompatibilitas parser.

| Emoji | Type | Keterangan |
|---:|---|---|
| ✨ | feat | Menambahkan fitur baru |
| 🐛 | fix | Memperbaiki bug |
| 📝 | docs | Menambah atau memperbarui dokumentasi |
| 🔨 | refactor | Refactor tanpa perubahan fungsional |
| ✅ | test | Menambah atau memperbarui test |
| ♻️ | chore | Perawatan, dependency, build |
| 🔧 | perf | Perbaikan performa |
| 🔒 | security | Perbaikan keamanan |

---

## Contoh Pesan Commit Praktis

**Sederhana**
```text
feat(core): ✨ setup basic boilerplate with import map

Closes #2
```

**Dengan body dan beberapa issue**
```text
refactor(ui): 🔨 restructure header component

- pisahkan logic ke file header.js
- perbaiki responsive layout

Closes #10
Closes #11
```

**Menutup banyak issue di satu baris**
```text
fix(api): 🐛 handle null response properly

Closes #3, #4, #5
```

**Template singkat untuk copy-paste**
```
<type>(<scope>): <emoji> <short description>

- poin ringkas perubahan

Closes #<issue-number>
```

---

## Menutup Banyak Issue
- **Satu baris**:
  ```
  Closes #2, #3, #4
  ```
- **Satu baris per issue**:
  ```
  Closes #2
  Closes #3
  Closes #4
  ```
GitHub akan menutup semua issue yang disebut di footer setelah commit dipush ke branch yang terkait PR atau branch default.

---