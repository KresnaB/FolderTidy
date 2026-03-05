# 🗂️ FolderTidy

**FolderTidy** adalah aplikasi desktop berbasis Electron yang dirancang untuk merapikan file-file Anda yang berantakan dalam hitungan detik. Dengan fokus pada kemudahan penggunaan dan keamanan data, FolderTidy membantu Anda mengelompokkan file berdasarkan kriteria yang Anda inginkan.

## ✨ Fitur Utama

- **Level 1 Only**: Aplikasi hanya memproses file di tingkat utama folder yang dipilih, sehingga struktur sub-folder Anda tetap aman.
- **Preview & Dry Run**: Tinjau hasil penataan sebelum benar-benar memindahkan file. Anda bisa memilih file mana saja yang ingin diproses.
- **Kategori Otomatis**:
  - **Berdasarkan Tipe**: Mengelompokkan file menjadi Dokumen, Gambar, Video, Audio, Aplikasi, Arsip, dan Kode.
  - **Berdasarkan Waktu**: Mengelompokkan file ke dalam folder "Bulan-Tahun" berdasarkan waktu modifikasi.
  - **Berdasarkan Abjad**: Mengelompokkan file berdasarkan huruf awal (A-C, D-F, dst.).
- **Custom Rules**: Buat aturan Anda sendiri! Pindahkan file dengan kata kunci tertentu langsung ke folder tujuan pilihan Anda.
- **Undo Operation**: Salah pilih? Jangan khawatir! Anda dapat membatalkan operasi terakhir dan mengembalikan file ke tempat asalnya.
- **Anti-Overwrite**: Jika file dengan nama yang sama sudah ada di folder tujuan, FolderTidy akan otomatis menambahkan angka (misal: `laporan (1).pdf`) agar tidak ada data yang tertimpa.

## 🚀 Cara Penggunaan

1. **Pilih Folder**: Klik tombol "Pilih Folder" dan tentukan folder yang ingin Anda rapikan.
2. **Pilih Mode**: Tentukan kriteria pengelompokan (Tipe, Waktu, atau Abjad).
3. **Aturan Kustom (Opsional)**: Tambahkan kata kunci dan folder tujuan jika Anda ingin penataan yang lebih spesifik.
4. **Pratinjau**: Klik "Pratinjau" untuk melihat daftar file dan tujuan pemindahannya.
5. **Eksekusi**: Klik "Rapikan Sekarang!" untuk mulai memindahkan file.
6. **Batal (Undo)**: Jika diperlukan, klik tombol "Undo" di kanan atas untuk membatalkan proses terakhir.

## 📥 Download

Anda dapat mengunduh FolderTidy untuk platform berikut:

- **Windows**: [Download .exe (Installer)](dist/FolderTidy%20Setup%201.0.0.exe) | [Download .msi](dist/FolderTidy_1.0.0.msi)
- **macOS**: [Download .dmg](dist/FolderTidy-1.0.0.dmg)
- **Linux**: [Download .AppImage](dist/FolderTidy-1.0.0.AppImage)

> **Catatan**: Link di atas akan aktif setelah proses build selesai.

## 🛠️ Pengembangan (Development)

Jika Anda ingin menjalankan aplikasi dari source code:

```bash
# Clone repository ini (jika ada)
# Masuk ke direktori proyek
cd folder-tidy

# Install dependensi
npm install

# Jalankan aplikasi
npm start

# Build untuk distribusi
npm run build:win
```

---

Dibuat dengan ❤️.
