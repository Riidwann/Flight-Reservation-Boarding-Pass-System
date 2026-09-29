const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));

// CORS headers for testing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==================== REST API ENDPOINTS ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    system: 'SkyPass Airlines',
    timestamp: new Date().toISOString()
  });
});

// System Reset (for test isolation)
app.post('/api/system/reset', (req, res) => {
  const result = db.resetDatabase();
  res.status(200).json(result);
});

// 1. Flight Search: GET /api/flights
app.get('/api/flights', (req, res) => {
  const { origin, destination } = req.query;

  // Validation: both parameters are required
  if (!origin) {
    return res.status(400).json({ error: 'origin parameter is required' });
  }
  if (!destination) {
    return res.status(400).json({ error: 'destination parameter is required' });
  }

  const flights = db.getFlights(origin, destination);
  return res.status(200).json(flights);
});

// 2. Seat Map: GET /api/flights/:flightNumber/seats
app.get('/api/flights/:flightNumber/seats', (req, res) => {
  const { flightNumber } = req.params;
  const seats = db.getSeats(flightNumber);

  if (!seats) {
    return res.status(404).json({ error: `Flight not found with number ${flightNumber}` });
  }

  return res.status(200).json(seats);
});

// 3. Create Booking: POST /api/bookings
app.post('/api/bookings', (req, res) => {
  const { flightNumber, passengerName, passengerEmail, passengerPassport, seatNumber } = req.body;

  // Validation: Missing fields
  if (!flightNumber || !passengerName || !passengerEmail || !seatNumber) {
    return res.status(400).json({
      error: 'Missing required booking fields. Required: flightNumber, passengerName, passengerEmail, seatNumber'
    });
  }

  // Validation: Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(passengerEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const booking = db.createBooking({
      flightNumber,
      passengerName,
      passengerEmail,
      passengerPassport,
      seatNumber
    });
    return res.status(201).json(booking);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: err.message });
  }
});

// 4. Retrieve Booking: GET /api/bookings/:pnr
app.get('/api/bookings/:pnr', (req, res) => {
  const { pnr } = req.params;
  const booking = db.getBooking(pnr);

  if (!booking) {
    return res.status(404).json({ error: `Booking not found with PNR ${pnr}` });
  }

  return res.status(200).json(booking);
});

// 5. Web Check-In: POST /api/check-in
app.post('/api/check-in', (req, res) => {
  const { pnr, passengerEmail } = req.body;

  if (!pnr || !passengerEmail) {
    return res.status(400).json({ error: 'pnr and passengerEmail are required for check-in' });
  }

  try {
    const boardingPass = db.checkIn({ pnr, passengerEmail });
    return res.status(200).json(boardingPass);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: err.message });
  }
});

// 6. Retrieve Boarding Pass: GET /api/boarding-pass/:pnr
app.get('/api/boarding-pass/:pnr', (req, res) => {
  const { pnr } = req.params;
  const boardingPass = db.getBoardingPass(pnr);

  if (!boardingPass) {
    return res.status(404).json({ error: `Boarding pass not found for PNR ${pnr}` });
  }

  return res.status(200).json(boardingPass);
});

// 7. Cancel Booking: POST /api/bookings/:pnr/cancel
app.post('/api/bookings/:pnr/cancel', (req, res) => {
  const { pnr } = req.params;

  try {
    const result = db.cancelBooking(pnr);
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: err.message });
  }
});

module.exports = app;
