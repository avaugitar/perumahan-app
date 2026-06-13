<p align="justify">
  <b>Perumahan App</b> adalah Sebuah aplikasi web interaktif administrasi perumahan berbasis Laravel, React JS, dan MySQL. Aplikasi ini digunakan untuk mengelola data penghuni, rumah, pembayaran iuran, serta laporan pemasukan dan pengeluaran.
</p>

<h2><b>Fitur Utama</b></h2>

<b>1. Dashboard</b>
* Total Rumah
* Total Dihuni Tetap
* Total Dihuni Kontrak
* Total Rumah Kosong
  
<b>2. Penghuni</b>
* Menambahkan data penghuni
* Mengubah / Mengedit data penghuni
* Mengunggah foto KTP melalui fitur upload file
* Status penghuni (Kontrak / Tetap)
* Nomor telepon harus diawal dengan kode negara Indonesia (62)
* Status pernikahan (Menikah / Belum Menikah)

<b>3. Rumah</b>
* Menambahkan data rumah
* Mengedit data rumah
* Menampilkan status rumah (Dihuni / Tidak Dihuni)
* Menampilkan informasi penghuni aktif pada setiap rumah

<b>4. Penghuni Rumah</b>
* Menambahkan penghuni ke rumah tertentu.
* Mengubah data penghuni rumah.
* Menyimpan riwayat penghuni pada setiap rumah.
* Menampilkan histori penghuni yang pernah menempati rumah tertentu.
* Menampilkan tanggal mulai dan tanggal selesai masa huni penghuni.

<b>5. Pembayaran</b>
* Menambahkan data pembayaran penghuni.
* Mengelola pembayaran iuran kebersihan.
* Mengelola pembayaran iuran satpam.
* Menentukan status pembayaran (Lunas atau Belum Lunas).
* Menyimpan riwayat pembayaran penghuni.
* Mendukung pembayaran bulanan maupun pembayaran untuk beberapa periode sekaligus.

<b>6. Pengeluaran</b>
* Menambahkan data pengeluaran.
* Mengubah data pengeluaran.
* Menyimpan informasi tanggal pengeluaran.
* Menyimpan nominal pengeluaran.
* Menyimpan keterangan atau deskripsi pengeluaran.

<b>7. Laporan</b>
* Menampilkan grafik pemasukan dan pengeluaran selama 1 tahun.
* Menampilkan total pemasukan bulanan.
* Menampilkan total pengeluaran bulanan.
* Menampilkan saldo bulanan.
* Menampilkan detail pemasukan dan pengeluaran berdasarkan bulan yang dipilih.
* Menampilkan ringkasan kondisi keuangan perumahan.
  
**Teknologi yang Digunakan:**

| Bagian | Teknologi |
|---------|---------|
| Backend | Laravel (PHP) |
| Frontend | React JS, Vite |
| Database | MySQL |
| Styling | CSS |

**Panduan Instalasi**

1. **Clone Repository**
   ```
   git clone https://github.com/avaugitar/perumahan-app.git
   ```
   Masuk ke folder project:
   ```
   cd perumahan-app
   ```
2. **Instalasi Backend**
   
   Masuk ke folder backend:
   ```
   cd backend
   ```
   
   **Install dependency:**
   ```
   composer install
   ```
   
   **Copy file environment:**
   ```
   copy .env.example .env
   ```

   **Buat database MySQL dengan nama:**
   ```
   perumahan_db
   ```
   
   **Konfigurasi database pada file .env:**
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=perumahan_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   
   **Generate application key:**
   ```
   php artisan key:generate
   ```
   **Bersihkan cache konfigurasi:**
   ```
   php artisan config:clear
   ```
   
   **Jalankan migration:**
   ```
   php artisan migrate
   ```
   
   **Jalankan backend:**
   ```
   php artisan serve
   ```
   
   **Backend berjalan pada:**
    ```
    http://127.0.0.1:8000
    ```

4. **Instalasi Frontend**

   Buka terminal baru, lalu masuk ke folder frontend:
   ```
   cd frontend
   ```
   
   **Install dependency:**
   ```
   npm install
   ```
   
   **Jalankan frontend:**
   ```
   npm run dev
   ```
   
   **Frontend berjalan pada:**
   ```
   http://localhost:5173
   ```
<h2><b>Struktur Direktori</b></h2>

```
perumahan-app/
├── backend/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── tests/
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── artisan
├── composer.json
├── composer.lock
├── package.json
├── phpunit.xml
├── vite.config.js
└── README.md
│
├── frontend/
├── public/
├── src/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json/
├── package.json
├── README.md
└── vite.config.js
```

**Menjalankan Aplikasi**
1. Jalankan Apache dan MYSQL melalui Laragon.
2. Buat database dengan nama perumahan_db.
3. Jalankan backend menggunakan ```php artisan serve```
4. Jalankan frontend menggunakan ```npm run dev```
