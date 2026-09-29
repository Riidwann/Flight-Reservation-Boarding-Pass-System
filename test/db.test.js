const assert = require('assert');
const db = require('../src/db');

console.log('--- Running Database Layer Tests ---');

// 1. Reset DB
db.resetDatabase();
const initialFlights = db.getFlights();
assert.strictEqual(initialFlights.length, 3, 'Should have 3 initial flights');
console.log('✓ Reset and Initial flights verified');

// 2. Flight search
const cgkDps = db.getFlights('CGK', 'DPS');
assert.strictEqual(cgkDps.length, 1, 'Should find 1 flight for CGK to DPS');
assert.strictEqual(cgkDps[0].flightNumber, 'AW-101');
console.log('✓ Flight search verified');

// 3. Seats inventory
const seats = db.getSeats('AW-101');
assert.strictEqual(seats.length, 30, 'Flight AW-101 should have 30 seats');
assert.strictEqual(seats[0].seatNumber, '1A');
assert.strictEqual(seats[0].status, 'available');
console.log('✓ Seats inventory verified');

// 4. Create booking
const booking = db.createBooking({
  flightNumber: 'AW-101',
  passengerName: 'Test Passenger',
  passengerEmail: 'test@example.com',
  passengerPassport: 'T1234567',
  seatNumber: '1A'
});
assert.ok(booking.pnr, 'Should generate a PNR');
assert.strictEqual(booking.status, 'CONFIRMED');
assert.strictEqual(booking.seatNumber, '1A');
console.log('✓ Create booking verified (PNR:', booking.pnr + ')');

// 5. Verify seat status updated
const updatedSeats = db.getSeats('AW-101');
const seat1A = updatedSeats.find(s => s.seatNumber === '1A');
assert.strictEqual(seat1A.status, 'reserved', 'Seat 1A should now be reserved');
console.log('✓ Seat status transition to reserved verified');

// 6. Collision / Double booking prevention
assert.throws(() => {
  db.createBooking({
    flightNumber: 'AW-101',
    passengerName: 'Intruder',
    passengerEmail: 'intruder@example.com',
    passengerPassport: 'X999',
    seatNumber: '1A'
  });
}, (err) => {
  assert.strictEqual(err.statusCode, 409);
  return true;
}, 'Should throw 409 for already reserved seat');
console.log('✓ Collision / double-booking 409 prevention verified');

// 7. Check-in with wrong email (should throw 403)
assert.throws(() => {
  db.checkIn({ pnr: booking.pnr, passengerEmail: 'wrong@example.com' });
}, (err) => {
  assert.strictEqual(err.statusCode, 403);
  return true;
}, 'Should throw 403 for mismatched email');
console.log('✓ Check-in security email mismatch 403 verified');

// 8. Successful check-in
const bp = db.checkIn({ pnr: booking.pnr, passengerEmail: 'test@example.com' });
assert.strictEqual(bp.status, 'VALID');
assert.strictEqual(bp.pnr, booking.pnr);
assert.ok(bp.gate, 'Should assign a gate');
console.log('✓ Check-in and Boarding Pass issuance verified');

// 9. Duplicate check-in prevention (should throw 400)
assert.throws(() => {
  db.checkIn({ pnr: booking.pnr, passengerEmail: 'test@example.com' });
}, (err) => {
  assert.strictEqual(err.statusCode, 400);
  return true;
}, 'Should throw 400 for duplicate check-in');
console.log('✓ Duplicate check-in prevention 400 verified');

// 10. Cancellation and rollback
const cancelRes = db.cancelBooking(booking.pnr);
assert.strictEqual(cancelRes.status, 'CANCELLED');
const restoredSeats = db.getSeats('AW-101');
const seat1ARestored = restoredSeats.find(s => s.seatNumber === '1A');
assert.strictEqual(seat1ARestored.status, 'available', 'Seat 1A should be restored to available');
console.log('✓ Cancellation and seat rollback to available verified');

// Reset DB back for clean state
db.resetDatabase();
console.log('--- ALL DATABASE UNIT TESTS PASSED ---');
