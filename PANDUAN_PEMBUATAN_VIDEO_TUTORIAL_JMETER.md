# PANDUAN LENGKAP PEMBUATAN VIDEO TUTORIAL SYSTEM TESTING JMETER GUI
## Studi Kasus: SkyPass Airlines (15 Test Cases ISTQB & 3 Presenter)

Dokumen ini disusun sebagai panduan operasional, storyboard, dan naskah resmi (*script video*) untuk memproduksi video tutorial pengujian sistem (*System Testing*) menggunakan **Apache JMeter GUI**.

---

## 📑 DAFTAR ISI
1. [Informasi Umum Proyek Video](#1-informasi-umum-proyek-video)
2. [Checklist Persiapan Teknis Sebelum Record](#2-checklist-persiapan-teknis-sebelum-record)
3. [Rundown & Pembagian Peran 3 Anggota](#3-rundown--pembagian-peran-3-anggota)
4. [Materi Wajib 1: Fitur-Fitur Utama Apache JMeter GUI](#4-materi-wajib-1-fitur-fitur-utama-apache-jmeter-gui)
5. [Materi Wajib 2: Ragam Jenis System Testing pada Studi Kasus](#5-materi-wajib-2-ragam-jenis-system-testing-pada-studi-kasus)
6. [Storyboard & Naskah Narasi Percakapan (Word-by-Word Script)](#6-storyboard--naskah-narasi-percakapan)
   - [Segmen 1: Pembukaan & Bedah Fitur JMeter (Orang 1)](#segmen-1-pembukaan--bedah-fitur-jmeter-orang-1)
   - [Segmen 2: Live Run & Demo TC01 – TC05 (Orang 1)](#segmen-2-live-run--demo-tc01--tc05-orang-1)
   - [Segmen 3: Demo TC06 – TC10 (Orang 2)](#segmen-3-demo-tc06--tc10-orang-2)
   - [Segmen 4: Demo TC11 – TC15 & Summary Report (Orang 3)](#segmen-4-demo-tc11--tc15--summary-report-orang-3)
7. [Panduan Troubleshooting & Tips Rekaman Berkualitas Tinggi](#7-panduan-troubleshooting--tips-rekaman-berkualitas-tinggi)

---

## 1. INFORMASI UMUM PROYEK VIDEO

* **Topik Video:** Tutorial Langsung Penjelasan Fitur-Fitur & Praktik Ragam Jenis System Testing Menggunakan Apache JMeter GUI.
* **Aplikasi Target (Studi Kasus):** **SkyPass Airlines** (Sistem Reservasi Penerbangan Komersial berbasis Web & REST API Node.js/Express).
* **File Test Plan:** `skypass-system-testing.jmx` (1 Setup + 15 Test Cases standar ISTQB).
* **Estimasi Durasi Video:** **± 12 – 15 Menit**.
* **Format Tim:** 3 Orang Presenter (masing-masing memegang 5 Test Case secara seimbang).

---

## 2. CHECKLIST PERSIAPAN TEKNIS SEBELUM RECORD

Sebelum menekan tombol *Record*, pastikan langkah-langkah persiapan berikut sudah selesai:

1. [ ] **Software Rekam Layar & Audio:**
   * Rekomendasi: **OBS Studio** (gratis), **Clipchamp**, atau **Xbox Game Bar (`Win + G`)**.
   * Resolusi rekam: **1080p (1920x1080)**, pastikan input mikrofon jernih tanpa noise.
2. [ ] **Backend Server SkyPass Airlines Aktif:**
   * Buka Terminal (PowerShell) di folder proyek:
     ```powershell
     npm start
     ```
   * Pastikan output: `SkyPass Airlines Server running on http://localhost:3000`.
   * Buka tab browser ke `http://localhost:3000` (siapkan untuk cuplikan visual singkat di awal video).
3. [ ] **Apache JMeter GUI Terbuka:**
   * Buka JMeter dari: `C:\Users\HP\apache-jmeter-5.6.3\bin\jmeter.bat`.
   * Buka file proyek: `File -> Open -> skypass-system-testing.jmx`.
   * **Tips Tampilan:** Perbesar font antarmuka agar terbaca jelas di video melalui menu:  
     `Options -> Zoom In` (atau tekan beberapa kali sampai font terlihat proporsional).
   * Klik tombol **Clear All (ikon dua sapu kuning)** di toolbar atas agar listener bersih dari eksekusi lama.

---

## 3. RUNDOWN & PEMBAGIAN PERAN 3 ANGGOTA

Alokasi dibagi rata menjadi **5 Test Case per orang** berdasarkan fase alur transaksi bisnis:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        STRUKTUR RUNDOWN VIDEO TUTORIAL JMETER                          │
├────────────────────┬────────────────────┬─────────────────────┬────────────────────────┤
│      SEGMEN 1      │      SEGMEN 2      │       SEGMEN 3      │        SEGMEN 4        │
│ Pembicara: Orang 1 │ Pembicara: Orang 1 │ Pembicara: Orang 2  │   Pembicara: Orang 3   │
│  Intro & Penjelasan│  Live Run & Demo   │   Live Demo Lanjut  │ Live Demo State & SMRY │
│    Fitur JMeter    │  TC01 s/d TC05     │    TC06 s/d TC10    │ TC11 s/d TC15 + WrapUp │
│    (± 3 Menit)     │    (± 3 Menit)     │     (± 4 Menit)     │      (± 4 Menit)       │
└────────────────────┴────────────────────┴─────────────────────┴────────────────────────┘
```

| Presenter | Cakupan Bagian | Skenario Uji | Tema & Peran |
| :--- | :--- | :--- | :--- |
| **Anggota 1** | Segmen 1 & 2 | **Setup + TC01 s/d TC05** | Intro studi kasus, bedah elemen GUI JMeter, eksekusi awal (Live Run), pengujian *Flight Discovery* & *Seat Inventory*. |
| **Anggota 2** | Segmen 3 | **TC06 s/d TC10** | Pengujian transaksi inti reservasi tiket (*Booking*), penanganan tabrakan data (*Concurrency Collision*), validasi sintaks & batas armada, integritas penyimpanan (*Data Persistence*). |
| **Anggota 3** | Segmen 4 | **TC11 s/d TC15 + Summary** | Pengujian pencarian negatif, alur check-in mandiri (*State Transition*), proteksi keamanan email (*Security*), pelepasan kursi batal (*Rollback*), dan analisis laporan metrik *Summary Report*. |

---

## 4. MATERI WAJIB 1: FITUR-FITUR UTAMA APACHE JMETER GUI

Saat merekam, tunjukkan komponen-komponen berikut di panel kiri JMeter:

1. **Test Plan & Thread Group:**
   * Elemen root dan wadah utama pengujian. Menentukan beban pengguna (*Number of Threads/Users*, *Ramp-Up Period*, dan *Loop Count*).
2. **Config Elements (Konfigurasi Terpusat):**
   * **HTTP Request Defaults:** Memusatkan alamat server (`Server: localhost`, `Port: 3000`). Jika server berpindah IP, penguji tidak perlu mengedit 15 sampler satu per satu.
   * **HTTP Header Manager:** Menyematkan header HTTP global seperti `Content-Type: application/json`.
3. **Samplers (HTTP Request):**
   * Komponen pengirim request jaringan sesungguhnya (mendukung method `GET`, `POST`, Query Parameters, serta JSON Body Data).
4. **Post-Processors (JSON Extractor) — *Fitur Unggulan Dinamis*:**
   * Fitur untuk membaca respons JSON dari server dan menyimpannya ke variabel JMeter (misal: `${var_flightNumber}`, `${var_seatNumber}`, `${var_pnr}`). Menghilangkan ketergantungan data *hardcoded*.
5. **Assertions (Mekanisme Validasi):**
   * **Response Code Assertion:** Memverifikasi status code HTTP (200, 201, 400, 403, 404, 409).
   * **JSON Path Assertion:** Memverifikasi struktur dan nilai key dalam payload respons JSON.
   * **Fitur "Ignore Status":** Fitur vital pada pengujian negatif. Memberitahu JMeter bahwa respons 4xx/5xx yang dikembalikan server adalah respons yang diharapkan, sehingga JMeter tetap memberi indikator centang hijau (*Passed*).
6. **Listeners (Penyaji & Analisis Hasil):**
   * **View Results Tree:** Alat inspeksi mendalam untuk melihat detail teknis per sampler (tab *Sampler result*, *Request*, dan *Response data*).
   * **Summary Report:** Tabel agregasi statistik kinerja sistem (jumlah sampel, waktu latensi rata-rata, throughput, dan persentase error).

---

## 5. MATERI WAJIB 2: RAGAM JENIS SYSTEM TESTING PADA STUDI KASUS

Jelaskan bahwa pengujian pada SkyPass Airlines mencakup **7 ragam jenis System Testing** standar industri (ISTQB):

| No | Ragam Jenis System Testing | Penjelasan Konsep Uji | Implementasi pada Proyek SkyPass |
| :--: | :--- | :--- | :--- |
| **1** | **Positive Functional Testing** | Menguji fungsionalitas sistem pada kondisi normal menggunakan input yang valid (*Happy Path*). | **TC01** (Cari rute resmi CGK-DPS)<br>**TC06** (Reservasi kursi 1A valid)<br>**TC12** (Check-in mandiri valid) |
| **2** | **Negative Functional Testing** | Menguji ketahanan sistem ketika menerima data yang tidak ada di basis data tanpa mengalami error internal. | **TC02** (Cari rute fiktif `CGK ke XYZ` &rarr; respons array kosong `[]`)<br>**TC11** (Query PNR fiktif `FAKEXX` &rarr; `404 Not Found`) |
| **3** | **Boundary Value Analysis (BVA)** | Menguji kondisi batas antarmuka API serta batas fisik domain aplikasi. | **TC03** (Parameter destination hilang &rarr; `400 Bad Request`)<br>**TC09** (Pemesanan kursi `99Z` di luar fisik kabin &rarr; `400 Bad Request`) |
| **4** | **Input Schema & Syntax Validation** | Menguji kepatuhan masukan data terhadap format aturan sintaks (seperti regex format email). | **TC08** (Pemesanan dengan format email rusak `"not-an-email"` &rarr; `400 Bad Request`) |
| **5** | **Concurrency & Collision Prevention** | Menguji ketahanan sistem terhadap tabrakan transaksi simultan (*race condition*) pada sumber daya yang sama. | **TC07** (Upaya pemesanan ulang kursi 1A yang sudah terpesan &rarr; ditolak dengan `409 Conflict`) |
| **6** | **Security & Access Authorization** | Menguji mekanisme perlindungan privasi data agar transaksi hanya dapat diakses oleh pemilik sah. | **TC14** (Check-in PNR sah menggunakan alamat email orang lain/hacker &rarr; dicekal `403 Forbidden`) |
| **7** | **State Machine & Inventory Rollback** | Menguji validitas siklus status transaksi serta kemampuan sistem memulihkan inventaris saat pembatalan. | **TC13** (Cegah check-in ganda)<br>**TC15** (Batal tiket & kursi 1A otomatis kembali *Available*) |

---

## 6. STORYBOARD & NASKAH NARASI PERCAKAPAN

Gunakan naskah ini sebagai panduan bicara langsung saat merekam video:

---

### SEGMEN 1: Pembukaan & Bedah Fitur JMeter (Orang 1)
**Durasi:** ± 00:00 – 03:00  
**Pembicara:** Anggota 1

#### 🎬 Aksi Visual:
1. Mulai dengan menampilkan browser di `http://localhost:3000` (sekitar 15 detik), tunjukkan halaman beranda SkyPass Airlines.
2. Beralih ke layar **Apache JMeter GUI**.
3. Di panel kiri, klik satu per satu:
   * Root: `SkyPass Airlines - 15 System Testing Suite`
   * `HTTP Request Defaults`
   * `HTTP Header Manager`
   * `SkyPass System Testing Thread Group`

#### 🎙️ Naskah Bicara:
> *"Halo semuanya! Selamat datang di video tutorial pengujian perangkat lunak. Pada kesempatan kali ini, kelompok kami akan mempraktikkan secara langsung bagaimana melakukan berbagai jenis **System Testing** menggunakan **Apache JMeter GUI** pada studi kasus aplikasi reservasi penerbangan komersial, yaitu **SkyPass Airlines**.*
>
> *(Arahkan ke JMeter)*  
> *Sebelum kita masuk ke eksekusi pengujian, mari kita bedah terlebih dahulu fitur-fitur dan arsitektur pengujian yang telah kami bangun di dalam JMeter GUI.*
>
> *Di panel sebelah kiri, kita memiliki hierarki Test Plan. Pertama, ada komponen **Config Element** bernama **HTTP Request Defaults**. Di sini kami telah mendefinisikan Server Name ke `localhost` dan Port ke `3000`. Fitur ini sangat bermanfaat karena seluruh konfigurasi jaringan terpusat, sehingga jika alamat server berubah, kita tidak perlu mengedit 15 sampler satu per satu.*
>
> *Kedua, kami menggunakan **HTTP Header Manager** untuk menetapkan header `Content-Type: application/json` secara global ke seluruh request API.*
>
> *Ketiga, di dalam **Thread Group**, kami menetapkan 1 user virtual untuk menguji integritas alur transaksi end-to-end secara berurutan. Keunggulan skrip pengujian kami adalah penggunaan **Post-Processor JSON Extractor**. Fitur ini memungkinkan data dari respons server—seperti nomor penerbangan, kursi, dan kode PNR—diekstrak secara dinamis ke dalam variabel `${var_pnr}`, sehingga pengujian tidak bergantung pada data statis atau hardcoded.*
>
> *Selanjutnya, kita akan mengeksekusi pengujian dan membedah skenario pengujian tahap pertama."*

---

### SEGMEN 2: Live Run & Demo TC01 – TC05 (Orang 1)
**Durasi:** ± 03:00 – 06:00  
**Pembicara:** Anggota 1

#### 🎬 Aksi Visual:
1. Klik elemen listener **View Results Tree** di panel kiri bawah.
2. Klik tombol **Clear All** (ikon dua sapu kuning di toolbar atas).
3. Klik tombol **Start** (ikon segitiga Play hijau).
4. Sorot pohon hasil: tunjukkan dari Setup sampai TC15 semuanya langsung centang hijau!
5. Klik sampler **Setup - Reset Database**: buka tab *Response data*.
6. Klik sampler **TC01**: buka tab *Response data*, lalu perlihatkan sub-elemen *JSON Extractor* di panel kiri.
7. Klik sampler **TC02**: buka tab *Response data* (array kosong `[]`).
8. Klik sampler **TC03**: buka tab *Response headers* (`400 Bad Request`).
9. Klik sampler **TC04** & **TC05**: buka tab *Response data* (30 kursi dan respons 404).

#### 🎙️ Naskah Bicara:
> *"Sekarang kita buka listener **View Results Tree**. Kita bersihkan riwayat lama dengan tombol Clear All, lalu kita klik tombol **Start hijau**.*
>
> *(Tunggu 1 detik)*  
> *Bisa kita lihat bersama, dalam hitungan detik, seluruh skenario pengujian dari awal hingga akhir berhasil dieksekusi dengan indikator centang hijau.*
>
> *Mari kita bedah 5 skenario awal:*
> * *Pertama, pada tahap **Setup**, kami mengirimkan `POST /api/system/reset`. Tujuannya menjamin prinsip **Idempotensi**, yaitu mereset basis data ke kondisi awal sehingga pengujian dapat diulang berkali-kali tanpa terganggu sisa data pengujian sebelumnya.*
> * *Pada **TC01**, ini adalah contoh **Positive Functional Testing**. Kita mencari rute penerbangan Jakarta ke Bali. Server merespons `200 OK`, dan di bawah sampler ini terdapat **JSON Extractor** yang otomatis menangkap nomor penerbangan `AW-101` ke variabel `${var_flightNumber}`.*
> * *Pada **TC02**, kita mempraktikkan **Negative Functional Testing** dengan mencari rute fiktif Jakarta ke XYZ. Sistem terbukti tangguh dengan mengembalikan array kosong `[]` tanpa mengalami crash.*
> * *Pada **TC03**, kita menerapkan **Boundary Value Analysis** pada kelengkapan input. Parameter destination sengaja dihilangkan, dan sistem dengan tepat menolak dengan kode `400 Bad Request`.*
> * *Terakhir, pada **TC04** dan **TC05**, kita menguji inventaris denah kabin. TC04 menampilkan denah 30 kursi kabin Boeing 737-800, sedangkan TC05 menguji boundary denah pesawat fiktif yang ditolak dengan `404 Not Found`.*
>
> *Selanjutnya untuk demonstrasi pemesanan tiket dan pencegahan tabrakan data akan dilanjutkan oleh rekan saya."*

---

### SEGMEN 3: Demo TC06 – TC10 (Orang 2)
**Durasi:** ± 06:00 – 10:00  
**Pembicara:** Anggota 2

#### 🎬 Aksi Visual:
1. Klik sampler **TC06**:
   * Buka tab **Request**: sorot payload JSON identitas penumpang (Budi Santoso, kursi `1A`).
   * Buka tab **Response data**: sorot kode status `201 Created`, status `"CONFIRMED"`, dan PNR 6 karakter.
   * Perlihatkan sub-elemen *JSON Extractor* di bawah TC06 (`$.pnr` &rarr; `${var_pnr}`).
2. Klik sampler **TC07 (Paling Krusial)**:
   * Buka tab **Request**: tunjukkan pemesanan ulang pada penerbangan dan kursi yang sama (`1A`).
   * Buka tab **Response data**: tunjukkan respons `"Seat already reserved"` dengan HTTP `409 Conflict`.
   * Buka sub-elemen **Response Assertion** di bawah TC07: sorot checkbox **Ignore Status** yang tercentang.
3. Klik sampler **TC08**: buka tab *Request* (email `"not-an-email"`) dan tab *Response data* (`400 Bad Request`).
4. Klik sampler **TC09**: buka tab *Request* (kursi `"99Z"`) dan tab *Response data* (`400 Bad Request`).
5. Klik sampler **TC10**: buka tab *Sampler result* (`GET /api/bookings/SKXXXX` & status `200 OK`).

#### 🎙️ Naskah Bicara:
> *"Terima kasih. Melanjutkan pengujian, saya akan mendemonstrasikan fase transaksi inti reservasi dan penanganan konkurensi data pada TC06 hingga TC10.*
>
> *Pada **TC06**, kita menjalankan **End-to-End Transactional Testing**. Di tab Request, kita mengirimkan payload JSON pemesanan tiket atas nama Budi Santoso pada kursi 1A. Di tab Response Data, server berhasil merespons `201 Created`, status pemesanan terkonfirmasi, dan server menerbitkan kode booking unik atau PNR 6 digit. Melalui JSON Extractor, kode PNR ini kita simpan ke variabel `${var_pnr}` untuk pengujian check-in berikutnya.*
>
> *Sekarang perhatikan **TC07**, ini adalah pengujian **Concurrency & Collision Prevention**. Pada skenario ini, kita mensimulasikan insiden tabrakan pemesanan, di mana ada permintaan lain yang mencoba memesan kembali kursi 1A yang baru saja dipesan. Sistem SkyPass terbukti sangat tangguh dengan menolak transaksi tersebut dan mengembalikan kode status `409 Conflict` dengan pesan 'Seat already reserved'.*
>
> *Nah, fitur penting JMeter yang ingin kami tunjukkan di sini adalah: meskipun server mengembalikan status error 409, sampler TC07 tetap berstatus centang hijau (Passed). Hal ini karena pada elemen **Response Assertion**, kami mengaktifkan opsi **Ignore Status**. Ini adalah teknik baku di JMeter untuk memvalidasi bahwa sistem berhasil mempertahankan integritas datanya dari pesanan ganda.*
>
> *Selanjutnya pada **TC08** dan **TC09**, kita memvalidasi skema input dan batasan fisik armada pesawat. TC08 membuktikan server menolak format email yang tidak valid, dan TC09 membuktikan server menolak nomor kursi di luar batas kabin pesawat seperti '99Z'.*
>
> *Di penutup bagian saya, pada **TC10**, kita melakukan pengujian **Data Persistence Integrity**. Kita memanggil kembali detail booking berdasarkan kode PNR dinamis tadi. Hasilnya status `200 OK` dan data penumpang tersaji 100% konsisten, membuktikan data benar-benar tersimpan di storage server.*
>
> *Untuk alur check-in mandiri dan analisis laporan akhir akan dipaparkan oleh rekan saya berikutnya."*

---

### SEGMEN 4: Demo TC11 – TC15 & Summary Report (Orang 3)
**Durasi:** ± 10:00 – 14:00  
**Pembicara:** Anggota 3

#### 🎬 Aksi Visual:
1. Klik sampler **TC11**: buka tab *Response data* (`404 Not Found` pada PNR `FAKEXX`).
2. Klik sampler **TC12**:
   * Buka tab **Request**: tunjukkan payload check-in menggunakan `${var_pnr}` dan email sah Budi.
   * Buka tab **Response data**: tunjukkan status berubah jadi `"CHECKED_IN"`, terbit nomor *Gate*, waktu boarding, dan kode barcode.
3. Klik sampler **TC13**: tunjukkan penolakan check-in ganda (`400 Bad Request` `"Already checked in"`).
4. Klik sampler **TC14 (Security Testing)**:
   * Buka tab **Request**: tunjukkan PNR sah milik Budi, tetapi email diisi `hacker@evil.com`.
   * Buka tab **Response data**: tunjukkan penolakan `403 Forbidden` (`"Email verification failed"`).
5. Klik sampler **TC15 (Rollback Testing)**:
   * Tunjukkan tiket dibatalkan (`status: "CANCELLED"`) dan atribut `freedSeat: "1A"`.
6. Klik listener **Summary Report** di panel kiri paling bawah:
   * Sorot baris TOTAL di tabel:
     - Kolom **# Samples**: 16
     - Kolom **Average**: ~3 – 5 ms
     - Kolom **Error %**: 0.00%
     - Kolom **Throughput**

#### 🎙️ Naskah Bicara:
> *"Terima kasih. Pada bagian akhir ini, saya akan mendemonstrasikan pengujian status mesin, keamanan otorisasi, dan pemulihan inventaris, serta menutup dengan analisis performa.*
>
> *Pada **TC11**, kita menguji pencarian PNR fiktif 'FAKEXX'. Sistem merespons `404 Not Found` secara aman tanpa membocorkan struktur internal database.*
>
> *Masuk ke **TC12**, ini adalah **State Transition Testing**. Penumpang melakukan check-in mandiri online menggunakan PNR sah miliknya. Bisa kita lihat di tab Response Data, status tiket berhasil bertransisi menjadi `CHECKED_IN`, dan sistem menerbitkan Digital Boarding Pass lengkap dengan nomor pintu keberangkatan (Gate) dan barcode unik.*
>
> *Pada **TC13**, kita menguji **Anti-Duplication**: penumpang yang sudah check-in dilarang keras melakukan check-in ulang untuk mencegah penyalahgunaan tiket ganda. Sistem merespons tepat dengan penolakan `400 Bad Request`.*
>
> *Skenario berikutnya pada **TC14** adalah **Security & Access Authorization Testing**. Di sini kami mensimulasikan upaya pihak ketiga atau peretas yang mencoba check-in tiket penumpang sah menggunakan email lain. Sistem SkyPass berhasil mendeteksi ketidakcocokan otorisasi dan langsung mencekal dengan kode HTTP `403 Forbidden`.*
>
> *Puncak pengujian logika transaksi ada pada **TC15**, yaitu **State Rollback & Inventory Recovery**. Ketika penumpang membatalkan tiketnya, status booking berubah menjadi 'CANCELLED', dan sistem secara otomatis melepaskan kursi 1A kembali menjadi status Available. Ini membuktikan sistem mencegah terjadinya fenomena 'kursi hantu' atau ghost seats pada maskapai.*
>
> *(Klik Summary Report)*  
> *Terakhir, mari kita lihat fitur analisis laporan JMeter pada listener **Summary Report**.*
>
> *Berdasarkan data empiris pada tabel:*
> * *Total sampel yang diuji berjumlah **16 permintaan** (1 Setup dan 15 Test Cases).*
> * *Nilai **Error Percentage adalah 0.00%**, yang membuktikan bahwa seluruh skenario pengujian fungsional, keamanan, konkurensi, dan validasi batas berhasil lulus 100%.*
> * *Rata-rata waktu respons (*Average Latency*) berada pada kisaran **3 hingga 5 milidetik**, membuktikan bahwa backend memiliki efisiensi komputasi yang sangat cepat dan andal.*
>
> *Kesimpulannya, melalui Apache JMeter GUI, kita telah membuktikan secara empiris bahwa sistem SkyPass Airlines telah memenuhi seluruh spesifikasi kebutuhan fungsional dan memiliki pertahanan data yang kokoh.*
>
> *Demikian video tutorial System Testing dari kelompok kami. Semoga bermanfaat, terima kasih atas perhatian Anda, dan sampai jumpa!"*

---

## 7. PANDUAN TROUBLESHOOTING & TIPS REKAMAN BERKUALITAS TINGGI

### 🔧 Troubleshooting Masalah Umum Saat Rekaman:
1. **Semua Sampler Berwarna Merah (Error Connection Refused):**
   * *Penyebab:* Server backend Node.js belum dinyalakan.
   * *Solusi:* Buka terminal, pastikan sudah menjalankan `npm start` di folder proyek, lalu klik tombol **Clear All** dan tekan **Start** ulang di JMeter.
2. **Tulisan di Layar JMeter Sangat Kecil:**
   * *Solusi:* Klik menu `Options -> Zoom In` pada JMeter GUI hingga teks sampler dan konfigurasi nyaman dibaca di video rekaman.
3. **TC07 Muncul Tanda Silang Merah Padahal Server Merespons 409:**
   * *Penyebab:* Opsi *Ignore Status* pada Response Assertion tidak tercentang.
   * *Solusi:* Pastikan file Test Plan yang dibuka adalah file asli `skypass-system-testing.jmx`.

### ✨ 3 Kiat Agar Video Mendapat Nilai Maksimal:
1. **Gunakan Gerakan Mouse yang Tenang:** Jangan menggerakkan kursor secara acak. Arahkan mouse langsung ke tab yang sedang dijelaskan (*Request*, *Response data*, *Assertion*).
2. **Tunjukkan Bukti Nyata Data:** Saat menjelaskan, berikan jeda 1–2 detik agar penonton dan dosen bisa membaca teks JSON respons di layar.
3. **Pemberian Nama/Identitas Presenter:** Cantumkan teks nama/NIM presenter di sudut video saat masing-masing anggota mulai berbicara agar dosen dapat dengan mudah menilai kontribusi individu.
