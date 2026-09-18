require('dotenv').config();
const dns=require("dns")
dns.setServers(['1.1.1.1','8.8.8.8'])
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./src/db/db');
const User = require('./src/models/usermodel');
const Event = require('./src/models/eventmodel');
const Booking = require('./src/models/bookingmodel');
const OTP = require('./src/models/otpmodel');

const SEED_PASSWORD = 'password123';

const usersData = [
  { username: 'Aarav Mehta', email: 'aarav.mehta@example.com', role: 'user', isVerified: true },
  { username: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'user', isVerified: true },
  { username: 'Rohan Sen', email: 'rohan.sen@example.com', role: 'user', isVerified: true },
  { username: 'Ananya Das', email: 'ananya.das@example.com', role: 'user', isVerified: false },
  { username: 'Vikram Kapoor', email: 'vikram.kapoor@example.com', role: 'user', isVerified: true },
  { username: 'Ishita Roy', email: 'ishita.roy@example.com', role: 'user', isVerified: true },
  { username: 'Aditya Banerjee', email: 'aditya.banerjee@example.com', role: 'user', isVerified: false },
  { username: 'Sneha Nair', email: 'sneha.nair@example.com', role: 'user', isVerified: true },
  { username: 'Rahul Chatterjee', email: 'rahul.chatterjee@example.com', role: 'admin', isVerified: true },
  { username: 'Meera Iyer', email: 'meera.iyer@example.com', role: 'admin', isVerified: true },
];

const eventsData = [
  {
    title: 'Kolkata Tech Summit 2026',
    description: 'A full-day technology summit covering AI, cloud computing, cybersecurity, and modern software development.',
    date: '2026-10-10T10:00:00+05:30',
    location: 'Biswa Bangla Convention Centre, Kolkata',
    price: 1499,
    totalSeats: 500,
    createdByAdminIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  {
    title: 'Future of AI Meetup',
    description: 'An interactive meetup exploring practical applications of artificial intelligence and generative AI.',
    date: '2026-10-18T15:00:00+05:30',
    location: 'WeWork, Bengaluru',
    price: 799,
    totalSeats: 180,
    createdByAdminIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  },
  {
    title: 'Indie Music Night',
    description: 'An evening featuring emerging independent artists, live performances, and local music creators.',
    date: '2026-10-24T18:30:00+05:30',
    location: 'The Habitat, Mumbai',
    price: 999,
    totalSeats: 300,
    createdByAdminIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
  },
  {
    title: 'Startup Founders Networking',
    description: 'A networking event for startup founders, builders, investors, and aspiring entrepreneurs.',
    date: '2026-11-01T11:00:00+05:30',
    location: 'T-Hub, Hyderabad',
    price: 1299,
    totalSeats: 250,
    createdByAdminIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
  },
  {
    title: 'Photography Masterclass',
    description: 'A practical workshop covering composition, lighting, street photography, and visual storytelling.',
    date: '2026-11-08T10:30:00+05:30',
    location: 'Kala Ghoda Arts Precinct, Mumbai',
    price: 1999,
    totalSeats: 80,
    createdByAdminIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848',
  },
  {
    title: 'Modern Web Development Workshop',
    description: 'A hands-on workshop covering React, Node.js, APIs, databases, deployment, and production practices.',
    date: '2026-11-15T10:00:00+05:30',
    location: 'HITEC City, Hyderabad',
    price: 1499,
    totalSeats: 120,
    createdByAdminIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    title: 'Contemporary Art Exhibition',
    description: 'A curated exhibition showcasing contemporary artists and experimental visual works.',
    date: '2026-11-21T17:00:00+05:30',
    location: 'National Gallery of Modern Art, Bengaluru',
    price: 499,
    totalSeats: 200,
    createdByAdminIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
  },
  {
    title: 'Career Growth Conference',
    description: 'Sessions on career development, leadership, interviews, communication, and professional growth.',
    date: '2026-11-29T09:30:00+05:30',
    location: 'India Habitat Centre, New Delhi',
    price: 999,
    totalSeats: 350,
    createdByAdminIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
  },
  {
    title: 'Game Developers Meetup',
    description: 'A community event for game developers, designers, artists, and indie game enthusiasts.',
    date: '2026-12-06T14:00:00+05:30',
    location: 'Pune International Exhibition and Convention Centre, Pune',
    price: 699,
    totalSeats: 220,
    createdByAdminIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
  },
  {
    title: 'Winter Cultural Festival',
    description: 'A celebration of music, food, art, performances, and cultural traditions from across India.',
    date: '2026-12-19T16:00:00+05:30',
    location: 'Eco Park, Kolkata',
    price: 599,
    totalSeats: 1000,
    createdByAdminIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
  },
];

// [userIndex, eventIndex, status]
const bookingPlan = [
  [0, 0, 'confirmed'],
  [1, 0, 'confirmed'],
  [2, 0, 'pending'],
  [3, 1, 'confirmed'],
  [4, 1, 'pending'],
  [5, 1, 'cancelled'],
  [6, 2, 'confirmed'],
  [7, 2, 'pending'],
  [0, 3, 'confirmed'],
  [1, 3, 'confirmed'],
  [2, 3, 'pending'],
  [3, 4, 'confirmed'],
  [4, 4, 'cancelled'],
  [5, 5, 'confirmed'],
  [6, 5, 'pending'],
  [7, 5, 'confirmed'],
  [0, 6, 'confirmed'],
  [1, 6, 'pending'],
  [2, 7, 'confirmed'],
  [3, 7, 'cancelled'],
  [4, 8, 'confirmed'],
  [5, 8, 'pending'],
  [6, 9, 'confirmed'],
  [7, 9, 'pending'],
  [8, 2, 'confirmed'],
  [9, 4, 'confirmed'],
];

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  console.log('Connecting to MongoDB...');
  await connectDB();

  try {
    // This script is intended for a development/test database.
    // Delete dependent documents first so no dangling references remain.
    console.log('Clearing existing seed data...');
    await Booking.deleteMany({});
    await Event.deleteMany({});
    await OTP.deleteMany({});
    await User.deleteMany({});

    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

    const users = await User.insertMany(
      usersData.map((user) => ({
        username: user.username,
        email: user.email,
        role: user.role,
        password: hashedPassword,
        isVerified: user.isVerified,
      }))
    );

    console.log(`Created ${users.length} users.`);

    console.log('Creating events...');
    const events = await Event.insertMany(
      eventsData.map((event) => ({
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        location: event.location,
        price: event.price,
        totalSeats: event.totalSeats,
        // Start with all seats available. Confirmed bookings below will
        // decrement availability to keep the event data internally consistent.
        availableSeats: event.totalSeats,
        createdBy: users.filter((user) => user.role === 'admin')[event.createdByAdminIndex]._id,
        imageUrl: event.imageUrl,
      }))
    );

    console.log(`Created ${events.length} events.`);

    console.log('Creating bookings...');
    const bookings = bookingPlan.map(([userIndex, eventIndex, status]) => ({
      userId: users[userIndex]._id,
      eventId: events[eventIndex]._id,
      status,
      paymentStatus: status === 'confirmed' ? 'paid' : 'unpaid',
      amount: events[eventIndex].price,
    }));

    const createdBookings = await Booking.insertMany(bookings);

    // Keep availableSeats consistent with the number of confirmed bookings.
    const confirmedCounts = new Map();

    for (const booking of bookingPlan) {
      const [userIndex, eventIndex, status] = booking;

      if (status === 'confirmed') {
        const key = String(events[eventIndex]._id);
        confirmedCounts.set(key, (confirmedCounts.get(key) || 0) + 1);
      }

      // Accessing these indexes here also guarantees the relationship data
      // used above corresponds to seeded documents.
      void users[userIndex];
    }

    for (const event of events) {
      const confirmedCount = confirmedCounts.get(String(event._id)) || 0;
      if (confirmedCount > event.totalSeats) {
        throw new Error(`Seed data would exceed available seats for event "${event.title}"`);
      }

      if (confirmedCount > 0) {
        event.availableSeats = event.totalSeats - confirmedCount;
        await event.save();
      }
    }

    console.log(`Created ${createdBookings.length} bookings.`);

    console.log('Creating OTP records...');
    const now = new Date();

    const otpData = [
      {
        email: users[3].email,
        otp: '483921',
        actions: 'verification',
        createdAt: new Date(now.getTime() - 30 * 1000),
      },
      {
        email: users[6].email,
        otp: '716304',
        actions: 'verification',
        createdAt: new Date(now.getTime() - 45 * 1000),
      },
      {
        email: users[1].email,
        otp: '295817',
        actions: 'event_confirmation',
        createdAt: new Date(now.getTime() - 60 * 1000),
      },
      {
        email: users[2].email,
        otp: '604238',
        actions: 'event_confirmation',
        createdAt: new Date(now.getTime() - 90 * 1000),
      },
    ];

    const otps = await OTP.insertMany(otpData);
    console.log(`Created ${otps.length} OTP records.`);

    console.log('\nDatabase seeded successfully!');
    console.log(`Users:    ${users.length}`);
    console.log(`Events:   ${events.length}`);
    console.log(`Bookings: ${createdBookings.length}`);
    console.log(`OTPs:     ${otps.length}`);
    console.log(`\nDevelopment password for seeded users: ${SEED_PASSWORD}`);
  } catch (error) {
    console.error('\nDatabase seeding failed:', error.message);
    throw error;
  } finally {
    console.log('\nDisconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

seedDatabase().catch((error) => {
  console.error('Seed process failed.');
  console.error(error.message);
  process.exitCode = 1;
});
