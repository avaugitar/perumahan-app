**Perumahan App**

Aplikasi administrasi perumahan berbasis Laravel, React JS, dan MySQL. Aplikais ini digunakan untuk mengelola data penghuni, rumah, pembayaran iuran, serta laporan pemasukan dan pengeluaran.

**Fitur Utama**

1. Dashboard
* Total Rumah
* Total Dihuni Tetap
* Total Dihuni Kontrak
* Total Rumah Kosong
  
2. Penghuni
* Menambahkan data penghuni
* Mengubah / Mengedit data penghuni
* Mengunggah foto KTP melalui fitur upload file
* Status penghuni (Kontrak / Tetap)
* Nomor telepon harus diawal dengan kode negara Indonesia (62)
* Status pernikahan (Menikah / Belum Menikah)

3. Rumah
* Menambahkan data rumah
* Mengedit data rumah
* Menampilkan status rumah (Dihuni / Tidak Dihuni)
* Menampilkan informasi penghuni aktif pada setiap rumah

4. Penghuni Rumah
* Menambahkan penghuni ke rumah tertentu.
* Mengubah data penghuni rumah.
* Menyimpan riwayat penghuni pada setiap rumah.
* Menampilkan histori penghuni yang pernah menempati rumah tertentu.
* Menampilkan tanggal mulai dan tanggal selesai masa huni penghuni.

5. Pembayaran
* Menambahkan data pembayaran penghuni.
* Mengelola pembayaran iuran kebersihan.
* Mengelola pembayaran iuran satpam.
* Menentukan status pembayaran (Lunas atau Belum Lunas).
* Menyimpan riwayat pembayaran penghuni.
* Mendukung pembayaran bulanan maupun pembayaran untuk beberapa periode sekaligus.

6. Pengeluaran

* Menambahkan data pengeluaran.
* Mengubah data pengeluaran.
* Menyimpan informasi tanggal pengeluaran.
* Menyimpan nominal pengeluaran.
* Menyimpan keterangan atau deskripsi pengeluaran.

7. Laporan

* Menampilkan grafik pemasukan dan pengeluaran selama 1 tahun.
* Menampilkan total pemasukan bulanan.
* Menampilkan total pengeluaran bulanan.
* Menampilkan saldo bulanan.
* Menampilkan detail pemasukan dan pengeluaran berdasarkan bulan yang dipilih.
* Menampilkan ringkasan kondisi keuangan perumahan.
  
Teknologi yang Digunakan

**Backend**

* Laravel
* PHP
* MySQL

**Frontend**

* React JS
* Vite

**Nama database:** perumahan_db

**Instalasi Backend**

1. Masuk ke folder backend
   cd backend
   
3. Install dependency
   composer install

5. Copy file environment (Windows)
   copy .env.example .env

6. Konfigurasi database

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=perumahan_db
   DB_USERNAME=root
   DB_PASSWORD=
   
8. Generate application key
   
   php artisan key:generate

10. Jalankan migration

   php artisan migrate

12. Jalankan backend

   php artisan serve

Backend berjalan pada: http://127.0.0.1:8000

**Instalasi Frontend**

1. Masuk ke folder frontend

   cd frontend

2. Install dependency React

   npm install
   
4. Jalankan frontend

   npm run dev

Frontend berjalan pada: http://localhost:5173

**Menjalankan Aplikasi**
1. Jalankan Apache dan MYSQL melalui Laragon.
2. Buat database dengan nama perumahan_db.
3. Jalankan backend menggunakan php artisan serve.
4. Jalankan frontend menggunakan npm run dev.
