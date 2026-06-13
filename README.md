<h2><b>🏘️ Perumahan App</b></h2> 
<p align="justify">Sebuah aplikasi web interaktif administrasi perumahan berbasis Laravel, React JS, dan MySQL. Aplikasi ini digunakan untuk mengelola data penghuni, rumah, riwayat hunian, pembayaran iuran, pengeluaran, serta laporan pemasukan dan pengeluaran.</p>

<h2><b>💻 Fitur Utama</b></h2>

* Dashboard
* Manajemen penghuni dan rumah
* Penghuni rumah (riwayat hunian)
* Pembayaran iuran
* Laporan keuangan

<h2><b>🛠️ Teknologi yang Digunakan</b></h2>

| Bagian | Teknologi |
|---------|---------|
| Backend | Laravel (PHP) |
| Frontend | React JS + Vite |
| Database | MySQL |

<h2><b>⚙️ Panduan Instalasi</b></h2>

<b>1. Clone Repository</b>

   Buka terminal (disarankan Laragon Terminal) yang sudah terhubung dengan PHP, Composer, dan MySQL.
   
   ```
   git clone https://github.com/avaugitar/perumahan-app.git
   ```
   Masuk ke folder project:
   ```
   cd perumahan-app
   ```

<b>2. Instalasi Backend</b>
   
   Masuk ke folder backend:
   ```
   cd backend
   ```
   
   <b>Install dependency:</b>
   ```
   composer install
   ```
   
   <b>Copy file environment:</b>
   ```
   copy .env.example .env
   ```

   <b>Buat database MySQL dengan nama:</b>
   ```
   perumahan_db
   ```
   
   <b>Konfigurasi database pada file .env:</b>
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=perumahan_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   
   <b>Generate application key:</b>
   ```
   php artisan key:generate
   ```
   <b>Bersihkan cache konfigurasi:</b>
   ```
   php artisan config:clear
   ```
   
   <b>Jalankan migration:</b>
   ```
   php artisan migrate
   ```

   <b>Manual Tinker</b>
   ```
   php artisan tinker
   ```

Lalu tambahkan data berikut:

1)    ```
      'name' => 'Sampah',

      'amount' => 15000,

      'description' => 'Iuran Kebersihan',

      'is_active' => 1, 
    
      ]);
2)  ```
    'name' => 'Satpam',

    'amount' => 100000,

    'description' => 'Iuran keamanan',

    'is_active' => 1,
    
    ]);
   <b>Jalankan backend:</b>
   ```
   php artisan serve
   ```
   
   <b>Backend berjalan pada:</b>

   ```
   http://127.0.0.1:8000
   ```

<b>3. Instalasi Frontend</b>

   Buka terminal baru, lalu masuk ke folder frontend:
   ```
   cd frontend
   ```
   
   <b>Install dependency:</b>
   ```
   npm install
   ```
   
   <b>Jalankan frontend:</b>
   ```
   npm run dev
   ```
   
   <b>Frontend berjalan pada:</b>
   ```
   http://localhost:5173
   ```
<h2><b>Struktur Direktori</b></h2>

```
perumahan-app/
├── backend/   (Laravel API)
├── frontend/  (React JS)
└── README.md
```
