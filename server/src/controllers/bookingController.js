import { validationResult } from 'express-validator';
import { Booking } from '../models/Booking.js';
import { Room } from '../models/Room.js';
import { nightsBetween } from './roomController.js';

async function hasOverlap(roomId, checkIn, checkOut, excludeBookingId) {
  const q = {
    room: roomId,
    status: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) {
    q._id = { $ne: excludeBookingId };
  }
  const existing = await Booking.findOne(q);
  return Boolean(existing);
}

export async function createBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { roomId, checkIn, checkOut, guests, promoCode } = req.body;
    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }
    if (guests > room.maxGuests) {
      return res.status(400).json({ message: `This room allows up to ${room.maxGuests} guests` });
    }
    if (await hasOverlap(room._id, start, end)) {
      return res.status(409).json({ message: 'Room is not available for those dates' });
    }
    const nights = nightsBetween(start, end);
    const totalPrice = nights * room.pricePerNight;
    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      checkIn: start,
      checkOut: end,
      guests,
      promoCode: promoCode || '',
      totalPrice,
      status: 'pending',
    });
    const populated = await booking.populate('room');
    res.status(201).json({ booking: populated });
  } catch (e) {
    next(e);
  }
}

export async function myBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (e) {
    next(e);
  }
}

export async function cancelMyBooking(req, res, next) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.json({ booking });
    }
    booking.status = 'cancelled';
    await booking.save();
    const populated = await booking.populate('room');
    res.json({ booking: populated });
  } catch (e) {
    next(e);
  }
}

export async function adminListBookings(req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email role')
      .populate('room')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (e) {
    next(e);
  }
}

export async function adminUpdateBookingStatus(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.json({ booking });
  } catch (e) {
    next(e);
  }
}

export async function adminDeleteBooking(req, res, next) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (e) {
    next(e);
  }
}
