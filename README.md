# SkyPass Airlines - Flight Reservation & Boarding Pass System

Aplikasi reservasi penerbangan dan penerbitan *Digital Boarding Pass* modern berstandar komersial yang sekaligus dirancang sebagai aplikasi target pengujian sistem (*System Testing Target Application*) untuk **Apache JMeter** (15 Test Cases standar ISTQB).

---

## 🌟 Fitur Utama Aplikasi

1. **Pencarian Jadwal Penerbangan Luas & Bervariasi**:
   - Menghubungkan 6 kota besar di Indonesia: **Jakarta (CGK)**, **Surabaya (SUB)**, **Bali (DPS)**, **Yogyakarta (JOG)**, **Medan (KNO)**, dan **Makassar (UPG)**.
   - Menyediakan **30 jadwal penerbangan harian** dengan pilihan waktu keberangkatan fleksibel (Pagi, Siang, Sore, Malam).
   - Fitur *swap route* (`⇄`) instan dan indikator ketersediaan sisa kursi (*real-time inventory*).

2. **Denah Kabin Pesawat Interaktif (*Interactive Seat Map*)**:
   - Visualisasi badan pesawat realistis (*Fuselage*) dengan siluet kokpit pilot, jendela kabin, dan sayap.
   - Konfigurasi kabin 30 kursi kelas ekonomi (Baris 1–5, Kursi A–F dengan lorong tengah / *aisle*).
   - Interaksi kursi responsif dengan efek visual *headrest* dan status dinamis (*Tersedia, Dipilih, Terpesan, Checked-In*).

3. **Check-In Mandiri Online**:
   - Validasi instan kode booking resmi (**PNR 6-karakter**) dan email penumpang.
   - Mekanisme keamanan aviasi ketat: proteksi *duplicate check-in* dan verifikasi kecocokan identitas penumpang.

4. **Digital Boarding Pass Resmi**:
   - Tata letak tiket fisik bandara dengan garis perforasi sobekan (*tear-off stub*), nomor kursi besar, pintu keberangkatan (*Gate*), jam boarding, dan simulasi barcode resolusi tajam.
   - Dukungan cetak rapi (*Print-ready layout*) dengan `Ctrl + P` atau tombol simpan PDF tanpa navbar/footer.
   - Fitur pembatalan reservasi (*Cancel Booking*) dengan pelepasan status kursi secara otomatis kembali ke sistem.

5. **Desain Antarmuka Premium & Profesional**:
   - Tipografi modern **Plus Jakarta Sans** dan **JetBrains Mono**.
   - Sistem notifikasi *Toast* dan dialog konfirmasi modal terintegrasi, bebas dari elemen pengujian teknis pada antarmuka publik.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat:
- **Node.js**: Versi 18.x, 20.x, atau 22.x (Sudah terpasang di sistem).
- Tidak membutuhkan instalasi DBMS eksternal (menggunakan JSON Store transaksional lokal).

### 2. Menjalankan Server:
```bash
npm start
```
Server akan aktif di:
- **Portal Reservasi**: [http://localhost:3000](http://localhost:3000)
- **Check-In Mandiri**: [http://localhost:3000/checkin.html](http://localhost:3000/checkin.html)
- **Health Check API**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Swagger API Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 3. Menjalankan Pengujian Otomatis (15 Test Cases):
```bash
npm test
```

---

## 🧪 System Testing dengan Apache JMeter

File test plan JMeter lengkap dengan skenario **TC01 s/d TC15** tersedia pada:
📁 **`skypass-system-testing.jmx`**

Panduan lengkap cara membuka, menjalankan, dan menghasilkan laporan HTML interaktif di Apache JMeter tersedia di:
📘 [**SYSTEM_TESTING_GUIDE.md**](./SYSTEM_TESTING_GUIDE.md)

---

## 📁 Struktur Direktori Proyek

```text
Jmeter/
├── package.json                   # Konfigurasi dependensi Node.js
├── server.js                      # Entry point Express server (Port 3000)
├── skypass-system-testing.jmx     # File Apache JMeter Test Plan (15 TCs)
├── SYSTEM_TESTING_GUIDE.md        # Panduan lengkap pengujian JMeter
├── README.md                      # Dokumentasi utama proyek
├── data/
│   ├── database.json              # Database lokal persisten (30 jadwal penerbangan)
│   └── seed.json                  # Cadangan data awal untuk reset otomatis
├── src/
│   ├── app.js                     # Express API router & business rules
│   └── db.js                      # Transaction manager & state transitions
├── public/                        # Antarmuka web frontend (Clean & Professional)
│   ├── index.html                 # Pencarian jadwal penerbangan & wizard tahapan
│   ├── seats.html                 # Denah kabin kabin pesawat realistis (1A - 5F)
│   ├── checkin.html               # Portal check-in mandiri online
│   ├── boarding-pass.html         # Digital boarding pass dengan barcode & cetak PDF
│   ├── styles.css                 # Desain sistem aviasi & responsive stylesheet
│   └── app.js                     # Logika klien, toast, modal dialog, & kamus bandara
├── test/
│   ├── api.test.js                # Test runner otomatis 15 System Test Cases
│   └── db.test.js                 # Unit test transactional database
└── docs/                          # Spesifikasi arsitektur & rencana teknis
```

---

## 📋 Ringkasan 15 Test Case (Standar ISTQB)

| Kode TC | Skenario Pengujian | Tipe System Testing | Hasil yang Diharapkan |
| :---: | :--- | :--- | :--- |
| **TC01** | E2E Flight Search (`CGK` &rarr; `DPS`) | Positive Discovery | 200 OK & menangkap `AW-101` |
| **TC02** | Non-Existent Route (`CGK` &rarr; `XYZ`) | Negative Functional | 200 OK dengan array kosong `[]` |
| **TC03** | Missing Destination Parameter | Interface Boundary | 400 Bad Request & error validasi |
| **TC04** | Retrieve Cabin Seat Map | Inventory State | 200 OK & 30 kursi kabin tersedia |
| **TC05** | Query Fictitious Flight (`AW-999`) | Resource Boundary | 404 Not Found |
| **TC06** | E2E Passenger Booking Creation | E2E Transactional | 201 Created & generate PNR unik |
| **TC07** | Double Booking Seat Collision | Concurrency Conflict | 409 Conflict (kursi sudah terpesan) |
| **TC08** | Malformed Email Validation | Input Schema | 400 Bad Request |
| **TC09** | Out-of-Bounds Seat Number (`99Z`) | Physical Boundary | 400 Bad Request |
| **TC10** | Retrieve Booking by PNR | Data Persistence | 200 OK & verifikasi kecocokan data |
| **TC11** | Non-Existent PNR Query (`FAKEXX`) | Boundary Value | 404 Not Found |
| **TC12** | E2E Check-In & Boarding Pass Issuance | State Machine Transition | 200 OK & penerbitan nomor Gate |
| **TC13** | Duplicate Check-In Violation | State Integrity | 400 Bad Request |
| **TC14** | Security / Email Mismatch Check-In | Security Authorization | 403 Forbidden |
| **TC15** | Booking Cancellation & Seat Release | State Rollback & Recovery | 200 OK & kursi kembali *Available* |

---

## 📄 Lisensi & Hak Cipta
Hak Cipta &copy; 2026 **SkyPass Airlines Indonesia**. Seluruh hak cipta dilindungi undang-undang.
