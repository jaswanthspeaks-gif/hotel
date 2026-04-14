import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    destination: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    type: { type: String, required: true, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    maxGuests: { type: Number, default: 2, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roomSchema.index({ roomNumber: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);
