import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';

function nightsBetween(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

async function getBookedRoomIdsInRange(checkIn, checkOut) {
  const overlapping = await Booking.find({
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
    ],
  }).distinct('room');
  return overlapping;
}

export async function listRooms(req, res, next) {
  try {
    const {
      minPrice,
      maxPrice,
      type,
      destination,
      availableFrom,
      availableTo,
      search,
      roomId,
    } = req.query;

    const filter = { isActive: true };
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      filter._id = roomId;
    }
    if (minPrice !== undefined) filter.pricePerNight = { ...filter.pricePerNight, $gte: Number(minPrice) };
    if (maxPrice !== undefined) {
      filter.pricePerNight = { ...filter.pricePerNight, $lte: Number(maxPrice) };
    }
    if (type) filter.type = new RegExp(`^${type}$`, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    let rooms = await Room.find(filter).sort({ createdAt: -1 });

    if (availableFrom && availableTo) {
      const from = new Date(availableFrom);
      const to = new Date(availableTo);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) {
        return res.status(400).json({ message: 'Invalid date range for availability' });
      }
      const busyIds = await getBookedRoomIdsInRange(from, to);
      const busySet = new Set(busyIds.map((id) => String(id)));
      if (req.query.availableOnly === 'true') {
        rooms = rooms.filter((r) => !busySet.has(String(r._id)));
      }
      rooms = rooms.map((r) => {
        const obj = r.toObject();
        obj.availableForRange = !busySet.has(String(r._id));
        return obj;
      });
    }

    res.json({ rooms });
  } catch (e) {
    next(e);
  }
}

export async function getRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room || !room.isActive) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ room });
  } catch (e) {
    next(e);
  }
}

export async function createRoom(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const room = await Room.create(req.body);
    res.status(201).json({ room });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'Room number must be unique' });
    }
    next(e);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ room });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'Room number must be unique' });
    }
    next(e);
  }
}

export async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await Booking.deleteMany({ room: room._id });
    res.json({ message: 'Room removed' });
  } catch (e) {
    next(e);
  }
}

export async function adminListRooms(req, res, next) {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (e) {
    next(e);
  }
}

export { nightsBetween };
