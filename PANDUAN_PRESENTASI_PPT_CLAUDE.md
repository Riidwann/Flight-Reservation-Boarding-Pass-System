# PANDUAN DAN PROMPT CLAUDE: PEMBUATAN SLIDE PRESENTASI UTS
## Mata Kuliah: Teknik Pengujian Perangkat Lunak (TPPL)
## Topik: Teori & Implementasi System Testing Menggunakan Apache JMeter pada SkyPass Airlines

> **Petunjuk Penggunaan:**  
> Salin (*copy*) seluruh teks di bawah garis pemisah (*horizontal rule*) berikut ini dan tempelkan (*paste*) langsung ke chat **Claude** (atau unggah berkas `.md` ini ke Claude.ai). Berkas ini telah dilengkapi dengan **definisi formal System Testing**, **hierarki level pengujian (V-Model)**, **taksonomi pengujian**, **bedah teoritis ke-15 test cases**, serta **data riil hasil eksekusi Apache JMeter**.

---

```markdown
# PROMPT UNTUK CLAUDE: PEMBUATAN SLIDE PRESENTASI & SPEAKER NOTES UTS TPPL
# FOKUS: TEORI SYSTEM TESTING, BEDAH KASUS UJI, & HASIL PENGUJIAN APACHE JMETER

Halo Claude, Anda berperan sebagai **Senior QA Engineering Specialist** sekaligus **Dosen Pengampu Mata Kuliah Teknik Pengujian Perangkat Lunak (TPPL)**.

Saya sedang menyusun materi presentasi untuk Ujian Tengah Semester (UTS) saya. Dosen penguji meminta agar presentasi ini tidak hanya menampilkan tabel hasil pengujian (passed/failed), tetapi secara mendalam mengupas:
1. **Definisi Formal & Konsep Akademis System Testing** (berdasarkan standar ISTQB & IEEE).
2. **Posisi System Testing dalam Piramida Pengujian / V-Model**.
3. **Bedah Teori & Urgensi di balik masing-masing jenis pengujian sistem** yang diterapkan.
4. **Rincian mendalam ke-15 Test Case** (tujuan uji, skenario bisnis, teknik desain uji, dan risiko jika tidak diuji).
5. **Data empiris riil hasil eksekusi Apache JMeter** (dari file `test-results.jtl`).

Tolong buatkan materi presentasi PowerPoint (12 Slide) yang berbobot akademis tinggi, komprehensif, terstruktur rapi, dan dilengkapi naskah presentasi (*Speaker Notes*) yang fasih.

---

## 1. LANDASAN TEORI FORMAL: DEFINISI & KONSEP SYSTEM TESTING

Berikut adalah landasan teori yang wajib Anda masukkan dan jelaskan di dalam materi presentasi:

### A. Definisi Formal System Testing (Standar ISTQB & IEEE 829/ISO 29119)
- **Definisi**: *System Testing* adalah level pengujian perangkat lunak di mana sistem yang lengkap dan terintegrasi secara utuh diuji untuk mengevaluasi apakah sistem telah memenuhi kebutuhan fungsional (*functional requirements*) dan spesifikasi sistem secara menyeluruh.
- **Karakteristik Utama System Testing**:
  1. **End-to-End Evaluation**: Menguji sistem dari awal hingga akhir (*end-to-end*), mencakup protokol komunikasi jaringan (HTTP/REST), logika bisnis backend, mekanisme transisi status (*state machine*), hingga persistensi data di media penyimpanan.
  2. **Pendekatan Black-Box**: Penguji memposisikan diri sebagai pihak luar / pengguna / sistem eksternal tanpa melihat struktur internal kode program (*implementation-agnostic*), melainkan fokus pada masukan (*input*), luaran (*output*), dan kepatuhan terhadap kontrak spesifikasi API.
  3. **Pengujian Kondisi Nyata**: Menguji bagaimana subsistem bekerja sama secara harmonis di bawah kondisi nyata, termasuk menangani input tidak valid, beban simultan, dan pelanggaran aturan bisnis.

### B. Posisi System Testing dalam Piramida Pengujian & V-Model
Jelaskan hierarki level pengujian untuk menunjukkan wawasan akademis:
1. **Level 1 - Unit Testing**: Menguji modul/fungsi terkecil secara terisolasi (White-Box).
2. **Level 2 - Integration Testing**: Menguji antarmuka dan interaksi antar-modul internal.
3. **Level 3 - SYSTEM TESTING (Fokus Proyek Ini)**: Menguji keseluruhan sistem yang telah dirakit utuh terhadap *System Requirements Specification* (SRS). Pada proyek ini, JMeter bertindak sebagai *black-box actor* eksternal yang membombardir REST API sistem.
4. **Level 4 - Acceptance Testing (UAT)**: Validasi kesesuaian sistem terhadap kebutuhan operasional pengguna akhir.

### C. Taksonomi Jenis Pengujian Sistem yang Diimplementasikan
Dalam proyek SkyPass Airlines ini, System Testing dibagi ke dalam 6 cabang spesifik:
1. **Functional / Discovery Testing**: Memvalidasi fungsionalitas utama berjalan sesuai ekspektasi (*Happy Path*).
2. **Negative & Robustness Testing**: Menguji ketahanan sistem dalam menolak data ilegal secara elegan tanpa mengalami *system crash* atau *unhandled exception* (HTTP 500).
3. **Boundary Value Testing (BVA)**: Menguji batas parameter antarmuka dan batasan fisik dunia nyata (misal: batas kapasitas kabin pesawat).
4. **Concurrency & Race Condition Testing**: Menguji kemampuan sistem menangani akses simultan pada data yang sama (misal: pencegahan *double-booking* kursi).
5. **State Transition & Lifecycle Testing**: Menguji keabsahan perpindahan status data (*Available* &rarr; *Reserved* &rarr; *Checked-In* &rarr; *Cancelled*).
6. **Security Authorization Testing**: Menguji proteksi akses terhadap data penumpang (mencegah manipulasi tiket oleh pengguna yang tidak berhak).

---

## 2. BEDAH TEORITIS KE-15 TEST CASES SYSTEM TESTING

Jelaskan alasan dan tujuan dari setiap kasus uji berikut di dalam presentasi:

| Kode TC | Nama Pengujian | Teknik Desain Uji | Mengapa Perlu Diuji? (Tujuan & Analisis Risiko) | Validasi & Assertion |
| :---: | :--- | :--- | :--- | :--- |
| **TC01** | E2E Flight Search Valid | *Equivalence Partitioning (Valid)* | Membuktikan bahwa pencarian rute resmi (`CGK` &rarr; `DPS`) berhasil menemukan jadwal penerbangan aktif dan ketersediaan kursi. Risiko jika gagal: Pengguna tidak bisa membeli tiket sama sekali. | HTTP 200 OK, Ekstrak `flightNumber` (`AW-101`) & cek sisa kursi > 0. |
| **TC02** | Search Non-Existent Route | *Equivalence Partitioning (Invalid)* | Menguji respons sistem ketika mencari rute yang tidak ada (`CGK` &rarr; `XYZ`). Sistem harus merespons secara aman dengan array kosong `[]`, bukan error 500. | HTTP 200 OK, Assertion body `[]`. |
| **TC03** | Missing Parameter Boundary | *Boundary Value Analysis* | Menguji validasi antarmuka saat parameter wajib diabaikan (`origin=CGK` tanpa `destination`). Sistem harus mencegah pemrosesan query ilegal. | HTTP 400 Bad Request, Pesan: `"destination parameter is required"`. |
| **TC04** | Retrieve Cabin Seat Map | *Inventory State Presentation* | Memverifikasi bahwa denah kabin fisik 30 kursi (1A–5F) dapat disajikan secara utuh dengan status kursi yang akurat sebelum penumpang memilih. | HTTP 200 OK, Ekstrak kursi pertama yang berstatus *available* (`1A`). |
| **TC05** | Query Fictitious Flight | *Resource Boundary Testing* | Menguji ketahanan endpoint jika nomor penerbangan tidak dikenal (`AW-999`). Mencegah kebocoran data (*data leakage*) pada *resource* tak bertuan. | HTTP 404 Not Found, Pesan: `"Flight not found"`. |
| **TC06** | E2E Booking & PNR Issuance | *E2E Transactional Flow* | Alur inti transaksi: penumpang menginput identitas dan nomor kursi `1A`. Sistem wajib menerbitkan 6-karakter kode PNR resmi dan mengubah status kursi menjadi `reserved`. | HTTP 201 Created, Ekstrak kode PNR unik (`SK...`), status `"CONFIRMED"`. |
| **TC07** | Double Booking Collision | *Concurrency & Collision* | **Kritis**: Mensimulasikan dua penumpang memesan kursi yang sama (`1A`) pada waktu bersamaan. Sistem wajib menolak pemesanan kedua demi mencegah *overbooking*. | HTTP 409 Conflict, Pesan: `"Seat already reserved"`. |
| **TC08** | Malformed Email Validation | *Input Schema Validation* | Menguji validasi format email (`"not-an-email"`). Mencegah data sampah (*corrupted data*) masuk ke basis data reservasi. | HTTP 400 Bad Request, Pesan: `"Invalid email format"`. |
| **TC09** | Out-of-Bounds Seat Number | *Physical Boundary Testing* | Menguji batas fisik kabin pesawat: pengguna mencoba memesan kursi `99Z` (padahal kabin hanya 1A–5F). Sistem wajib memblokir input di luar batas fisik armada. | HTTP 400 Bad Request, Pesan: `"Invalid seat number"`. |
| **TC10** | Retrieve Booking by PNR | *Data Persistence & Integrity* | Membuktikan bahwa transaksi pemesanan pada TC06 benar-benar tersimpan secara persisten di storage dan dapat dipanggil kembali secara identik. | HTTP 200 OK, JSON Path mencocokkan PNR, Nama, dan Nomor Kursi. |
| **TC11** | Query Fictitious PNR | *Negative Identifier Query* | Menguji query kode booking fiktif (`FAKEXX`). Sistem harus merespons 404 tanpa mengekspos jejak kesalahan internal server (*stack trace*). | HTTP 404 Not Found, Pesan: `"Booking not found"`. |
| **TC12** | E2E Check-In & Boarding Pass | *State Transition Testing* | Memvalidasi perpindahan siklus hidup tiket: dari `CONFIRMED` menjadi `CHECKED_IN`, penerbitan nomor pintu (*Gate*), jam boarding, dan hash barcode. | HTTP 200 OK, Status tiket berubah menjadi `CHECKED_IN`, status kursi `checked_in`. |
| **TC13** | Duplicate Check-In Attempt | *State Machine Integrity* | Menguji pelanggaran aturan transisi: Penumpang yang sudah berstatus *Checked-In* dilarang melakukan check-in ulang untuk mencegah duplikasi tiket fisik. | HTTP 400 Bad Request, Pesan: `"Already checked in"`. |
| **TC14** | Security Email Mismatch | *Security Authorization* | Menguji keamanan data: Melakukan check-in pada kode PNR valid milik orang lain tetapi menggunakan email yang salah. Sistem wajib menolak akses ilegal ini. | HTTP 403 Forbidden, Pesan: `"Email verification failed"`. |
| **TC15** | Booking Cancel & Seat Rollback | *State Rollback & Recovery* | Menguji pembatalan tiket: Kode PNR dibatalkan (`CANCELLED`), tiket dinyatakan `VOID`, dan kursi `1A` wajib dikembalikan (*rollback*) ke inventaris sebagai `available`. | HTTP 200 OK, Status tiket `CANCELLED`, verifikasi kursi kembali *Available*. |

---

## 3. DATASET EMPIRIS HASIL EKSEKUSI APACHE JMETER

Berikut adalah data riil dari berkas `test-results.jtl` dan `html-report/statistics.json` di repositori proyek:

### A. Metrik Statistik Global:
- **Total Sampler Dieksekusi**: 16 Sampler (1 Setup Idempotency + 15 Test Cases)
- **Tingkat Kelulusan (Success Rate)**: **100% Passed (16/16 Lulus)**
- **Tingkat Kesalahan (Error Rate)**: **0.00%**
- **Waktu Respons Rata-Rata (Mean Response Time)**: **~4.6 ms** per request
- **Throughput Rata-Rata**: ~250.0 hingga 333.3 transaksi per detik
- **Application Performance Index (APDEX)**: **1.0 (Optimal)**

### B. Log Waktu Respons Riil Tiap Test Case (Sumber: `test-results.jtl`):
- `Setup - Reset Database`: 90 ms | Status: **PASSED** (200 OK)
- `TC01 - Search Flights Valid`: 3 ms | Status: **PASSED** (200 OK)
- `TC02 - Search Non-Existent Route`: 4 ms | Status: **PASSED** (200 OK)
- `TC03 - Missing Parameter Boundary`: 3 ms | Status: **PASSED** (400 Bad Request)
- `TC04 - Retrieve Cabin Seat Map`: 6 ms | Status: **PASSED** (200 OK)
- `TC05 - Fictitious Flight Resource`: 4 ms | Status: **PASSED** (404 Not Found)
- `TC06 - E2E Booking Creation`: 9 ms | Status: **PASSED** (201 Created)
- `TC07 - Double Booking Collision`: 4 ms | Status: **PASSED** (409 Conflict)
- `TC08 - Malformed Email Format`: 4 ms | Status: **PASSED** (400 Bad Request)
- `TC09 - Out-of-Bounds Seat Number`: 4 ms | Status: **PASSED** (400 Bad Request)
- `TC10 - Retrieve Booking by PNR`: 3 ms | Status: **PASSED** (200 OK)
- `TC11 - Query Non-Existent PNR`: 5 ms | Status: **PASSED** (404 Not Found)
- `TC12 - Execute Check-In`: 4 ms | Status: **PASSED** (200 OK)
- `TC13 - Duplicate Check-In Attempt`: 4 ms | Status: **PASSED** (400 Bad Request)
- `TC14 - Check-In Email Mismatch`: 5 ms | Status: **PASSED** (403 Forbidden)
- `TC15 - Cancel Booking & Rollback`: 4 ms | Status: **PASSED** (200 OK)

---

## 4. STRUKTUR 12 SLIDE PRESENTASI YANG HARUS ANDA BUATKAN

Tolong susunkan materi presentasi slide demi slide dengan ketentuan:
1. **Slide 1: Title & Identitas Akademik** (Mata Kuliah TPPL, Judul Proyek, Nama & NIM).
2. **Slide 2: Konsep & Definisi Formal System Testing** (Pengertian ISTQB/IEEE, Karakteristik Black-Box, dan Peran Krusialnya pada Transaksi Maskapai).
3. **Slide 3: Posisi System Testing dalam Piramida Pengujian & V-Model** (Membandingkan Unit Testing, Integration Testing, System Testing, dan UAT).
4. **Slide 4: Profil Aplikasi Target (SkyPass Airlines Architecture)** (Fitur Reservasi 30 penerbangan harian di 6 kota besar, Denah Kursi 1A–5F, Check-In, dan Boarding Pass).
5. **Slide 5: Taksonomi & Teknik Desain Pengujian Sistem** (Penjelasan EP, BVA, State Transition, Concurrency, dan Security Testing).
6. **Slide 6: Arsitektur Test Plan Apache JMeter** (Setup Thread Group, HTTP Defaults, JSON Path Extractor, Response Assertions, Listeners).
7. **Slide 7: Matriks Kasus Uji Bagian I: Discovery & Booking (TC01 - TC08)** (Tabel tujuan uji, metode HTTP, skenario, dan asersi).
8. **Slide 8: Matriks Kasus Uji Bagian II: Boundary, Security & Rollback (TC09 - TC15)** (Tabel tujuan uji, metode HTTP, skenario, dan asersi).
9. **Slide 9: Alur Korelasi Parameter Dinamis (*Dynamic Parameter Correlation*)** (Diagram passing variabel `${var_flightNumber}` &rarr; `${var_seatNumber}` &rarr; `${var_pnr}` &rarr; `${var_bpId}`).
10. **Slide 10: Strategi Negative Testing & Asersi Status Error HTTP di JMeter** (Penjelasan mengapa HTTP 400, 403, 404, 409 tetap dinyatakan lulus / *Passed* dengan fitur *Ignore Status*).
11. **Slide 11: Hasil Eksekusi, Metrik Kualitas & Laporan Empiris** (Tingkat kelulusan 100%, Error 0%, waktu respons rata-rata 4.6 ms, laporan HTML JMeter).
12. **Slide 12: Panduan Live Demo JMeter, Kesimpulan & Q&A** (Langkah demonstrasi praktis di kelas, kesimpulan mutu software, dan penutup).

---

## 5. FORMAT LUARAN (OUTPUT) YANG DIMINTA

Berikan output secara lengkap dan rapi dalam format berikut:

### FORMAT A: KONTEN LENGKAP 12 SLIDE BESERTA SPEAKER NOTES
Untuk setiap slide dari 1 sampai 12, sediakan:
- **Judul Slide**
- **Panduan Visual & Layout Slide** (Rekomendasi penataan kotak, diagram, tabel, atau ikon)
- **Teks Poin Slide** (Padat, ringkas, profesional, mudah dibaca)
- **Speaker Notes Terpandu** (Naskah lengkap dalam bahasa Indonesia formal untuk saya bacakan saat presentasi).

### FORMAT B: KODE MACRO VBA POWERPOINT (AUTO-SLIDE GENERATOR)
Berikan satu blok kode VBA (`Sub GenerateTPPLPresentation()`) yang dapat langsung disalin ke menu `Alt + F11` Microsoft PowerPoint. Kode ini harus secara otomatis membuat 12 slide baru dengan judul, poin materi, pewarnaan tema aviasi elegan (Dark Navy & Sky Blue), serta otomatis memasukkan teks *Speaker Notes* ke panel catatan masing-masing slide.

### FORMAT C: PANDUAN TANYA-JAWAB UJIAN (Q&A DEFENSE CHEAT SHEET)
Tuliskan 5 pertanyaan paling sering ditanyakan oleh dosen penguji mata kuliah TPPL beserta jawaban ilmiah terbaiknya berdasarkan materi di atas:
1. *Apa perbedaan esensial antara System Testing dengan Integration Testing pada proyek ini?*
2. *Mengapa request yang menghasilkan error 400 atau 409 di JMeter tetap diberi tanda centang hijau (Passed)?*
3. *Bagaimana Anda membuktikan bahwa sistem aman dari tabrakan pemesanan ganda (double-booking)?*
4. *Bagaimana mekanisme korelasi data dinamis bekerja di JMeter untuk menyimulasikan alur transaksi nyata?*
5. *Mengapa prinsip Idempotensi pengujian sangat penting dan bagaimana Anda mengimplementasikannya di JMeter?*

---

Silakan proses dan hasilkan seluruh materi presentasi di atas sekarang!
```
