# 🗂️ FolderTidy

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

**FolderTidy** is an Electron-based desktop application designed to tidy up your messy files in seconds. With a focus on ease of use and data safety, FolderTidy helps you group files according to your desired criteria.

### ✨ Key Features

- **Level 1 Only**: The app only processes files at the root level of the selected folder, keeping your sub-folder structure safe.
- **Preview & Dry Run**: Review the results before actually moving files. You can select exactly which files to process.
- **Automatic Categories**:
  - **By Type**: Groups files into Documents, Images, Videos, Audio, Applications, Archives, and Code.
  - **By Time**: Groups files into "Month-Year" folders based on modification time.
  - **By Alphabet**: Groups files based on the starting letter (A-C, D-F, etc.).
  - **By Size**: Groups files into Large (> 1GB), Medium (100MB - 1GB), and Small (< 100MB).
- **Custom Rules (Enhanced)**: Create your own rules! Use tags to match multiple keywords or extensions and move them to a specific target folder.
- **Multi-language Support**: Easily switch between **English** and **Indonesian** in the app.
- **Undo Operation**: Made a mistake? Don't worry! You can undo the last operation and return files to their original place.
- **Anti-Overwrite**: If a file with the same name already exists in the target folder, FolderTidy automatically adds a number (e.g., `report (1).pdf`) to prevent data loss.

### 🚀 How to Use

1. **Select Folder**: Click "Select Folder" and choose the directory you want to tidy.
2. **Select Mode**: Choose a grouping criterion (Type, Time, Alphabet, Size, or Custom).
3. **Custom Rules (Optional)**: Add keywords/extensions as tags and set a target folder for specific organization.
4. **Preview**: Click "Preview" to see the list of files and their destinations.
5. **Execute**: Click "Tidy Now!" to start moving the files.
6. **Undo**: If needed, click the "Undo" button in the top right.

### 📄 License
This project is licensed under the **MIT License**. Check the [LICENSE](LICENSE) file for details.

---

## Bahasa Indonesia

**FolderTidy** adalah aplikasi desktop berbasis Electron yang dirancang untuk merapikan file-file Anda yang berantakan dalam hitungan detik. Dengan fokus pada kemudahan penggunaan dan keamanan data, FolderTidy membantu Anda mengelompokkan file berdasarkan kriteria yang Anda inginkan.

### ✨ Fitur Utama

- **Level 1 Only**: Aplikasi hanya memproses file di tingkat utama folder yang dipilih, sehingga struktur sub-folder Anda tetap aman.
- **Preview & Dry Run**: Tinjau hasil penataan sebelum benar-benar memindahkan file. Anda bisa memilih file mana saja yang ingin diproses.
- **Kategori Otomatis**:
  - **Berdasarkan Tipe**: Mengelompokkan file menjadi Dokumen, Gambar, Video, Audio, Aplikasi, Arsip, dan Kode.
  - **Berdasarkan Waktu**: Mengelompokkan file ke dalam folder "Bulan-Tahun" berdasarkan waktu modifikasi.
  - **Berdasarkan Abjad**: Mengelompokkan file berdasarkan huruf awal (A-C, D-F, dst.).
  - **Berdasarkan Ukuran**: Mengelompokkan file berdasarkan ukuran (Besar, Menengah, Kecil).
- **Aturan Kustom (Tingkat Lanjut)**: Buat aturan Anda sendiri! Gunakan sistem tag untuk mencocokkan beberapa kata kunci atau ekstensi sekaligus dalam satu aturan.
- **Dukungan Multi-bahasa**: Ganti bahasa aplikasi antara **Bahasa Indonesia** dan **Inggris** dengan mudah.
- **Undo Operation**: Salah pilih? Jangan khawatir! Anda dapat membatalkan operasi terakhir dan mengembalikan file ke tempat asalnya.
- **Anti-Overwrite**: Jika file dengan nama yang sama sudah ada di folder tujuan, FolderTidy akan otomatis menambahkan angka (misal: `laporan (1).pdf`) agar tidak ada data yang tertimpa.

### 🚀 Cara Penggunaan

1. **Pilih Folder**: Klik "Pilih Folder" dan tentukan folder yang ingin Anda rapikan.
2. **Pilih Mode**: Tentukan kriteria pengelompokan (Tipe, Waktu, Abjad, Ukuran, atau Kustom).
3. **Aturan Kustom (Opsional)**: Tambahkan tag (kata kunci/ekstensi) dan folder tujuan jika Anda ingin penataan yang lebih spesifik.
4. **Pratinjau**: Klik "Pratinjau" untuk melihat daftar file dan tujuan pemindahannya.
5. **Eksekusi**: Klik "Rapikan Sekarang!" untuk mulai memindahkan file.
6. **Batal (Undo)**: Jika diperlukan, klik tombol "Undo" di kanan atas untuk membatalkan proses terakhir.

### 📄 Lisensi
Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detailnya.

---

## 📥 Download

You can download the latest version of **FolderTidy** from the **Releases** page:

👉 **[Download FolderTidy (Windows)](https://github.com/KresnaB/FolderTidy/releases/latest)**

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/KresnaB/FolderTidy.git
cd folder-tidy

# Install dependencies
npm install

# Run the app
npm start

# Build for distribution
npm run build
```

---