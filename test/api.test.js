const assert = require('assert');
const app = require('../src/app');

let server;
const PORT = 3001; // Use separate port for testing
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('===============================================================');
  console.log('  RUNNING SYSTEM TESTING AUTOMATED SUITE (TC01 - TC15)');
  console.log('===============================================================');

  server = app.listen(PORT);

  // Helper request
  async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  }

  try {
    // 0. Reset system to pristine state
    await request('/api/system/reset', { method: 'POST' });

    let var_flightNumber = '';
    let var_seatNumber = '';
    let var_pnr = '';
    let var_bpId = '';
    const testPassengerEmail = 'budi.santoso@example.com';
    const testPassengerName = 'Budi Santoso';

    // -------------------------------------------------------------------------
    // TC01: E2E Flight Search with Valid Parameters (Positive Discovery)
    // -------------------------------------------------------------------------
    console.log('\n[TC01] - Search Flights with Valid Origin & Destination');
    {
      const res = await request('/api/flights?origin=CGK&destination=DPS');
      assert.strictEqual(res.status, 200, 'TC01: Expected 200 OK');
      assert.ok(Array.isArray(res.data) && res.data.length > 0, 'TC01: Expected array with flights');
      var_flightNumber = res.data[0].flightNumber;
      assert.strictEqual(var_flightNumber, 'AW-101');
      assert.ok(res.data[0].availableSeats > 0, 'TC01: Should have available seats');
      console.log(`  ✓ Passed: Found flight ${var_flightNumber} with ${res.data[0].availableSeats} seats available.`);
    }

    // -------------------------------------------------------------------------
    // TC02: Search Flights with Non-Existent Route (Negative / Zero Result)
    // -------------------------------------------------------------------------
    console.log('\n[TC02] - Search Flights with Non-Existent Route (CGK -> XYZ)');
    {
      const res = await request('/api/flights?origin=CGK&destination=XYZ');
      assert.strictEqual(res.status, 200, 'TC02: Expected 200 OK');
      assert.ok(Array.isArray(res.data) && res.data.length === 0, 'TC02: Expected empty array');
      console.log('  ✓ Passed: Correctly returned empty array [] without server crash.');
    }

    // -------------------------------------------------------------------------
    // TC03: Search Flights with Missing Required Parameter (Interface Boundary)
    // -------------------------------------------------------------------------
    console.log('\n[TC03] - Search Flights with Missing Destination Parameter');
    {
      const res = await request('/api/flights?origin=CGK');
      assert.strictEqual(res.status, 400, 'TC03: Expected 400 Bad Request');
      assert.ok(res.data.error.includes('destination parameter is required'), 'TC03: Error message validation');
      console.log('  ✓ Passed: System rejected request with 400 Bad Request and validation error.');
    }

    // -------------------------------------------------------------------------
    // TC04: Retrieve Aircraft Seat Map for Valid Flight (Inventory State)
    // -------------------------------------------------------------------------
    console.log(`\n[TC04] - Retrieve Seat Map for Flight ${var_flightNumber}`);
    {
      const res = await request(`/api/flights/${var_flightNumber}/seats`);
      assert.strictEqual(res.status, 200, 'TC04: Expected 200 OK');
      assert.strictEqual(res.data.length, 30, 'TC04: Expected full cabin of 30 seats');
      const availableSeat = res.data.find(s => s.status === 'available');
      assert.ok(availableSeat, 'TC04: Must find an available seat');
      var_seatNumber = availableSeat.seatNumber;
      console.log(`  ✓ Passed: Received 30 seats. Selected available seat ${var_seatNumber}.`);
    }

    // -------------------------------------------------------------------------
    // TC05: Retrieve Seat Map for Non-Existent Flight (Resource Boundary)
    // -------------------------------------------------------------------------
    console.log('\n[TC05] - Retrieve Seat Map for Fictitious Flight (AW-999)');
    {
      const res = await request('/api/flights/AW-999/seats');
      assert.strictEqual(res.status, 404, 'TC05: Expected 404 Not Found');
      assert.ok(res.data.error.includes('Flight not found'), 'TC05: Error message validation');
      console.log('  ✓ Passed: System returned 404 Not Found for non-existent flight resource.');
    }

    // -------------------------------------------------------------------------
    // TC06: Successful Passenger Booking & PNR Generation (E2E Transactional Flow)
    // -------------------------------------------------------------------------
    console.log(`\n[TC06] - Create Booking for Flight ${var_flightNumber}, Seat ${var_seatNumber}`);
    {
      const payload = {
        flightNumber: var_flightNumber,
        passengerName: testPassengerName,
        passengerEmail: testPassengerEmail,
        passengerPassport: 'A87654321',
        seatNumber: var_seatNumber
      };
      const res = await request('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 201, 'TC06: Expected 201 Created');
      assert.ok(res.data.pnr && res.data.pnr.length === 6, 'TC06: Expected 6-character PNR');
      assert.strictEqual(res.data.status, 'CONFIRMED', 'TC06: Expected status CONFIRMED');
      assert.strictEqual(res.data.seatNumber, var_seatNumber, 'TC06: Seat number match');
      var_pnr = res.data.pnr;
      console.log(`  ✓ Passed: Booking created with 201 Created. Generated PNR: ${var_pnr}.`);
    }

    // -------------------------------------------------------------------------
    // TC07: Double-Booking / Seat Collision Prevention (Concurrency & Resource Conflict)
    // -------------------------------------------------------------------------
    console.log(`\n[TC07] - Double Booking Collision: Attempt to re-book Seat ${var_seatNumber}`);
    {
      const payload = {
        flightNumber: var_flightNumber,
        passengerName: 'Another Passenger',
        passengerEmail: 'another@example.com',
        passengerPassport: 'B99999999',
        seatNumber: var_seatNumber
      };
      const res = await request('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 409, 'TC07: Expected 409 Conflict');
      assert.ok(res.data.error.includes('already reserved'), 'TC07: Error message validation');
      console.log('  ✓ Passed: System rejected duplicate reservation with 409 Conflict.');
    }

    // -------------------------------------------------------------------------
    // TC08: Booking with Invalid Email Format (Input Schema Validation)
    // -------------------------------------------------------------------------
    console.log('\n[TC08] - Create Booking with Malformed Email Format');
    {
      const payload = {
        flightNumber: var_flightNumber,
        passengerName: 'Invalid User',
        passengerEmail: 'not-an-email',
        passengerPassport: 'C1111111',
        seatNumber: '2B'
      };
      const res = await request('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 400, 'TC08: Expected 400 Bad Request');
      assert.ok(res.data.error.includes('Invalid email format'), 'TC08: Error message validation');
      console.log('  ✓ Passed: System rejected malformed email schema with 400 Bad Request.');
    }

    // -------------------------------------------------------------------------
    // TC09: Booking with Out-of-Bounds Seat Number (Aircraft Physical Boundary)
    // -------------------------------------------------------------------------
    console.log('\n[TC09] - Create Booking with Non-Existent Aircraft Seat (99Z)');
    {
      const payload = {
        flightNumber: var_flightNumber,
        passengerName: 'Test Passenger',
        passengerEmail: 'passenger@example.com',
        passengerPassport: 'D2222222',
        seatNumber: '99Z'
      };
      const res = await request('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 400, 'TC09: Expected 400 Bad Request');
      assert.ok(res.data.error.includes('Invalid seat number'), 'TC09: Error message validation');
      console.log('  ✓ Passed: System rejected out-of-bounds seat with 400 Bad Request.');
    }

    // -------------------------------------------------------------------------
    // TC10: Retrieve Booking Details by Valid PNR (Data Persistence Integrity)
    // -------------------------------------------------------------------------
    console.log(`\n[TC10] - Retrieve Booking Details for PNR: ${var_pnr}`);
    {
      const res = await request(`/api/bookings/${var_pnr}`);
      assert.strictEqual(res.status, 200, 'TC10: Expected 200 OK');
      assert.strictEqual(res.data.pnr, var_pnr);
      assert.strictEqual(res.data.passengerName, testPassengerName);
      assert.strictEqual(res.data.seatNumber, var_seatNumber);
      assert.strictEqual(res.data.status, 'CONFIRMED');
      console.log('  ✓ Passed: Booking record retrieved from persistent store with exact match.');
    }

    // -------------------------------------------------------------------------
    // TC11: Retrieve Booking Details with Non-Existent PNR (Negative Identifier Query)
    // -------------------------------------------------------------------------
    console.log('\n[TC11] - Retrieve Booking Details with Fictitious PNR (FAKEXX)');
    {
      const res = await request('/api/bookings/FAKEXX');
      assert.strictEqual(res.status, 404, 'TC11: Expected 404 Not Found');
      assert.ok(res.data.error.includes('Booking not found'), 'TC11: Error message validation');
      console.log('  ✓ Passed: System safely responded with 404 Not Found without leaking data.');
    }

    // -------------------------------------------------------------------------
    // TC12: Successful Web Check-In & Boarding Pass Issuance (E2E Check-In Flow)
    // -------------------------------------------------------------------------
    console.log(`\n[TC12] - Execute Web Check-In for PNR: ${var_pnr}`);
    {
      const payload = {
        pnr: var_pnr,
        passengerEmail: testPassengerEmail
      };
      const res = await request('/api/check-in', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 200, 'TC12: Expected 200 OK');
      assert.strictEqual(res.data.pnr, var_pnr);
      assert.strictEqual(res.data.status, 'VALID');
      assert.ok(res.data.boardingPassId, 'TC12: Must generate boardingPassId');
      assert.ok(res.data.gate, 'TC12: Must assign gate');
      assert.ok(res.data.boardingTime, 'TC12: Must assign boarding time');
      var_bpId = res.data.boardingPassId;
      console.log(`  ✓ Passed: Check-in completed. Issued ${var_bpId} at Gate ${res.data.gate}.`);
    }

    // -------------------------------------------------------------------------
    // TC13: Duplicate Check-In Attempt (State Machine Violation Prevention)
    // -------------------------------------------------------------------------
    console.log(`\n[TC13] - Duplicate Check-In Attempt for PNR: ${var_pnr}`);
    {
      const payload = {
        pnr: var_pnr,
        passengerEmail: testPassengerEmail
      };
      const res = await request('/api/check-in', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 400, 'TC13: Expected 400 Bad Request');
      assert.ok(res.data.error.includes('Already checked in'), 'TC13: Error message validation');
      console.log('  ✓ Passed: State machine violation blocked with 400 Bad Request.');
    }

    // -------------------------------------------------------------------------
    // TC14: Check-In with Mismatched Email Credentials (Security & Auth Boundary)
    // -------------------------------------------------------------------------
    console.log(`\n[TC14] - Check-In with Mismatched Email on Valid PNR: ${var_pnr}`);
    {
      const payload = {
        pnr: var_pnr,
        passengerEmail: 'imposter@example.com'
      };
      const res = await request('/api/check-in', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      assert.strictEqual(res.status, 403, 'TC14: Expected 403 Forbidden');
      assert.ok(res.data.error.includes('Email verification failed'), 'TC14: Error message validation');
      console.log('  ✓ Passed: Unauthorized check-in blocked with 403 Forbidden.');
    }

    // -------------------------------------------------------------------------
    // TC15: Booking Cancellation & Seat Release State Integrity (State Rollback)
    // -------------------------------------------------------------------------
    console.log(`\n[TC15] - Cancel Booking ${var_pnr} and Verify Seat ${var_seatNumber} Released`);
    {
      const res = await request(`/api/bookings/${var_pnr}/cancel`, { method: 'POST' });
      assert.strictEqual(res.status, 200, 'TC15: Expected 200 OK');
      assert.strictEqual(res.data.status, 'CANCELLED');

      // Verify seat is available again via seat map
      const seatRes = await request(`/api/flights/${var_flightNumber}/seats`);
      const seat = seatRes.data.find(s => s.seatNumber === var_seatNumber);
      assert.strictEqual(seat.status, 'available', 'Seat status must rollback to available');
      console.log(`  ✓ Passed: Booking cancelled and Seat ${var_seatNumber} restored to available.`);
    }

    console.log('\n===============================================================');
    console.log('  ✅ ALL 15 SYSTEM TESTING TEST CASES PASSED SUCCESSFULLY!');
    console.log('===============================================================\n');

  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
  }
}

runTests();
