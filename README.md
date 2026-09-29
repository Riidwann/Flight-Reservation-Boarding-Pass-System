# SkyPass Airlines - Flight Reservation & Boarding Pass System

Aplikasi target pengujian sistem (*System Testing Target Application*) untuk **Apache JMeter**, menyimulasikan sistem reservasi penerbangan, pemilihan denah kursi kabin pesawat (*Seat Map*), web check-in, dan penerbitan *Digital Boarding Pass*.

## 🚀 Quick Start (Menjalankan Langsung)

1. Jalankan aplikasi:
   ```bash
   npm start
   ```
2. Buka browser pada alamat:
   - **Web Portal**: [http://localhost:3000](http://localhost:3000)
   - **Web Check-In**: [http://localhost:3000/checkin.html](http://localhost:3000/checkin.html)
   - **Health Check API**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

3. Uji coba cepat 15 Test Cases:
   ```bash
   npm test
   ```

---

## 🧪 System Testing dengan Apache JMeter

File test plan JMeter lengkap dengan **15 Test Cases (TC01 s/d TC15)** tersedia pada file:
`skypass-system-testing.jmx`

Untuk panduan lengkap cara membuka, menjalankan, dan membaca laporan pengujian di Apache JMeter, silakan baca:
📘 [**SYSTEM_TESTING_GUIDE.md**](./SYSTEM_TESTING_GUIDE.md)

---

## 📁 Struktur Direktori Proyek

```text
Jmeter/
├── package.json                   # Konfigurasi dependensi Node.js
├── server.js                      # Entry point server (Port 3000)
├── skypass-system-testing.jmx     # File Apache JMeter Test Plan (15 TCs)
├── SYSTEM_TESTING_GUIDE.md        # Panduan lengkap pengujian JMeter
├── README.md                      # Dokumentasi utama proyek
├── data/
│   ├── database.json              # Penyimpanan persisten lokal (JSON Store)
│   └── seed.json                  # Cadangan data awal untuk reset otomatis
├── src/
│   ├── app.js                     # Handler Express & routing REST API
│   └── db.js                      # Transaction manager & state transitions
├── public/                        # Antarmuka web frontend
│   ├── index.html                 # Pencarian jadwal & rute penerbangan
│   ├── seats.html                 # Peta interaktif kabin 30 kursi (1A - 5F)
│   ├── checkin.html               # Portal web check-in online
│   ├── boarding-pass.html         # Tampilan digital boarding pass & barcode
│   ├── styles.css                 # Desain modern tema maskapai penerbangan
│   └── app.js                     # Client-side JavaScript
└── test/
    ├── api.test.js                # Automated runner 15 System Test Cases
    └── db.test.js                 # Unit test transactional database
```

---

## 📋 Ringkasan 15 Test Case (Standar ISTQB)

1. **TC01**: E2E Flight Search (`GET /api/flights`) &rarr; 200 OK & simpan `flightNumber`.
2. **TC02**: Non-Existent Route (`GET /api/flights?origin=CGK&destination=XYZ`) &rarr; 200 OK array kosong `[]`.
3. **TC03**: Missing Parameter Boundary (`GET /api/flights?origin=CGK`) &rarr; 400 Bad Request.
4. **TC04**: Retrieve Cabin Seat Map (`GET /api/flights/${flightNumber}/seats`) &rarr; 200 OK & ambil kursi tersedia.
5. **TC05**: Non-Existent Flight (`GET /api/flights/AW-999/seats`) &rarr; 404 Not Found.
6. **TC06**: E2E Booking Creation (`POST /api/bookings`) &rarr; 201 Created & generate PNR unik 6 digit.
7. **TC07**: Double Booking Seat Collision (`POST /api/bookings`) &rarr; 409 Conflict.
8. **TC08**: Malformed Email Schema (`POST /api/bookings`) &rarr; 400 Bad Request.
9. **TC09**: Out-of-Bounds Seat Number (`POST /api/bookings`) &rarr; 400 Bad Request.
10. **TC10**: Retrieve Booking by PNR (`GET /api/bookings/${pnr}`) &rarr; 200 OK & integritas data.
11. **TC11**: Non-Existent PNR Query (`GET /api/bookings/FAKEXX`) &rarr; 404 Not Found.
12. **TC12**: E2E Web Check-In (`POST /api/check-in`) &rarr; 200 OK & penerbitan Boarding Pass.
13. **TC13**: Duplicate Check-In State Violation (`POST /api/check-in`) &rarr; 400 Bad Request.
14. **TC14**: Security / Email Mismatch (`POST /api/check-in`) &rarr; 403 Forbidden.
15. **TC15**: Cancellation & Seat Release (`POST /api/bookings/${pnr}/cancel`) &rarr; 200 OK & pemulihan kursi.
