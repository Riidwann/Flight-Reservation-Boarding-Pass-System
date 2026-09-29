# Panduan Lengkap System Testing dengan Apache JMeter: SkyPass Airlines

Dokumen ini adalah panduan praktis untuk menjalankan aplikasi **SkyPass Airlines** dan mengeksekusi **15 Test Cases System Testing** menggunakan **Apache JMeter** (berstandar ISTQB).

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
   - 🎫 **Check-In Mandiri**: [http://localhost:3000/checkin.html](http://localhost:3000/checkin.html)
   - 🩺 **Health Check API**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 2. Fitur Antarmuka Web (Manual Testing)

Anda dapat mencoba seluruh alur pengguna secara visual di browser sebelum menjalankan pengujian otomatis di JMeter:
1. **Cari Tiket (`/index.html`)**: 
   - Pilih rute penerbangan antar 6 kota besar (Jakarta `CGK`, Surabaya `SUB`, Bali `DPS`, Yogyakarta `JOG`, Medan `KNO`, Makassar `UPG`).
   - Tersedia tombol *Swap Rute* (`⇄`) dan pilihan 30 jadwal penerbangan (Pagi, Siang, Sore, Malam).
   - Klik tombol **"Pilih Kursi &rarr;"** pada jadwal yang diinginkan.
2. **Pilih Kursi Kabin (`/seats.html`)**: 
   - Visualisasi badan pesawat (*fuselage*) realistis dengan siluet kokpit pilot, jendela kabin, dan lorong tengah (*aisle*).
   - Klik salah satu kursi bertanda biru (*Available*) pada konfigurasi 5 baris (1A - 5F).
   - Isi formulir identitas penumpang, lalu klik tombol **"Konfirmasi & Terbitkan PNR"**.
   - Salin kode booking resmi (**PNR**) yang terbit, atau klik langsung tombol **"Lanjut ke Check-In &rarr;"**.
3. **Check-In Mandiri (`/checkin.html`)**: 
   - Masukkan 6-karakter kode PNR dan email penumpang terdaftar.
   - Sistem memvalidasi kesesuaian data dan mengarahkan pengguna ke halaman Boarding Pass.
4. **Digital Boarding Pass (`/boarding-pass.html`)**: 
   - Menampilkan tiket fisik resmi bandara dengan nomor kursi besar, pintu keberangkatan (*Gate*), jam boarding, dan barcode digital.
   - Tersedia tombol **"Cetak / Simpan Boarding Pass (PDF)"** yang dioptimalkan dengan CSS `@media print` tanpa navbar/footer.
   - Tersedia fitur pembatalan reservasi (*Cancel Booking*) yang secara otomatis memulihkan kursi ke status *Available*.
5. **Reset Database**:
   - Untuk kebutuhan pengujian otomatis atau mengembalikan data ke kondisi awal, endpoint REST API `POST /api/system/reset` telah terpasang dan dieksekusi secara otomatis oleh skrip JMeter pada tahap inisialisasi (*Setup Thread Group*).

---

## 3. Menjalankan System Testing di Apache JMeter

File test plan JMeter telah disiapkan di root folder proyek:
📁 **`skypass-system-testing.jmx`**

### A. Menggunakan JMeter GUI (Rekomendasi untuk Visualisasi Hasil):
1. Buka aplikasi **Apache JMeter** di komputer Anda.
2. Klik menu **File** &rarr; **Open** (atau tekan `Ctrl + O`).
3. Pilih file `skypass-system-testing.jmx` dari folder proyek ini.
4. Di panel sebelah kiri, Anda akan melihat struktur test plan:
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
       - `TC12 - [E2E Check-In] Execute Check-In`
       - `TC13 - [State Machine] Duplicate Check-In Attempt`
       - `TC14 - [Security Auth] Check-In Email Mismatch`
       - `TC15 - [State Rollback] Cancel Booking & Verify Seat Restored`
       - 📊 `View Results Tree`
       - 📈 `Summary Report`
5. Pastikan server Node.js sedang aktif (`npm start`).
6. Klik tombol **Play hijau (Start)** di toolbar atas atau tekan `Ctrl + R`.
7. Klik pada listener **View Results Tree**:
   - Seluruh 15 test case akan menampilkan centang hijau (*Passed*).
   - Anda dapat mengklik masing-masing request untuk menginspeksi *Request Body*, *Response Data*, dan *Assertion Results*.

---

### B. Menjalankan via Command Line (Non-GUI Mode & Dashboard HTML):
Jika JMeter sudah terdaftar di `PATH` sistem operasi Anda, eksekusi test plan dan langsung hasilkan laporan HTML interaktif dengan perintah:
```bash
jmeter -n -t skypass-system-testing.jmx -l test-results.jtl -e -o html-report/
```
Setelah proses selesai, buka file `html-report/index.html` di browser Anda untuk melihat grafik statistik performa, *throughput*, dan tingkat kelulusan pengujian 100%.

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
| **TC11** | Query Non-Existent PNR | Boundary Value | `GET /api/bookings/FAKEXX` | - | Code: 404 Not Found. Assertion memvalidasi status 404 tanpa kebocoran data internal. |
| **TC12** | Execute Check-In | State Transition | `POST /api/check-in` | JSON Body: `${var_pnr}` + email terdaftar | Code: 200 OK. Menerbitkan nomor Gate dan boarding pass resmi. |
| **TC13** | Duplicate Check-In Attempt | State Integrity | `POST /api/check-in` | JSON Body: data yang sama dengan TC12 | Code: 400 Bad Request. Assertion memvalidasi pesan `"Already checked in"`. |
| **TC14** | Check-In Email Mismatch | Security Authorization | `POST /api/check-in` | JSON Body: PNR valid + email salah | Code: 403 Forbidden. Assertion memvalidasi pesan `"Email verification failed"`. |
| **TC15** | Cancel Booking & Rollback | State Recovery | `POST /api/bookings/${var_pnr}/cancel` | - | Code: 200 OK. Assertion memvalidasi status `"CANCELLED"` dan pemulihan kursi kembali ke *Available*. |

---

## 5. Menjalankan Automated Runner Mandiri (`npm test`)

Selain menggunakan JMeter GUI dan CLI, Anda dapat menjalankan seluruh 15 pengujian sistem secara otomatis langsung melalui Node.js runner:
```bash
npm test
```
Runner ini mengeksekusi urutan pengujian yang sama persis dengan skenario JMeter dan menampilkan laporan kelulusan langsung di konsol terminal Anda.
