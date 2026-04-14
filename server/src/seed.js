import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Room } from './models/Room.js';
import { Booking } from './models/Booking.js';

const demoRooms = [
  {
    roomNumber: 'WC-101',
    title: 'Wild Coast Tented Lodge',
    destination: 'Wilpattu',
    location: 'Wilpattu National Park, Sri Lanka',
    type: 'Luxury Suite',
    pricePerNight: 420,
    maxGuests: 3,
    description:
      'Safari-chic cocoon suites with panoramic views, private plunge pool, and curated island dining.',
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    roomNumber: 'KD-204',
    title: 'Kandy Hill Manor',
    destination: 'Kandy',
    location: 'Temple of the Sacred Tooth vicinity',
    type: 'Deluxe',
    pricePerNight: 185,
    maxGuests: 2,
    description: 'Colonial elegance with misty mountain mornings and spice garden walks.',
    imageUrl:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    roomNumber: 'NE-88',
    title: 'Nuwara Eliya Tea Estate Villa',
    destination: 'Nuwara Eliya',
    location: 'Central Highlands',
    type: 'Suite',
    pricePerNight: 265,
    maxGuests: 4,
    description: 'Fireplace evenings, rolling tea terraces, and butler-style service.',
    imageUrl:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  },
  {
    roomNumber: 'CL-12',
    title: 'Coastal Lagoon Residence',
    destination: 'Wilpattu',
    location: 'Northwest Coast',
    type: 'Deluxe',
    pricePerNight: 210,
    maxGuests: 2,
    description: 'Sunset decks over lagoon waters with chef-led tasting menus.',
    imageUrl:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  },
];

async function seed() {
  await connectDB();
  await Booking.deleteMany({});
  await Room.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@resort.lk', 'guest@resort.lk'] } });

  const admin = await User.create({
    name: 'Resort Admin',
    email: 'admin@resort.lk',
    password: 'Admin123!',
    role: 'admin',
  });

  const guest = await User.create({
    name: 'Demo Guest',
    email: 'guest@resort.lk',
    password: 'Guest123!',
    role: 'user',
  });

  const rooms = await Room.insertMany(demoRooms);

  const sampleBooking = await Booking.create({
    user: guest._id,
    room: rooms[1]._id,
    checkIn: new Date(Date.now() + 86400000 * 5),
    checkOut: new Date(Date.now() + 86400000 * 8),
    guests: 2,
    status: 'confirmed',
    totalPrice: 185 * 3,
  });

  console.log('Seed complete.');
  console.log('Admin login:', admin.email, '/ Admin123!');
  console.log('Guest login:', guest.email, '/ Guest123!');
  console.log('Rooms:', rooms.length, 'Sample booking:', sampleBooking._id);

  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
