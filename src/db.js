const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'seed.json');

// Generate 6-char PNR
function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = 'SK';
  for (let i = 0; i < 4; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_PATH)) {
        this.resetDatabase();
      } else {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        // Also save initial seed backup if not exists
        if (!fs.existsSync(BACKUP_PATH)) {
          fs.writeFileSync(BACKUP_PATH, raw, 'utf-8');
        }
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      this.resetDatabase();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  resetDatabase() {
    const flights = [
      {
        flightNumber: 'AW-101',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'DPS',
        departureTime: '08:00',
        arrivalTime: '10:50',
        price: 1250000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-102',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'SUB',
        departureTime: '09:30',
        arrivalTime: '11:00',
        price: 850000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-103',
        airline: 'SkyPass Airlines',
        origin: 'SUB',
        destination: 'DPS',
        departureTime: '13:00',
        arrivalTime: '14:15',
        price: 650000,
        totalSeats: 30,
        availableSeats: 30
      }
    ];

    const seats = [];
    const rows = ['1', '2', '3', '4', '5'];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

    flights.forEach(f => {
      rows.forEach(r => {
        cols.forEach(c => {
          seats.push({
            flightNumber: f.flightNumber,
            seatNumber: `${r}${c}`,
            status: 'available',
            passengerName: null
          });
        });
      });
    });

    this.data = {
      flights,
      seats,
      bookings: [],
      boardingPasses: []
    };

    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.save();
    if (!fs.existsSync(BACKUP_PATH)) {
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    }
    return { message: 'Database reset successfully' };
  }

  getFlights(origin, destination) {
    let result = this.data.flights;
    if (origin) {
      result = result.filter(f => f.origin.toUpperCase() === origin.trim().toUpperCase());
    }
    if (destination) {
      result = result.filter(f => f.destination.toUpperCase() === destination.trim().toUpperCase());
    }
    return result;
  }

  getFlight(flightNumber) {
    if (!flightNumber) return null;
    return this.data.flights.find(f => f.flightNumber.toUpperCase() === flightNumber.trim().toUpperCase()) || null;
  }

  getSeats(flightNumber) {
    const flight = this.getFlight(flightNumber);
    if (!flight) return null;
    return this.data.seats.filter(s => s.flightNumber.toUpperCase() === flight.flightNumber.toUpperCase());
  }

  createBooking({ flightNumber, passengerName, passengerEmail, passengerPassport, seatNumber }) {
    const flight = this.getFlight(flightNumber);
    if (!flight) {
      const err = new Error('Flight not found');
      err.statusCode = 404;
      throw err;
    }

    // Check valid seat in cabin (1A - 5F)
    const normalizedSeat = seatNumber ? seatNumber.trim().toUpperCase() : '';
    const seat = this.data.seats.find(
      s => s.flightNumber.toUpperCase() === flight.flightNumber.toUpperCase() && s.seatNumber === normalizedSeat
    );

    if (!seat) {
      const err = new Error(`Invalid seat number ${seatNumber}. Allowed seats are 1A to 5F.`);
      err.statusCode = 400;
      throw err;
    }

    if (seat.status !== 'available') {
      const err = new Error(`Seat ${normalizedSeat} already reserved`);
      err.statusCode = 409;
      throw err;
    }

    // Generate unique PNR
    let pnr = generatePNR();
    while (this.data.bookings.some(b => b.pnr === pnr)) {
      pnr = generatePNR();
    }

    // Lock seat
    seat.status = 'reserved';
    seat.passengerName = passengerName.trim();

    // Decrement flight capacity
    flight.availableSeats = Math.max(0, flight.availableSeats - 1);

    const booking = {
      pnr,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      passengerName: passengerName.trim(),
      passengerEmail: passengerEmail.trim().toLowerCase(),
      passengerPassport: (passengerPassport || '').trim(),
      seatNumber: normalizedSeat,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    this.data.bookings.push(booking);
    this.save();
    return booking;
  }

  getBooking(pnr) {
    if (!pnr) return null;
    return this.data.bookings.find(b => b.pnr.toUpperCase() === pnr.trim().toUpperCase()) || null;
  }

  checkIn({ pnr, passengerEmail }) {
    const booking = this.getBooking(pnr);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    // Verify email ownership
    if (booking.passengerEmail !== passengerEmail.trim().toLowerCase()) {
      const err = new Error('Email verification failed: passenger email does not match booking record');
      err.statusCode = 403;
      throw err;
    }

    // State machine check
    if (booking.status === 'CHECKED_IN') {
      const err = new Error('Already checked in: Boarding pass has already been issued');
      err.statusCode = 400;
      throw err;
    }

    if (booking.status === 'CANCELLED') {
      const err = new Error('Booking is cancelled: Cannot check-in for cancelled booking');
      err.statusCode = 400;
      throw err;
    }

    booking.status = 'CHECKED_IN';

    // Update seat status
    const seat = this.data.seats.find(
      s => s.flightNumber.toUpperCase() === booking.flightNumber.toUpperCase() && s.seatNumber === booking.seatNumber
    );
    if (seat) {
      seat.status = 'checked_in';
    }

    // Generate boarding pass
    const gateList = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
    const assignedGate = gateList[Math.floor(Math.random() * gateList.length)];
    
    // Calculate boarding time (40 min before departure)
    const [depHours, depMins] = booking.departureTime.split(':').map(Number);
    let totalMins = depHours * 60 + depMins - 40;
    if (totalMins < 0) totalMins += 24 * 60;
    const bHour = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const bMin = String(totalMins % 60).padStart(2, '0');
    const boardingTime = `${bHour}:${bMin}`;

    const boardingPass = {
      boardingPassId: `BP-${booking.pnr}-01`,
      pnr: booking.pnr,
      flightNumber: booking.flightNumber,
      origin: booking.origin,
      destination: booking.destination,
      departureTime: booking.departureTime,
      passengerName: booking.passengerName,
      seatNumber: booking.seatNumber,
      gate: assignedGate,
      boardingTime,
      barcodeHash: `SKYPASS-${booking.pnr}-${booking.flightNumber}-${booking.seatNumber}-VALID`,
      status: 'VALID',
      issuedAt: new Date().toISOString()
    };

    // Remove existing boarding pass for this PNR if any, then push
    this.data.boardingPasses = this.data.boardingPasses.filter(bp => bp.pnr !== booking.pnr);
    this.data.boardingPasses.push(boardingPass);

    this.save();
    return boardingPass;
  }

  getBoardingPass(pnr) {
    if (!pnr) return null;
    return this.data.boardingPasses.find(bp => bp.pnr.toUpperCase() === pnr.trim().toUpperCase()) || null;
  }

  cancelBooking(pnr) {
    const booking = this.getBooking(pnr);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.status === 'CANCELLED') {
      const err = new Error('Booking is already cancelled');
      err.statusCode = 400;
      throw err;
    }

    booking.status = 'CANCELLED';

    // Free up seat
    const seat = this.data.seats.find(
      s => s.flightNumber.toUpperCase() === booking.flightNumber.toUpperCase() && s.seatNumber === booking.seatNumber
    );
    if (seat) {
      seat.status = 'available';
      seat.passengerName = null;
    }

    // Increment flight capacity
    const flight = this.getFlight(booking.flightNumber);
    if (flight) {
      flight.availableSeats = Math.min(flight.totalSeats, flight.availableSeats + 1);
    }

    // Invalidate boarding pass
    const bp = this.getBoardingPass(pnr);
    if (bp) {
      bp.status = 'VOID';
    }

    this.save();
    return {
      message: 'Booking cancelled successfully and seat returned to inventory',
      pnr: booking.pnr,
      status: 'CANCELLED',
      freedSeat: booking.seatNumber
    };
  }
}

const db = new Database();
module.exports = db;
