import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Room } from './models/Room.js';
import { Booking } from './models/Booking.js';
import { demoRooms } from './data/demoRooms.js';

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
