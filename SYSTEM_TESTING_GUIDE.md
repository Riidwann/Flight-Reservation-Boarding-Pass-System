# Panduan Lengkap System Testing dengan Apache JMeter: SkyPass Airlines

Dokumen ini adalah panduan praktis untuk menjalankan aplikasi **SkyPass Airlines** dan mengeksekusi **15 Test Cases System Testing** menggunakan **Apache JMeter**.

---

## 1. Menjalankan Aplikasi SkyPass Airlines

Aplikasi ini berbasis **Node.js & Express** dengan database lokal persisten yang tidak memerlukan instalasi Docker maupun database eksternal.

### Langkah Menjalankan Server:
1. Buka terminal (PowerShell / Command Prompt) di folder proyek ini (`C:\Users\HP\OneDrive\Documents\Project\Code\Jmeter`).
2. Jalankan perintah:
   ```bash
   npm start
   ```
   *Atau:*
   ```bash
   node server.js
   ```
3. Server akan aktif pada:
   - 🌐 **Web Portal**: [http://localhost:3000](http://localhost:3000)
   - 🩺 **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 2. Fitur Antarmuka Web (Manual Testing)

Anda dapat mencoba fitur aplikasi secara visual di browser sebelum menjalankan pengujian otomatis di JMeter:
1. **Cari Tiket (`/index.html`)**: Pilih rute Jakarta (CGK) ke Bali (DPS), tekan "Cari Penerbangan".
2. **Pilih Kursi Kabin (`/seats.html`)**: Klik salah satu kursi biru (Available) pada denah kabin 5 baris (1A - 5F). Isi data penumpang dan konfirmasi untuk menerbitkan 6-digit kode PNR (misal: `SK7X2A`).
3. **Web Check-In (`/checkin.html`)**: Masukkan kode PNR dan email yang didaftarkan.
4. **Digital Boarding Pass (`/boarding-pass.html`)**: Menampilkan boarding pass resmi dengan nomor Gate, jam boarding, dan barcode digital.
5. **Tombol Reset DB**: Tersedia tombol `🔄 Reset DB Uji` di sudut kanan atas untuk mengembalikan database ke kondisi awal kapan saja.

---

## 3. Menjalankan System Testing di Apache JMeter

File test plan JMeter telah disiapkan di root folder:
📁 `skypass-system-testing.jmx`

### A. Menggunakan JMeter GUI (Rekomendasi untuk Visualisasi Hasil):
1. Buka aplikasi **Apache JMeter** di komputer Anda.
2. Klik menu **File** &rarr; **Open** (atau tekan `Ctrl + O`).
3. Pilih file `skypass-system-testing.jmx` dari folder proyek ini.
4. Di panel sebelah kiri, Anda akan melihat struktur:
   - `SkyPass Airlines - 15 System Testing Suite`
     - `HTTP Request Defaults` (Server: `localhost`, Port: `3000`)
     - `HTTP Header Manager` (`Content-Type: application/json`)
     - `SkyPass System Testing Thread Group`
       - `Setup - Reset Database to Seed State`
       - `TC01 - [Positive] Search Flights (CGK to DPS)`
       - `TC02 - [Negative] Search Non-Existent Route (CGK to XYZ)`
       - `TC03 - [Boundary] Missing Parameter (No Destination)`
       - `TC04 - [Inventory] Retrieve Cabin Seat Map`
       - `TC05 - [Resource] Seat Map for Non-Existent Flight (AW-999)`
       - `TC06 - [E2E Booking] Create Passenger Booking`
       - `TC07 - [Concurrency] Double Booking Seat Collision`
       - `TC08 - [Validation] Malformed Email Format`
       - `TC09 - [Boundary] Out-of-Bounds Physical Seat (99Z)`
       - `TC10 - [Data Integrity] Retrieve Booking by PNR`
       - `TC11 - [Boundary] Query Non-Existent PNR (FAKEXX)`
       - `TC12 - [E2E Check-In] Execute Web Check-In`
       - `TC13 - [State Machine] Duplicate Check-In Attempt`
       - `TC14 - [Security Auth] Check-In Email Mismatch`
       - `TC15 - [State Rollback] Cancel Booking & Verify Seat Restored`
       - 📊 `View Results Tree`
       - 📈 `Summary Report`
5. Pastikan server Node.js sedang menyala (`npm start`).
6. Klik tombol **Play hijau (Start)** di toolbar atas atau tekan `Ctrl + R`.
7. Klik pada listener **View Results Tree**:
   - Seluruh 15 test case akan menampilkan centang hijau (Passed).
   - Anda dapat mengklik masing-masing request untuk melihat *Request Body*, *Response Data*, dan *Assertion Results*.

---

### B. Menjalankan via Command Line (Non-GUI Mode & Dashboard HTML):
Jika JMeter sudah terdaftar di PATH sistem Anda, Anda dapat mengeksekusi test plan dan langsung menghasilkan laporan HTML interaktif:
```bash
jmeter -n -t skypass-system-testing.jmx -l test-results.jtl -e -o html-report/
```
Setelah selesai, buka file `html-report/index.html` di browser Anda untuk melihat grafik statistik performa dan status kelulusan pengujian.

---

## 4. Rincian Matriks 15 Test Case System Testing

| Kode TC | Nama Pengujian | Tipe System Testing | HTTP Method & Path | Parameter / Payload | Validasi & Assertion JMeter |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **TC01** | Search Flights Valid Route | Positive Discovery | `GET /api/flights` | `origin=CGK&destination=DPS` | Code: 200 OK. JSON Extractor mengambil `${var_flightNumber}` (`AW-101`). |
| **TC02** | Search Non-Existent Route | Negative Functional | `GET /api/flights` | `origin=CGK&destination=XYZ` | Code: 200 OK. Response Assertion memvalidasi hasil berupa array kosong `[]`. |
| **TC03** | Missing Parameter Boundary | Interface Boundary | `GET /api/flights` | `origin=CGK` (tanpa destination) | Code: 400 Bad Request. Assertion memvalidasi pesan `"destination parameter is required"`. |
| **TC04** | Retrieve Cabin Seat Map | Inventory State | `GET /api/flights/${var_flightNumber}/seats` | - | Code: 200 OK. JSON Extractor mengambil kursi pertama yang tersedia `${var_seatNumber}`. |
| **TC05** | Non-Existent Flight Resource | Resource Boundary | `GET /api/flights/AW-999/seats` | - | Code: 404 Not Found. Assertion memvalidasi pesan `"Flight not found"`. |
| **TC06** | Create Passenger Booking | E2E Transactional | `POST /api/bookings` | JSON Body: data penumpang + `${var_seatNumber}` | Code: 201 Created. JSON Extractor mengambil `${var_pnr}`, status `"CONFIRMED"`. |
| **TC07** | Double Booking Collision | Concurrency & Conflict | `POST /api/bookings` | JSON Body: kursi yang sama dengan TC06 | Code: 409 Conflict. Assertion memvalidasi pesan `"already reserved"`. |
| **TC08** | Malformed Email Validation | Input Schema | `POST /api/bookings` | Email: `"not-an-email"` | Code: 400 Bad Request. Assertion memvalidasi pesan `"Invalid email format"`. |
| **TC09** | Out-of-Bounds Seat Number | Physical Boundary | `POST /api/bookings` | Kursi: `"99Z"` | Code: 400 Bad Request. Assertion memvalidasi pesan `"Invalid seat number"`. |
| **TC10** | Retrieve Booking by PNR | Data Persistence | `GET /api/bookings/${var_pnr}` | - | Code: 200 OK. JSON Assertion mencocokkan PNR dan status `"CONFIRMED"`. |
| **TC11** | Non-Existent PNR Query | Negative Query | `GET /api/bookings/FAKEXX` | - | Code: 404 Not Found. Assertion memvalidasi pesan `"Booking not found"`. |
| **TC12** | Execute Web Check-In | E2E Check-In Workflow | `POST /api/check-in` | JSON Body: `${var_pnr}` + email terdaftar | Code: 200 OK. Ekstrak `${var_bpId}`, verifikasi status tiket berubah jadi `"VALID"`. |
| **TC13** | Duplicate Check-In Attempt | State Machine Violation | `POST /api/check-in` | JSON Body: PNR yang sudah check-in di TC12 | Code: 400 Bad Request. Assertion memvalidasi pesan `"Already checked in"`. |
| **TC14** | Email Mismatch Security | Security / Access Control | `POST /api/check-in` | JSON Body: PNR valid + email salah | Code: 403 Forbidden. Assertion memvalidasi pesan `"Email verification failed"`. |
| **TC15** | Cancel Booking & Rollback | State Recovery & Lifecycle | `POST /api/bookings/${var_pnr}/cancel` | - | Code: 200 OK. Assertion memvalidasi status `"CANCELLED"` dan kursi kembali berstatus `"available"`. |

---

## 5. Menjalankan Verifikasi Cepat Tanpa GUI (Automated Runner)

Jika Anda ingin memverifikasi kelulusan ke-15 test case secara instan melalui terminal sebelum membuka JMeter, jalankan:
```bash
npm test
```
Script ini akan mengeksekusi ke-15 skenario di atas secara terprogram dengan parameter dan assertion yang sama persis seperti di JMeter.
