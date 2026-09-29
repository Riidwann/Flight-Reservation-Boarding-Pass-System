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
      // CGK -> DPS (Jakarta to Bali)
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
        flightNumber: 'AW-105',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'DPS',
        departureTime: '12:30',
        arrivalTime: '15:20',
        price: 1180000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-107',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'DPS',
        departureTime: '17:15',
        arrivalTime: '20:05',
        price: 1340000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-109',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'DPS',
        departureTime: '20:30',
        arrivalTime: '23:20',
        price: 1090000,
        totalSeats: 30,
        availableSeats: 30
      },

      // DPS -> CGK (Bali to Jakarta)
      {
        flightNumber: 'AW-104',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'CGK',
        departureTime: '07:00',
        arrivalTime: '07:50',
        price: 1210000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-108',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'CGK',
        departureTime: '11:45',
        arrivalTime: '12:35',
        price: 1150000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-110',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'CGK',
        departureTime: '16:30',
        arrivalTime: '17:20',
        price: 1280000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-112',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'CGK',
        departureTime: '21:00',
        arrivalTime: '21:50',
        price: 1120000,
        totalSeats: 30,
        availableSeats: 30
      },

      // CGK -> SUB (Jakarta to Surabaya)
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
        flightNumber: 'AW-114',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'SUB',
        departureTime: '15:00',
        arrivalTime: '16:30',
        price: 820000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-116',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'SUB',
        departureTime: '19:45',
        arrivalTime: '21:15',
        price: 790000,
        totalSeats: 30,
        availableSeats: 30
      },

      // SUB -> CGK (Surabaya to Jakarta)
      {
        flightNumber: 'AW-115',
        airline: 'SkyPass Airlines',
        origin: 'SUB',
        destination: 'CGK',
        departureTime: '06:30',
        arrivalTime: '08:00',
        price: 860000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-117',
        airline: 'SkyPass Airlines',
        origin: 'SUB',
        destination: 'CGK',
        departureTime: '12:15',
        arrivalTime: '13:45',
        price: 830000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-119',
        airline: 'SkyPass Airlines',
        origin: 'SUB',
        destination: 'CGK',
        departureTime: '17:30',
        arrivalTime: '19:00',
        price: 890000,
        totalSeats: 30,
        availableSeats: 30
      },

      // SUB -> DPS (Surabaya to Bali)
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
      },
      {
        flightNumber: 'AW-121',
        airline: 'SkyPass Airlines',
        origin: 'SUB',
        destination: 'DPS',
        departureTime: '18:00',
        arrivalTime: '19:15',
        price: 670000,
        totalSeats: 30,
        availableSeats: 30
      },

      // DPS -> SUB (Bali to Surabaya)
      {
        flightNumber: 'AW-122',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'SUB',
        departureTime: '08:30',
        arrivalTime: '09:45',
        price: 640000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-124',
        airline: 'SkyPass Airlines',
        origin: 'DPS',
        destination: 'SUB',
        departureTime: '15:15',
        arrivalTime: '16:30',
        price: 660000,
        totalSeats: 30,
        availableSeats: 30
      },

      // CGK <-> JOG (Jakarta to Yogyakarta)
      {
        flightNumber: 'AW-201',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'JOG',
        departureTime: '07:15',
        arrivalTime: '08:25',
        price: 720000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-203',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'JOG',
        departureTime: '14:10',
        arrivalTime: '15:20',
        price: 690000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-202',
        airline: 'SkyPass Airlines',
        origin: 'JOG',
        destination: 'CGK',
        departureTime: '09:15',
        arrivalTime: '10:25',
        price: 710000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-204',
        airline: 'SkyPass Airlines',
        origin: 'JOG',
        destination: 'CGK',
        departureTime: '16:40',
        arrivalTime: '17:50',
        price: 740000,
        totalSeats: 30,
        availableSeats: 30
      },

      // CGK <-> KNO (Jakarta to Medan Kualanamu)
      {
        flightNumber: 'AW-301',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'KNO',
        departureTime: '08:45',
        arrivalTime: '11:05',
        price: 1450000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-303',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'KNO',
        departureTime: '16:15',
        arrivalTime: '18:35',
        price: 1480000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-302',
        airline: 'SkyPass Airlines',
        origin: 'KNO',
        destination: 'CGK',
        departureTime: '11:50',
        arrivalTime: '14:10',
        price: 1420000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-304',
        airline: 'SkyPass Airlines',
        origin: 'KNO',
        destination: 'CGK',
        departureTime: '19:20',
        arrivalTime: '21:40',
        price: 1390000,
        totalSeats: 30,
        availableSeats: 30
      },

      // CGK <-> UPG (Jakarta to Makassar)
      {
        flightNumber: 'AW-401',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'UPG',
        departureTime: '06:00',
        arrivalTime: '09:25',
        price: 1580000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-403',
        airline: 'SkyPass Airlines',
        origin: 'CGK',
        destination: 'UPG',
        departureTime: '13:30',
        arrivalTime: '16:55',
        price: 1520000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-402',
        airline: 'SkyPass Airlines',
        origin: 'UPG',
        destination: 'CGK',
        departureTime: '10:15',
        arrivalTime: '11:40',
        price: 1540000,
        totalSeats: 30,
        availableSeats: 30
      },
      {
        flightNumber: 'AW-404',
        airline: 'SkyPass Airlines',
        origin: 'UPG',
        destination: 'CGK',
        departureTime: '17:45',
        arrivalTime: '19:10',
        price: 1590000,
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
