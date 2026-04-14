import { Room } from './models/Room.js';
import { demoRooms } from './data/demoRooms.js';

export async function bootstrapRooms() {
  const roomCount = await Room.countDocuments();
  if (roomCount > 0) {
    return;
  }

  await Room.insertMany(demoRooms, { ordered: false });
  console.log(`Bootstrapped ${demoRooms.length} demo rooms`);
}
