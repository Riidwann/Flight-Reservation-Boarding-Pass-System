# PANDUAN DAN PROMPT CLAUDE: PEMBUATAN SLIDE PRESENTASI UTS
## Mata Kuliah: Teknik Pengujian Perangkat Lunak (TPPL)
## Topik: Konsep Test Case, Teori System Testing, & Implementasi Apache JMeter pada SkyPass Airlines

> **Petunjuk Penggunaan:**  
> Salin (*copy*) seluruh teks di bawah garis pemisah (*horizontal rule*) berikut ini dan tempelkan (*paste*) langsung ke chat **Claude** (atau unggah berkas `.md` ini ke Claude.ai). Berkas ini telah dilengkapi dengan:
> 1. **Definisi Formal Test Case & Anatomi 8 Bagian Utamanya (Standar ISTQB & IEEE 829)**
> 2. **Definisi Formal System Testing & Posisinya pada V-Model / Piramida Pengujian**
> 3. **Taksonomi 6 Kategori Pengujian Sistem**
> 4. **Bedah Teoritis & Analisis Risiko Ke-15 Test Cases**
> 5. **Dataset Riil Hasil Eksekusi Apache JMeter (`test-results.jtl`)**
> 6. **Struktur Slide Presentasi + Naskah Speaker Notes + Script Macro VBA PowerPoint**

---

```markdown
# PROMPT UNTUK CLAUDE: PEMBUATAN SLIDE PRESENTASI & SPEAKER NOTES UTS TPPL
# FOKUS: ANATOMI TEST CASE, TEORI SYSTEM TESTING, & HASIL PENGUJIAN APACHE JMETER

Halo Claude, Anda berperan sebagai **Senior QA Engineering Specialist** sekaligus **Dosen Pengampu Mata Kuliah Teknik Pengujian Perangkat Lunak (TPPL)**.

Saya sedang menyusun materi presentasi untuk Ujian Tengah Semester (UTS) saya. Dosen penguji meminta agar presentasi ini menyajikan materi secara utuh dan berbobot akademis tinggi, mencakup:
1. **Konsep Dasar Test Case & Anatomi Bagian-Bagiannya** (berdasarkan standar ISTQB & IEEE 829/ISO 29119).
2. **Definisi Formal & Karakteristik System Testing** serta posisinya dalam V-Model.
3. **Bedah Teori & Urgensi di balik masing-masing jenis pengujian sistem**.
4. **Rincian mendalam ke-15 Test Case** (tujuan uji, skenario bisnis, teknik desain uji, dan risiko jika tidak diuji).
5. **Data empiris riil hasil eksekusi Apache JMeter** (dari file `test-results.jtl`).

Tolong buatkan materi presentasi PowerPoint (13 Slide) yang komprehensif, terstruktur rapi, berbasis data konkret, dan dilengkapi naskah presentasi (*Speaker Notes*) yang fasih.

---

## 1. LANDASAN TEORI I: KONSEP TEST CASE & ANATOMI BAGIAN-BAGIANNYA

Berikut adalah materi fundamental mengenai Test Case yang wajib dijelaskan secara eksplisit di dalam materi presentasi:

### A. Definisi Formal Test Case (Standar ISTQB & IEEE 829 / ISO/IEC/IEEE 29119)
- **Definisi**: Menurut standar ISTQB, *Test Case* adalah sekumpulan kondisi awal (*preconditions*), masukan (*inputs*), prosedur aksi/langkah (*action/steps*), hasil yang diharapkan (*expected results*), dan kondisi akhir (*postconditions*), yang dikembangkan berdasarkan kriteria pengujian tertentu guna memverifikasi kepatuhan perangkat lunak terhadap kebutuhan yang telah ditentukan.
- **Tujuan Test Case**: Menjadi panduan eksekusi pengujian yang terukur, terstandarisasi, dapat diulang (*repeatable*), dapat dilacak (*traceable*), dan membuktikan apakah sistem berjalan sesuai spesifikasi atau menemukan cacat (*defect*).

### B. Anatomi 8 Bagian Utama Test Case (The 8 Constituent Parts of a Test Case)
Sajikan penjelasan terstruktur mengenai 8 komponen standar penyusun Test Case:
1. **Test Case ID**: Pengenal unik berbasis kode alfanumerik untuk kemudahan pelacakan (*traceability*), misal: `TC01`, `TC06`.
2. **Test Description / Objective**: Penjelasan singkat mengenai tujuan spesifik apa yang sedang diuji, misal: *"Memverifikasi pembuatan reservasi penumpang baru dan penerbitan kode PNR unik"*.
3. **Pre-conditions (Kondisi Prasyarat)**: Keadaan awal sistem yang wajib terpenuhi sebelum pengujian dapat dijalankan, misal: *Database telah direset ke seed state, rute penerbangan aktif, kursi 1A berstatus available*.
4. **Test Data / Input Specification**: Kumpulan nilai masukan atau payload data yang dikirimkan ke sistem, misal: *Origin: CGK, Destination: DPS, Nama: Budi Santoso, Email: budi@example.com, Seat: 1A*.
5. **Test Steps / Execution Procedure**: Langkah-langkah tindakan terurut yang dilakukan oleh penguji / alat otomatis, misal: *Langkah 1: Buka koneksi HTTP POST /api/bookings, Langkah 2: Lampirkan payload JSON, Langkah 3: Kirim request dan tangkap respons*.
6. **Expected Result (Hasil yang Diharapkan)**: Respons, perilaku, atau keluaran ideal yang dirumuskan dari spesifikasi kebutuhan (*SRS*), misal: *HTTP 201 Created, mengembalikan 6-digit PNR unik, status booking CONFIRMED, kursi 1A berubah menjadi reserved*.
7. **Actual Result (Hasil Faktual/Aktual)**: Respons nyata yang dikeluarkan oleh sistem saat pengujian dieksekusi, misal: *HTTP 201 Created, PNR terbit 'SKK4H6', status 'CONFIRMED'*.
8. **Status / Test Verdict**: Kesimpulan akhir pengujian:
   - **PASSED**: Jika *Actual Result == Expected Result*.
   - **FAILED**: Jika *Actual Result != Expected Result* (ditemukan *defect/bug*).
   - **BLOCKED**: Pengujian terhalang dependensi langkah sebelumnya.

### C. Pemetaan Anatomi Test Case ke Komponen Apache JMeter
Tunjukkan bagaimana konsep teoretis Test Case diimplementasikan ke dalam elemen teknis Apache JMeter:
- **Test Case ID & Objective** &rarr; *Sampler Label / Name* di pohon Test Plan.
- **Pre-conditions** &rarr; *Setup Thread Group* (Reset DB) & *User Parameters / Variabel Sebelumnya*.
- **Test Data & Test Steps** &rarr; *HTTP Request Sampler* (Method GET/POST, URL Path, JSON Body Data, Header Manager).
- **Expected Result** &rarr; *Response Assertion* (HTTP Code) & *JSON Path Assertion* (Validasi isi payload).
- **Actual Result** &rarr; *View Results Tree Listener* (Response Code & Response Data tab).
- **Test Verdict** &rarr; Indikator Ikon Centang Hijau (*success=true*) / Silang Merah (*success=false*).

---

## 2. LANDASAN TEORI II: DEFINISI & KONSEP SYSTEM TESTING

### A. Definisi Formal System Testing (Standar ISTQB)
- *System Testing* adalah level pengujian perangkat lunak di mana sistem yang lengkap dan terintegrasi secara utuh diuji untuk mengevaluasi apakah sistem telah memenuhi kebutuhan fungsional (*functional requirements*) dan spesifikasi sistem secara menyeluruh.
- **Karakteristik Utama**:
  1. **End-to-End Evaluation**: Menguji sistem dari awal hingga akhir, mencakup antarmuka jaringan (HTTP), logika bisnis, manajemen status (*state machine*), hingga penyimpanan data persisten.
  2. **Pendekatan Black-Box**: Pengujian dilakukan tanpa melihat kode internal backend (*implementation-agnostic*), melainkan berfokus pada masukan, luaran, dan kepatuhan terhadap kontrak spesifikasi API.
  3. **Pengujian Kondisi Nyata**: Menguji bagaimana subsistem bekerja sama secara harmonis di bawah kondisi operasional nyata.

### B. Posisi System Testing dalam Piramida Pengujian & V-Model
1. **Level 1 - Unit Testing**: Menguji modul/fungsi terkecil secara terisolasi (White-Box).
2. **Level 2 - Integration Testing**: Menguji antarmuka dan interaksi antar-modul internal.
3. **Level 3 - SYSTEM TESTING (Fokus Proyek Ini)**: Menguji keseluruhan sistem yang telah dirakit utuh terhadap *System Requirements Specification* (SRS). Pada proyek ini, JMeter bertindak sebagai aktor eksternal yang menguji REST API secara menyeluruh.
4. **Level 4 - Acceptance Testing (UAT)**: Validasi kesesuaian sistem terhadap kebutuhan operasional pengguna akhir.

### C. Taksonomi 6 Kategori Pengujian Sistem yang Diterapkan
1. **Functional / Discovery Testing**: Validasi fungsi inti berjalan sesuai spesifikasi (*Happy Path*).
2. **Negative & Robustness Testing**: Uji ketahanan sistem dalam menolak data ilegal secara elegan tanpa mengalami *system crash* (HTTP 500).
3. **Boundary Value Testing (BVA)**: Uji batas parameter antarmuka dan batasan fisik kapasitas armada pesawat (`99Z`).
4. **Concurrency & Race Condition Testing**: Uji pencegahan *double-booking* kursi pada waktu bersamaan.
5. **State Transition & Lifecycle Testing**: Validasi siklus hidup kursi & tiket (*Available* &rarr; *Reserved* &rarr; *Checked-In* &rarr; *Cancelled*).
6. **Security Authorization Testing**: Proteksi tiket dari upaya check-in menggunakan email orang lain.

---

## 3. BEDAH TEORITIS KE-15 TEST CASES SYSTEM TESTING

Jelaskan alasan, teknik desain uji, dan risiko dari setiap kasus uji berikut:

| Kode TC | Nama Pengujian | Teknik Desain Uji | Mengapa Perlu Diuji? (Tujuan & Analisis Risiko) | Validasi & Assertion JMeter |
| :---: | :--- | :--- | :--- | :--- |
| **TC01** | E2E Flight Search Valid | *Equivalence Partitioning (Valid)* | Membuktikan bahwa pencarian rute resmi (`CGK` &rarr; `DPS`) berhasil menemukan jadwal aktif dan kursi. Risiko jika gagal: Penumpang tidak bisa membeli tiket sama sekali. | HTTP 200 OK, Ekstrak `flightNumber` (`AW-101`) & cek sisa kursi > 0. |
| **TC02** | Search Non-Existent Route | *Equivalence Partitioning (Invalid)* | Menguji respons sistem ketika mencari rute fiktif (`CGK` &rarr; `XYZ`). Sistem wajib merespons aman dengan array kosong `[]`, bukan error 500. | HTTP 200 OK, Assertion body `[]`. |
| **TC03** | Missing Parameter Boundary | *Boundary Value Analysis* | Menguji validasi antarmuka saat parameter wajib diabaikan (`origin=CGK` tanpa `destination`). Sistem harus mencegah query ilegal. | HTTP 400 Bad Request, Pesan: `"destination parameter is required"`. |
| **TC04** | Retrieve Cabin Seat Map | *Inventory State Presentation* | Memverifikasi denah fisik 30 kursi (1A–5F) disajikan akurat dengan status terkini sebelum dipilih. | HTTP 200 OK, Ekstrak kursi kosong pertama (`1A`). |
| **TC05** | Query Fictitious Flight | *Resource Boundary Testing* | Menguji ketahanan jika nomor penerbangan tidak dikenal (`AW-999`). Mencegah kebocoran data (*data leakage*). | HTTP 404 Not Found, Pesan: `"Flight not found"`. |
| **TC06** | E2E Booking & PNR Issuance | *E2E Transactional Flow* | Alur inti transaksi: input identitas penumpang & kursi `1A`. Sistem wajib menerbitkan PNR 6-karakter unik dan mengunci kursi menjadi `reserved`. | HTTP 201 Created, Ekstrak kode PNR unik (`SK...`), status `"CONFIRMED"`. |
| **TC07** | Double Booking Collision | *Concurrency & Collision* | **Kritis**: Mensimulasikan dua penumpang memesan kursi yang sama (`1A`). Sistem wajib menolak pemesanan kedua demi mencegah *overbooking*. | HTTP 409 Conflict, Pesan: `"Seat already reserved"`. |
| **TC08** | Malformed Email Validation | *Input Schema Validation* | Menguji validasi format email (`"not-an-email"`). Mencegah data sampah (*corrupted data*) masuk ke basis data reservasi. | HTTP 400 Bad Request, Pesan: `"Invalid email format"`. |
| **TC09** | Out-of-Bounds Seat Number | *Physical Boundary Testing* | Menguji batas fisik kabin: pengguna mencoba memesan kursi `99Z` (kabin hanya 1A–5F). Sistem wajib memblokir input di luar batas armada. | HTTP 400 Bad Request, Pesan: `"Invalid seat number"`. |
| **TC10** | Retrieve Booking by PNR | *Data Persistence & Integrity* | Membuktikan bahwa transaksi pemesanan pada TC06 benar-benar tersimpan persisten di storage dan dapat dipanggil kembali secara identik. | HTTP 200 OK, JSON Path mencocokkan PNR, Nama, dan Nomor Kursi. |
| **TC11** | Query Fictitious PNR | *Negative Identifier Query* | Menguji query kode booking fiktif (`FAKEXX`). Sistem harus merespons 404 tanpa mengekspos *stack trace* internal. | HTTP 404 Not Found, Pesan: `"Booking not found"`. |
| **TC12** | E2E Check-In & Boarding Pass | *State Transition Testing* | Memvalidasi perpindahan siklus tiket: dari `CONFIRMED` menjadi `CHECKED_IN`, penerbitan Gate, jam boarding, dan hash barcode. | HTTP 200 OK, Status tiket berubah `CHECKED_IN`, status kursi `checked_in`. |
| **TC13** | Duplicate Check-In Attempt | *State Machine Integrity* | Menguji pelanggaran aturan transisi: Tiket yang sudah *Checked-In* dilarang check-in ulang untuk mencegah duplikasi tiket fisik. | HTTP 400 Bad Request, Pesan: `"Already checked in"`. |
| **TC14** | Security Email Mismatch | *Security Authorization* | Menguji keamanan data: Melakukan check-in pada PNR valid milik orang lain menggunakan email yang salah. Sistem wajib memblokir akses ini. | HTTP 403 Forbidden, Pesan: `"Email verification failed"`. |
| **TC15** | Booking Cancel & Seat Rollback | *State Rollback & Recovery* | Menguji pembatalan tiket: Kode PNR dibatalkan (`CANCELLED`), tiket dinyatakan `VOID`, dan kursi `1A` wajib dikembalikan (*rollback*) ke inventaris sebagai `available`. | HTTP 200 OK, Status tiket `CANCELLED`, verifikasi kursi kembali *Available*. |

---

## 4. DATASET EMPIRIS HASIL EKSEKUSI APACHE JMETER

Data riil dari berkas `test-results.jtl` dan `html-report/statistics.json`:
- **Total Sampler Dieksekusi**: 16 Sampler (1 Setup Idempotency + 15 Test Cases)
- **Tingkat Kelulusan (Success Rate)**: **100% Passed (16/16 Lulus)**
- **Tingkat Kesalahan (Error Rate)**: **0.00%**
- **Waktu Respons Rata-Rata**: **~4.6 ms** per request (Sangat Cepat & Responsif)
- **Throughput**: ~250.0 hingga 333.3 transaksi per detik
- **Application Performance Index (APDEX)**: **1.0 (Optimal)**
- **Log Waktu Respons Riil Tiap Test Case**:
  - `Setup - Reset Database`: 90 ms (200 OK)
  - `TC01 - Search Flights Valid`: 3 ms (200 OK)
  - `TC02 - Search Non-Existent Route`: 4 ms (200 OK)
  - `TC03 - Missing Parameter Boundary`: 3 ms (400 Bad Request)
  - `TC04 - Retrieve Cabin Seat Map`: 6 ms (200 OK)
  - `TC05 - Fictitious Flight Resource`: 4 ms (404 Not Found)
  - `TC06 - E2E Booking Creation`: 9 ms (201 Created)
  - `TC07 - Double Booking Collision`: 4 ms (409 Conflict)
  - `TC08 - Malformed Email Format`: 4 ms (400 Bad Request)
  - `TC09 - Out-of-Bounds Seat Number`: 4 ms (400 Bad Request)
  - `TC10 - Retrieve Booking by PNR`: 3 ms (200 OK)
  - `TC11 - Query Non-Existent PNR`: 5 ms (404 Not Found)
  - `TC12 - Execute Check-In`: 4 ms (200 OK)
  - `TC13 - Duplicate Check-In Attempt`: 4 ms (400 Bad Request)
  - `TC14 - Check-In Email Mismatch`: 5 ms (403 Forbidden)
  - `TC15 - Cancel Booking & Rollback`: 4 ms (200 OK)

---

## 5. STRUKTUR 13 SLIDE PRESENTASI YANG HARUS ANDA BUATKAN

Susunkan materi slide demi slide secara lengkap:
- **Slide 1: Title & Identitas Akademik** (Judul, Subjudul UTS TPPL, Identitas Mahasiswa).
- **Slide 2: Konsep Dasar Test Case & Anatomi Bagian-Bagiannya (Standar ISTQB)** (Definisi Test Case, 8 Bagian Utama Test Case, Pemetaan ke Elemen JMeter).
- **Slide 3: Konsep & Definisi Formal System Testing** (Definisi ISTQB/IEEE, Karakteristik Black-Box, Urgensi Pengujian Sistem pada Transaksi Maskapai).
- **Slide 4: Posisi System Testing dalam Piramida Pengujian & V-Model** (Hierarki Unit Testing, Integration Testing, System Testing, dan Acceptance Testing).
- **Slide 5: Profil Aplikasi Target (SkyPass Airlines Architecture)** (30 Penerbangan harian di 6 kota besar, Denah Kursi 1A–5F, Check-In, Boarding Pass).
- **Slide 6: Taksonomi & Teknik Desain Pengujian Sistem** (Penjelasan EP, BVA, State Transition, Concurrency, Security Authorization).
- **Slide 7: Arsitektur Test Plan Apache JMeter** (Setup Thread Group, HTTP Defaults, Header Manager, JSON Path Extractor, Assertions, Listeners).
- **Slide 8: Matriks Kasus Uji Bagian I: Discovery & Booking (TC01 - TC08)** (Tabel tujuan uji, metode HTTP, skenario, dan asersi).
- **Slide 9: Matriks Kasus Uji Bagian II: Boundary, Security & Rollback (TC09 - TC15)** (Tabel tujuan uji, metode HTTP, skenario, dan asersi).
- **Slide 10: Alur Korelasi Parameter Dinamis (*Dynamic Parameter Correlation*)** (Diagram passing `${var_flightNumber}` &rarr; `${var_seatNumber}` &rarr; `${var_pnr}` &rarr; `${var_bpId}`).
- **Slide 11: Strategi Negative Testing & Asersi Status Error HTTP di JMeter** (Penjelasan mengapa HTTP 400, 403, 404, 409 tetap dinyatakan lulus / *Passed* dengan fitur *Ignore Status*).
- **Slide 12: Hasil Eksekusi, Metrik Kualitas & Laporan Empiris** (Tingkat kelulusan 100%, Error 0%, waktu respons rata-rata 4.6 ms, laporan HTML JMeter).
- **Slide 13: Panduan Live Demo JMeter, Kesimpulan & Sesi Q&A** (Langkah demonstrasi praktis di kelas, kesimpulan mutu software, dan penutup).

---

## 6. FORMAT LUARAN (OUTPUT) YANG DIMINTA

Berikan output secara lengkap dan rapi dalam format berikut:

### FORMAT A: KONTEN LENGKAP 13 SLIDE BESERTA SPEAKER NOTES
Untuk setiap slide dari 1 sampai 13, sediakan:
- **Judul Slide**
- **Panduan Visual & Layout Slide** (Rekomendasi penataan kotak, diagram, tabel, atau ikon)
- **Teks Poin Slide** (Padat, ringkas, profesional, mudah dibaca)
- **Speaker Notes Terpandu** (Naskah lengkap dalam bahasa Indonesia formal untuk saya bacakan saat presentasi).

### FORMAT B: KODE MACRO VBA POWERPOINT (AUTO-SLIDE GENERATOR)
Berikan satu blok kode VBA (`Sub GenerateTPPLPresentation()`) yang dapat langsung disalin ke menu `Alt + F11` Microsoft PowerPoint. Kode ini harus secara otomatis membuat 13 slide baru dengan judul, poin materi, pewarnaan tema aviasi elegan (Dark Navy & Sky Blue), serta otomatis memasukkan teks *Speaker Notes* ke panel catatan masing-masing slide.

### FORMAT C: PANDUAN TANYA-JAWAB UJIAN (Q&A DEFENSE CHEAT SHEET)
Tuliskan 5 pertanyaan paling sering ditanyakan oleh dosen penguji mata kuliah TPPL beserta jawaban ilmiah terbaiknya berdasarkan materi di atas:
1. *Apa saja bagian-bagian penyusun sebuah Test Case standar menurut ISTQB dan bagaimana pemetaannya di Apache JMeter?*
2. *Apa perbedaan esensial antara System Testing dengan Integration Testing pada proyek ini?*
3. *Mengapa request yang menghasilkan error 400 atau 409 di JMeter tetap diberi tanda centang hijau (Passed)?*
4. *Bagaimana Anda membuktikan bahwa sistem aman dari tabrakan pemesanan ganda (double-booking)?*
5. *Bagaimana mekanisme korelasi data dinamis bekerja di JMeter untuk menyimulasikan alur transaksi nyata?*

---

Silakan proses dan hasilkan seluruh materi presentasi di atas sekarang!
```
