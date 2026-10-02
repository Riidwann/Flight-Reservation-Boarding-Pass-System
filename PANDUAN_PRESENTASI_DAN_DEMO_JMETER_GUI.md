# PANDUAN LENGKAP PRESENTASI & PRAKTIK DEMO JMETER GUI
## Panduan Presenter, Bedah Skenario Uji (15 Test Cases ISTQB), dan Demonstrasi Langsung SkyPass Airlines

Dokumen ini dirancang sebagai panduan resmi presenter untuk mempresentasikan proyek **System Testing SkyPass Airlines** sekaligus memandu demonstrasi langsung (*live demo*) menggunakan **Apache JMeter GUI** dari awal hingga selesai.

---

## 📑 DAFTAR ISI
1. [Rundown & Alokasi Waktu Presentasi](#1-rundown--alokasi-waktu-presentasi)
2. [Babak 1: Konsep Teoretis & Definisi Fundamental](#babak-1-konsep-teoretis--definisi-fundamental)
3. [Babak 2: Profil Sistem & Anatomi 15 Test Cases](#babak-2-profil-sistem--anatomi-15-test-cases)
4. [Babak 3: Panduan Praktik Demo JMeter GUI Langkah Demi Langkah](#babak-3-panduan-praktik-demo-jmeter-gui-langkah-demi-langkah)
5. [Babak 4: Naskah Penutup & Strategi Q&A Defense](#babak-4-naskah-penutup--strategi-qa-defense)
6. [Lampiran: Checklist Kesiapan Sebelum Maju Presentasi](#lampiran-checklist-kesiapan-sebelum-maju-presentasi)

---

## 1. RUNDOWN & ALOKASI WAKTU PRESENTASI

Berikut rekomendasi pembagian alur presentasi berdurasi total **± 25 - 30 Menit**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ALUR PRESENTASI PROYEK                                 │
├────────────────────┬────────────────────┬─────────────────────┬────────────────────────┤
│      BABAK 1       │      BABAK 2       │       BABAK 3       │        BABAK 4         │
│  Landasan Teori    │ Bedah Test Cases   │   Live Demo JMeter  │      Kesimpulan        │
│   System Testing   │  SkyPass Airlines  │         GUI         │      & Tanya Jawab     │
│     (± 5 Menit)    │    (± 7 Menit)     │    (± 12 Menit)     │      (± 6 Menit)       │
└────────────────────┴────────────────────┴─────────────────────┴────────────────────────┘
```

---

## BABAK 1: KONSEP TEORETIS & DEFINISI FUNDAMENTAL

*Sampaikan bagian ini di awal presentasi untuk membuktikan pemahaman akademik yang kokoh terhadap prinsip Rekayasa Perangkat Lunak dan Software Quality Assurance (SQA).*

### 1.1 Definisi Formal System Testing
* **Definisi Standar ISTQB & IEEE 829 / ISO/IEC/IEEE 29119:**
  > *"System Testing adalah level pengujian perangkat lunak di mana sistem yang telah terintegrasi secara utuh dievaluasi untuk memverifikasi apakah sistem telah memenuhi seluruh kebutuhan fungsional (Functional Requirements) dan spesifikasi sistem secara menyeluruh (System Requirements Specification - SRS)."*
* **Karakteristik Utama:**
  1. **Black-Box Testing:** Pengujian dilakukan dari perspektif eksternal tanpa memodifikasi kode sumber internal backend.
  2. **End-to-End Evaluation:** Menguji alur bisnis utuh dari hulu ke hilir (pencarian jadwal &rarr; pemilihan kursi kabin &rarr; reservasi PNR &rarr; check-in mandiri &rarr; penerbitan boarding pass &rarr; pembatalan tiket).
  3. **Multi-Component Interaction:** Menilai keandalan integrasi antara protokol antarmuka jaringan HTTP REST API, kontroler validasi bisnis, mesin status (*state machine*), hingga persistensi basis data.

---

### 1.2 Posisi System Testing dalam Piramida Pengujian & V-Model

```text
         ▲
        / \     Level 4: Acceptance Testing (UAT)
       /   \    ──► Pengujian kesesuaian operasional & bisnis pengguna akhir.
      /     \
     /       \  Level 3: SYSTEM TESTING (Fokus Proyek Ini)
    /─────────\ ──► Pengujian sistem terintegrasi via Black-Box & Apache JMeter.
   /           \
  /             \ Level 2: Integration Testing
 /───────────────\ ──► Pengujian komunikasi & protokol antar-modul internal.
/                 \
/                   \ Level 1: Unit Testing
/─────────────────────\ ──► Pengujian fungsi/logika kecil secara terisolasi (White-Box).
```

* **Perbedaan Kritis dengan Unit Test:**  
  Unit test hanya membuktikan bahwa sebuah fungsi matematika atau parsing berjalan benar dalam kondisi terisolasi. Sementara **System Testing** membuktikan bahwa aplikasi mampu melayani permintaan klien sungguhan, menjaga integritas data saat terjadi tabrakan transaksi, serta mengembalikan kode status HTTP yang presisi.

---

### 1.3 Mengapa Menggunakan Apache JMeter?
1. **Automasi Berulang (Idempotent Automation):** Mampu mengeksekusi puluhan skenario uji secara konsisten dalam hitungan detik.
2. **Pengujian Lapisan API Jaringan:** Mampu menguji kontrak HTTP secara akurat (Header, Status Code, Payload JSON, dan Waktu Latensi).
3. **Simulasi Skenario Kritis yang Sulit Dilakukan di Browser:** Mampu merekayasa kesalahan sintaks, data batas fisik kabin, dan tabrakan transaksi (*concurrency race condition*).

---

## BABAK 2: PROFIL SISTEM & ANATOMI 15 TEST CASES

### 2.1 Profil Singkat Target Aplikasi (SkyPass Airlines)
* **Domain Aplikasi:** Sistem Reservasi Penerbangan Komersial & *Digital Boarding Pass*.
* **Arsitektur:** Node.js & Express.js REST API dengan penyimpanan persisten transaksional lokal (`data/database.json`).
* **Fitur Utama:**
  - 30 Jadwal Penerbangan Harian antar 6 kota besar (Jakarta `CGK`, Surabaya `SUB`, Bali `DPS`, Yogyakarta `JOG`, Medan `KNO`, Makassar `UPG`).
  - Denah kabin interaktif Boeing 737-800 berisi 30 kursi (Baris 1–5, Kolom A–F).
  - Check-in mandiri online berbasis kode PNR resmi (6 karakter unik) & verifikasi email.

---

### 2.2 Anatomi 8 Elemen Baku Test Case (Standar ISTQB)
Jelaskan bahwa ke-15 skenario pengujian dirancang mengikuti struktur baku pengujian perangkat lunak internasional:

| No | Elemen Baku | Penjelasan | Contoh pada Proyek Ini |
| :-: | :--- | :--- | :--- |
| **1** | **Test Case ID** | Identitas unik kasus uji | `TC06` |
| **2** | **Test Objective** | Sasaran perilaku yang diuji | Verifikasi pembuatan booking & penerbitan PNR unik |
| **3** | **Pre-conditions** | Prasyarat sebelum tes berjalan | Database di-reset; Kursi `1A` berstatus *available* |
| **4** | **Test Data / Input** | Parameter query / Payload JSON | `flightNumber: "AW-101"`, `seatNumber: "1A"`, nama, email |
| **5** | **Test Steps** | Urutan tindakan teknis | POST ke `/api/bookings` dengan payload JSON valid |
| **6** | **Expected Result** | Respons sistem yang ditargetkan | Status 201 Created, status `"CONFIRMED"`, PNR 6 digit terbit |
| **7** | **Actual Result** | Respons nyata yang diterima JMeter | Status 201 Created, respons JSON valid, PNR `SKXXXX` terbit |
| **8** | **Test Verdict** | Keputusan kelulusan | **PASSED** (Actual == Expected) |

---

### 2.3 Matriks Klasifikasi 15 Test Cases SkyPass Airlines

Kelompokkan 15 skenario ke dalam 5 fase transaksi bisnis:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ALUR TRANSAKSI 15 SYSTEM TEST CASES                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Setup] Inisialisasi Environment (POST /api/system/reset) ──► Kursi kembali Available  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FASE 1: PENCARIAN PENERBANGAN (DISCOVERY)                                              │
│  • TC01 [Positive] : Cari rute resmi CGK ke DPS (200 OK, kuota kursi > 0)             │
│  • TC02 [Negative] : Cari rute fiktif CGK ke XYZ (200 OK, empty array [])              │
│  • TC03 [Boundary] : Parameter destination hilang (400 Bad Request)                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FASE 2: DENAH KURSI KABIN (INVENTORY)                                                  │
│  • TC04 [Inventory]: Ambil denah kabin pesawat AW-101 (200 OK, 30 kursi kabin)         │
│  • TC05 [Boundary] : Ambil denah pesawat fiktif AW-999 (404 Not Found)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FASE 3: PEMESANAN TIKET & RESERVASI (RESERVATION)                                      │
│  • TC06 [E2E Trans]: Booking kursi 1A (201 Created, status CONFIRMED, terbit PNR)     │
│  • TC07 [Collision]: Re-book kursi 1A yang sama (409 Conflict, "Seat already reserved")│
│  • TC08 [Validation]: Format email tidak valid "not-an-email" (400 Bad Request)        │
│  • TC09 [Boundary] : Nomor kursi di luar batas kabin "99Z" (400 Bad Request)           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FASE 4: INTEGRITAS PENYIMPANAN PERSISTEN (DATA INTEGRITY)                              │
│  • TC10 [Integrity]: Ambil detail booking berdasarkan PNR terdaftar (200 OK)           │
│  • TC11 [Boundary] : Query PNR fiktif "FAKEXX" (404 Not Found)                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FASE 5: CHECK-IN MANDIRI & PEMULIHAN INVENTARIS (STATE MACHINE & ROLLBACK)             │
│  • TC12 [E2E Check]: Check-in mandiri valid (200 OK, status CHECKED_IN, Gate & Barcode)│
│  • TC13 [Anti-Dup] : Percobaan check-in ganda untuk PNR yang sama (400 Bad Request)    │
│  • TC14 [Security] : Check-in dengan email tidak cocok/hacker (403 Forbidden)          │
│  • TC15 [Rollback] : Batalkan booking (200 OK, status CANCELLED, Kursi 1A Available)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.4 Keunggulan Teknis Skrip Pengujian (Wajib Ditekankan!)

1. **Dynamic Parameter Correlation (Tanpa Hardcoded Data):**
   - Skrip pengujian tidak memasukkan kode booking atau nomor penerbangan buatan sendiri.
   - Variabel mengalir dinamis via **JSON Extractor**:
     - `TC01` &rarr; Ekstrak `$.flights[0].flightNumber` &rarr; Disimpan ke `${var_flightNumber}` (`AW-101`).
     - `TC04` &rarr; Ekstrak kursi kosong pertama &rarr; Disimpan ke `${var_seatNumber}` (`1A`).
     - `TC06` &rarr; Ekstrak kode booking hasil generate server &rarr; Disimpan ke `${var_pnr}`.
     - Variabel `${var_pnr}` dipakai otomatis oleh `TC10`, `TC12`, dan `TC15`.
2. **Negative Testing Assertion Handling ("Ignore Status"):**
   - Secara bawaan, JMeter menandai status HTTP 4xx/5xx sebagai *Error* merah.
   - Pada pengujian negatif (seperti `TC07` `409 Conflict` dan `TC14` `403 Forbidden`), kita mencentang opsi **Ignore Status** pada *Response Assertion*.
   - JMeter memvalidasi bahwa server **berhasil menolak permintaan terlarang**, sehingga status pengujian tetap **centang hijau (Passed)**.

---

## BABAK 3: PANDUAN PRAKTIK DEMO JMETER GUI LANGKAH DEMI LANGKAH

*Ikuti instruksi operasional di bawah ini secara presisi saat melakukan demonstrasi di depan audiens.*

---

### Langkah 0: Menjalankan Server Backend Target
Sebelum membuka JMeter, pastikan server Node.js aktif:
1. Buka terminal (PowerShell atau Command Prompt) pada direktori proyek.
2. Jalankan perintah:
   ```powershell
   npm start
   ```
3. Pastikan terminal menampilkan:
   ```text
   SkyPass Airlines Server running on http://localhost:3000
   ```
4. *(Opsional - 30 Detik)* Buka browser ke `http://localhost:3000` untuk memperlihatkan tampilan visual aplikasi kepada audiens.

---

### Langkah 1: Membuka Aplikasi Apache JMeter GUI
1. Buka aplikasi **Apache JMeter**.
2. Jelaskan secara singkat pembagian antarmuka JMeter:
   * **Panel Kiri (Test Plan Tree):** Struktur hierarki skenario pengujian.
   * **Panel Kanan:** Area konfigurasi untuk elemen pohon yang sedang dipilih.
   * **Toolbar Atas:** Kontrol eksekusi (Play, Stop, Clear All / Sapu Bersih).

---

### Langkah 2: Membuka File Test Plan SkyPass Airlines
1. Klik menu **File &rarr; Open** (atau tekan shortcut `Ctrl + O`).
2. Arahkan ke folder proyek:
   `C:\Users\HP\OneDrive\Documents\Project\Code\Jmeter`
3. Pilih file:
   `skypass-system-testing.jmx`
4. Klik tombol **Open**.

---

### Langkah 3: Menjelaskan Struktur Pohon Uji ke Audiens
Klik tanda panah ekspansi pada panel kiri untuk membuka seluruh pohon komponen:

```text
📁 SkyPass Airlines - 15 System Testing Suite
 ├── ⚙️ HTTP Request Defaults
 ├── 📋 HTTP Header Manager
 └── 👥 SkyPass System Testing Thread Group
      ├── 🔄 Setup - Reset Database to Seed State
      ├── 🧪 TC01 - [Positive] Search Flights (CGK to DPS)
      ├── 🧪 TC02 - [Negative] Search Non-Existent Route (CGK to XYZ)
      ├── ... (TC03 s/d TC14)
      ├── 🧪 TC15 - [State Rollback] Cancel Booking & Verify Seat Restored
      ├── 🌲 View Results Tree
      └── 📊 Summary Report
```

**Poin yang perlu Anda tunjukkan pada panel konfigurasi:**
* **HTTP Request Defaults:** Tunjukkan bahwa `Server Name: localhost` dan `Port Number: 3000` telah dikonfigurasi secara terpusat, sehingga jika alamat server berubah, kita tidak perlu mengedit 15 sampler satu per satu.
* **HTTP Header Manager:** Menetapkan header `Content-Type: application/json` secara global.
* **Thread Group:** Menjalankan 1 pemakai (*1 Thread/User*) dengan durasi *Ramp-up: 1 detik* dan *Loop Count: 1*.

---

### Langkah 4: Menjalankan Pengujian (The "Live Run")
1. Klik elemen listener **View Results Tree** di bagian bawah pohon pengujian.
2. Jika ada data bekas pengujian sebelumnya, klik tombol **Clear All** (ikon dua sapu kuning di toolbar atas, atau tekan `Ctrl + Shift + E`).
3. Tekan tombol **Start** hijau (ikon Play segitiga di toolbar atas, atau tekan `Ctrl + R`).
4. **Perhatikan Layar:** Seluruh sampler (dari Setup hingga TC15) akan berputar sejenak dan secara berurutan menampilkan **ikon centang hijau** dari atas ke bawah dalam waktu < 2 detik.

---

### Langkah 5: Inspeksi Mendalam Hasil Eksekusi (Live Drill-Down)
Pilih 3 skenario kunci di **View Results Tree** untuk ditunjukkan secara detail kepada penguji:

#### 1. Pembuktian Alur Sukses (Klik `TC06 - Create Passenger Booking`):
* Klik tab **Sampler result**: Tunjukkan kode respons `201 Created`.
* Klik tab **Request**: Tunjukkan payload JSON yang dikirim (`flightNumber: "AW-101"`, `seatNumber: "1A"`).
* Klik tab **Response data**: Tunjukkan respons JSON dari server di mana atribut `status` bernilai `"CONFIRMED"` dan atribut `pnr` berisi 6 karakter acak unik (misal: `"SK9X7A"`).
* Jelaskan: *"Di sini JMeter secara otomatis mengekstrak nilai PNR ini menggunakan JSON Extractor untuk digunakan pada transaksi berikutnya."*

#### 2. Pembuktian Pertahanan Negatif / Concurrency (Klik `TC07 - Double Booking Seat Collision`):
* Klik tab **Request**: Tunjukkan bahwa TC07 mencoba memesan kembali kursi yang sama (`1A`) pada penerbangan `AW-101`.
* Klik tab **Response data**: Tunjukkan bahwa sistem merespons:
  ```json
  {
    "success": false,
    "error": "Seat already reserved"
  }
  ```
* Tunjukkan tab **Response headers**: Tunjukkan status `HTTP/1.1 409 Conflict`.
* Jelaskan: *"Meskipun status responsnya adalah 409 Conflict, JMeter tetap memberikan centang hijau karena kita menerapkan Response Assertion dengan opsi 'Ignore Status'. Sistem terbukti tangguh menolak reservasi ganda."*

#### 3. Pembuktian Keamanan Otorisasi (Klik `TC14 - Check-In Email Mismatch`):
* Tunjukkan bahwa request check-in menggunakan PNR sah milik penumpang, tetapi alamat email sengaja diisi email peretas (`hacker@evil.com`).
* Tunjukkan tab **Response data**: Sistem menolak dengan HTTP `403 Forbidden` dan pesan `"Email verification failed"`.
* Jelaskan: *"Ini membuktikan mekanisme otorisasi data aviasi berjalan sempurna, melindungi hak privasi boarding pass penumpang."*

#### 4. Pembuktian Pemulihan Kursi (Klik `TC15 - Cancel Booking & Verify Seat Restored`):
* Tunjukkan respons JSON: status tiket berubah menjadi `"CANCELLED"` dan atribut `freedSeat: "1A"`.
* Jelaskan: *"Ini membuktikan sistem mampu melakukan state rollback, melepaskan kembali kursi 1A ke status Available sehingga tidak terjadi fenomena ghost seat pada maskapai."*

---

### Langkah 6: Menampilkan Rekapitulasi di *Summary Report*
1. Klik elemen listener **Summary Report** di panel kiri.
2. Tunjukkan metrik data empiris pada tabel ringkasan:
   * **# Samples:** 16 permintaan (1 Setup + 15 Test Cases).
   * **Average Response Time:** ~3 – 5 milidetik (performa backend sangat cepat dan optimal).
   * **Error %:** **0.00%** (Tingkat kelulusan mutlak 100%).
   * **Throughput:** Jumlah transaksi per detik yang mampu diproses sistem.

---

## BABAK 4: NASKAH PENUTUP & STRATEGI Q&A DEFENSE

### 4.1 Contoh Naskah Kalimat Penutup Presenter
> *"Bapak/Ibu dewan penguji dan rekan-rekan sekalian, berdasarkan demonstrasi langsung pengujian sistem berbasis Apache JMeter yang baru saja kita saksikan, ke-15 Test Cases standar ISTQB berhasil dieksekusi dengan tingkat kelulusan 100% dan Error Rate 0.00%.*
>
> *Pengujian ini telah membuktikan secara empiris bahwa sistem SkyPass Airlines tidak hanya bekerja optimal pada alur normal (Happy Path), tetapi juga memiliki pertahanan yang tangguh terhadap masukan data yang rusak, validasi batas fisik pesawat, perlindungan dari reservasi ganda, serta keamanan otorisasi data penumpang.*
>
> *Demikian presentasi dan demonstrasi pengujian sistem ini saya sampaikan, waktu dan tempat saya kembalikan untuk sesi diskusi dan tanya jawab. Terima kasih."*

---

### 4.2 Strategi Menjawab Pertanyaan Penguji (Q&A Defense)

#### Pertanyaan 1:
> **"Mengapa Anda melakukan System Testing melalui API dengan JMeter, bukan melakukan klik manual pada antarmuka web browser?"**
* **Jawaban Rekomendasi:**  
  *"Pengujian manual melalui antarmuka browser memiliki kelemahan: lambat, rentan terhadap perubahan visual layout (*fragile*), dan tidak dapat menguji integritas lapisan protokol secara presisi. Melalui JMeter, kita menguji langsung kontrak logika bisnis pada lapisan REST API. Selain itu, kondisi ekstrem seperti tabrakan pemesanan simultan (*concurrency*) dan manipulasi payload JSON ilegal hampir mustahil disimulasikan secara konsisten melalui form browser biasa."*

#### Pertanyaan 2:
> **"Apa fungsi Setup Thread Group di awal pengujian?"**
* **Jawaban Rekomendasi:**  
  *"Setup Thread Group memanggil endpoint `POST /api/system/reset` sebelum kasus uji utama dijalankan. Tujuannya adalah menjamin prinsip **Idempotensi Pengujian**. Seluruh kursi kabin dibersihkan kembali ke status Available sehingga tes dapat dijalankan berulang kali tanpa risiko kegagalan semu (*false failure*) akibat data sampah dari eksekusi sebelumnya."*

#### Pertanyaan 3:
> **"Bagaimana jika aplikasi ini ingin diuji secara otomatis dalam pipeline CI/CD tanpa membuka GUI?"**
* **Jawaban Rekomendasi:**  
  *"Apache JMeter mendukung eksekusi Command Line (Non-GUI Mode). Kami telah menyediakan perintah otomatis:  
  `jmeter -n -t skypass-system-testing.jmx -l test-results.jtl -e -o html-report/`  
  Perintah ini dapat dipasang pada script GitHub Actions atau Jenkins, dan secara otomatis menghasilkan dashboard laporan analitik web berbasis HTML lengkap dengan grafik performa."*

---

## LAMPIRAN: CHECKLIST KESIAPAN SEBELUM MAJU PRESENTASI

Gunakan daftar centang ini 10 menit sebelum giliran presentasi Anda dimulai:

- [ ] **Koneksi Node.js:** Terminal sudah terbuka dan perintah `npm start` sedang aktif di background pada port 3000.
- [ ] **Uji Web Portal:** Browser berhasil mengakses `http://localhost:3000` tanpa kendala.
- [ ] **Aplikasi JMeter:** Apache JMeter sudah terbuka dan file `skypass-system-testing.jmx` sudah dimuat (*loaded*).
- [ ] **Bersihkan Riwayat:** Klik tombol **Clear All (ikon sapu)** pada JMeter agar panel hasil dalam kondisi bersih.
- [ ] **Layar / Presenter View:** Atur resolusi layar atau zoom font JMeter (menu *Options &rarr; Zoom In*) jika teks pohon pengujian terlihat kecil di layar proyektor.
- [ ] **File Dokumen Referensi:** Pastikan file [PANDUAN_DAN_PENJELASAN_SYSTEM_TESTING.md](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Jmeter/PANDUAN_DAN_PENJELASAN_SYSTEM_TESTING.md) terbuka di editor kode Anda sebagai referensi cepat jika penguji menanyakan detail teknis tertentu.
