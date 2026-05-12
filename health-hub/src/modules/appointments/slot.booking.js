const prisma = require('../../config/database');

/**
 * Validates and locks a slot for booking
 * @param {string} slotId 
 * @returns {Promise<Object>} The validated slot
 */
const reserveSlot = async (slotId) => {
  const slot = await prisma.appointmentSlot.findUnique({
    where: { id: slotId },
  });

  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.slotStatus !== 'AVAILABLE') {
    throw new Error('Slot is already booked or unavailable');
  }

  return slot;
};

module.exports = { reserveSlot };
