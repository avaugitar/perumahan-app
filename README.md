<p align="justify">
  <h2><b>Perumahan App</b></h2> Sebuah aplikasi web interaktif administrasi perumahan berbasis Laravel, React JS, dan MySQL. Aplikasi ini digunakan untuk mengelola data penghuni, rumah, riwayat hunian, pembayaran iuran, serta laporan pemasukan dan pengeluaran.
</p>

<h2><b>Fitur Utama</b></h2>

* Dashboard
* Manajemen penghuni dan rumah
* Penghuni rumah (riwayat hunian
* Pembayaran iuran
* Laporan keuangan

<h2><b>Teknologi yang Digunakan</b></h2>

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

<h2><b>Catatan Penggunaan Terminal</b></h2>
<h3><b>Backend (Laravel)</b></h3>
<p align="justify">
Untuk menjalankan backend Laravel, disarankan menggunakan <b>Terminal Laragon</b> atau terminal yang sudah terhubung dengan PHP & Composer.
</p>

* Hal ini karena backend membutuhkan: <b>PHP</b>, <b>Composer</b>, <b>MySQL.</b>

* Jika di CMD biasa muncul error seperti: ```composer is not recognized```

* maka itu berarti Composer belum terdeteksi di sistem PATH.
