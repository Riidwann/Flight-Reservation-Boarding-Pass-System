# Design Specification: SkyPass Airlines System & JMeter System Testing Suite

**Date**: 2026-09-29  
**System Name**: SkyPass Airlines Reservation & Boarding Pass System  
**Testing Framework**: Apache JMeter (System Testing Suite: TC01 - TC15)

---

## 1. System Overview & Architecture

SkyPass Airlines is an integrated flight reservation and web check-in application built to demonstrate full-stack software development and comprehensive **System Testing** using Apache JMeter.

### Technology Stack
- **Backend Runtime**: Node.js (v22.x compatible)
- **Web Framework**: Express.js
- **Persistence Layer**: Local JSON-backed transactional storage (`data/database.json`) with in-memory synchronization, zero external DBMS dependencies, zero compilation requirements on Windows.
- **Frontend Layer**: Responsive web interface (`public/index.html`, `public/seats.html`, `public/checkin.html`, `public/boarding-pass.html`) using vanilla HTML5/CSS3/JavaScript.
- **Testing Tool**: Apache JMeter Test Plan (`skypass-system-testing.jmx`).

---

## 2. Domain Model & Data Schemas

### 2.1 Flight Entity (`flights`)
```json
{
  "flightNumber": "AW-101",
  "airline": "SkyPass Airlines",
  "origin": "CGK",
  "destination": "DPS",
  "departureTime": "08:00",
  "arrivalTime": "10:50",
  "price": 1250000,
  "totalSeats": 30,
  "availableSeats": 29
}
```

### 2.2 Seat Entity (`seats`)
Aircraft cabin configuration: 5 rows (1 to 5) with 6 seats each (A, B, C, D, E, F) totaling 30 seats.
```json
{
  "flightNumber": "AW-101",
  "seatNumber": "1A",
  "status": "available", // "available" | "reserved" | "checked_in"
  "passengerName": null
}
```

### 2.3 Booking Entity (`bookings`)
```json
{
  "pnr": "SK8F2A",
  "flightNumber": "AW-101",
  "passengerName": "Budi Santoso",
  "passengerEmail": "budi.santoso@example.com",
  "passengerPassport": "A12345678",
  "seatNumber": "1A",
  "status": "CONFIRMED", // "CONFIRMED" | "CHECKED_IN" | "CANCELLED"
  "createdAt": "2026-09-29T11:45:00.000Z"
}
```

### 2.4 Boarding Pass Entity (`boardingPasses`)
```json
{
  "boardingPassId": "BP-SK8F2A-01",
  "pnr": "SK8F2A",
  "flightNumber": "AW-101",
  "passengerName": "Budi Santoso",
  "seatNumber": "1A",
  "gate": "G4",
  "boardingTime": "07:20",
  "barcodeHash": "AERO-SK8F2A-AW101-1A-CONFIRMED",
  "status": "VALID",
  "issuedAt": "2026-09-29T11:48:00.000Z"
}
```

---

## 3. System Endpoints & Business Rules

1. `GET /api/flights`
   - Query params: `origin`, `destination`
   - Validation: If either is missing, return `400 Bad Request`.
   - Behavior: Filters available flights. If none match, returns `200 OK` with empty array `[]`.

2. `GET /api/flights/:flightNumber/seats`
   - Validation: If flight does not exist, return `404 Not Found`.
   - Behavior: Returns list of 30 seats with current status.

3. `POST /api/bookings`
   - Payload: `{ flightNumber, passengerName, passengerEmail, passengerPassport, seatNumber }`
   - Validation:
     - Missing fields or invalid email -> `400 Bad Request`.
     - Invalid seat (not in 1A..5F) -> `400 Bad Request`.
     - Flight not found -> `404 Not Found`.
     - Seat already reserved or checked_in -> `409 Conflict` (`"Seat already reserved"`).
   - Behavior: Generates 6-character PNR, sets seat status to `reserved`, decreases availableSeats, returns `201 Created`.

4. `GET /api/bookings/:pnr`
   - Validation: If PNR not found, return `404 Not Found`.
   - Behavior: Returns booking details.

5. `POST /api/check-in`
   - Payload: `{ pnr, passengerEmail }`
   - Validation:
     - Missing fields -> `400 Bad Request`.
     - PNR not found -> `404 Not Found`.
     - Email mismatch -> `403 Forbidden` (`"Email verification failed"`).
     - Already checked in -> `400 Bad Request` (`"Already checked in"`).
     - Cancelled booking -> `400 Bad Request` (`"Booking is cancelled"`).
   - Behavior: Changes booking status to `CHECKED_IN`, updates seat status to `checked_in`, issues Boarding Pass, returns `200 OK`.

6. `GET /api/boarding-pass/:pnr`
   - Validation: If PNR or boarding pass not found, return `404 Not Found`.
   - Behavior: Returns digital boarding pass with gate, boarding time, and barcode.

7. `POST /api/bookings/:pnr/cancel`
   - Validation: If PNR not found -> `404 Not Found`.
   - Behavior: Sets booking status to `CANCELLED`, restores seat status to `available`, increments flight availableSeats, returns `200 OK`.

8. `POST /api/system/reset`
   - Behavior: Resets the database to default seed state (fresh flights and seats) to allow clean, idempotent automated test runs.

---

## 4. Matriks 15 Test Case System Testing (JMeter Specification)

| TC ID | Sub-Tipe System Testing | Target Request & Parameter | Validasi & Assertion JMeter |
| :--- | :--- | :--- | :--- |
| **TC01** | E2E Functional Discovery | `GET /api/flights?origin=CGK&destination=DPS` | Code: 200, JSON Path `$[0].flightNumber` exists, extract `${var_flightNumber}`. |
| **TC02** | Negative / Zero-Result | `GET /api/flights?origin=CGK&destination=XYZ` | Code: 200, JSON Path `$` length == 0. |
| **TC03** | Interface Boundary | `GET /api/flights?origin=CGK` | Code: 400, Response contains `"destination parameter is required"`. |
| **TC04** | Inventory State Presentation | `GET /api/flights/${var_flightNumber}/seats` | Code: 200, extract first available seat `${var_seatNumber}`. |
| **TC05** | Resource Boundary | `GET /api/flights/AW-999/seats` | Code: 404, Response contains `"Flight not found"`. |
| **TC06** | E2E Transactional Flow | `POST /api/bookings` with valid data & `${var_seatNumber}` | Code: 201, extract `${var_pnr}`, assert status == `"CONFIRMED"`. |
| **TC07** | Concurrency / Double-Booking | `POST /api/bookings` reusing `${var_flightNumber}` & `${var_seatNumber}` | Code: 409, Response contains `"Seat already reserved"`. |
| **TC08** | Input Schema Validation | `POST /api/bookings` with invalid email format | Code: 400, Response contains `"Invalid email format"`. |
| **TC09** | Aircraft Physical Boundary | `POST /api/bookings` with seatNumber `"99Z"` | Code: 400, Response contains `"Invalid seat number"`. |
| **TC10** | Data Persistence Integrity | `GET /api/bookings/${var_pnr}` | Code: 200, JSON Path matches passenger name & seatNumber. |
| **TC11** | Negative Identifier Query | `GET /api/bookings/FAKEXX` | Code: 404, Response contains `"Booking not found"`. |
| **TC12** | E2E Check-In & Issuance | `POST /api/check-in` with `${var_pnr}` & registered email | Code: 200, extract `${var_bpId}`, assert status == `"CHECKED_IN"`. |
| **TC13** | State Machine Transition | `POST /api/check-in` duplicate attempt with `${var_pnr}` | Code: 400, Response contains `"Already checked in"`. |
| **TC14** | Security & Auth Boundary | `POST /api/check-in` with valid `${var_pnr}` + wrong email | Code: 403, Response contains `"Email verification failed"`. |
| **TC15** | State Rollback & Recovery | `POST /api/bookings/${var_pnr}/cancel` followed by seat check | Code: 200, status == `"CANCELLED"`, seat status reverted to `"available"`. |

---

## 5. Artifacts and Deliverables

1. Complete runnable application in root directory (`server.js`, `package.json`, `data/`, `public/`).
2. JMeter Test Plan (`skypass-system-testing.jmx`) configured with:
   - User Defined Variables (`host=localhost`, `port=3000`)
   - HTTP Request Samplers for TC01 - TC15
   - Regular Expression / JSON Path Extractors
   - Response Code Assertions & JSON Path Assertions
   - View Results Tree & Summary Report Listeners
3. Documentation (`SYSTEM_TESTING_GUIDE.md`) with instructions on running the app and executing the test plan in JMeter.
