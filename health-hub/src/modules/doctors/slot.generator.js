const { addMinutes, format, parse, isBefore, isAfter, startOfDay, endOfDay } = require('date-fns');

/**
 * Generates time slots for a doctor based on their schedule
 * @param {Object} schedule - Doctor's schedule object
 * @param {Date} date - Date to generate slots for
 * @returns {Array} List of slots { startsAt, endsAt }
 */
const generateSlots = (schedule, date) => {
  const slots = [];
  const { startTime, endTime, slotDuration, breakStartTime, breakEndTime } = schedule;

  const dayStart = parse(startTime, 'HH:mm', date);
  const dayEnd = parse(endTime, 'HH:mm', date);
  
  let currentSlotStart = dayStart;

  while (isBefore(currentSlotStart, dayEnd)) {
    const currentSlotEnd = addMinutes(currentSlotStart, slotDuration);
    
    // Check if slot falls within break time
    let isBreak = false;
    if (breakStartTime && breakEndTime) {
      const bStart = parse(breakStartTime, 'HH:mm', date);
      const bEnd = parse(breakEndTime, 'HH:mm', date);
      
      // If slot starts during break OR ends during break OR covers the break
      if (
        (isAfter(currentSlotStart, bStart) || currentSlotStart.getTime() === bStart.getTime()) && 
        isBefore(currentSlotStart, bEnd)
      ) {
        isBreak = true;
      }
    }

    if (!isBreak && !isAfter(currentSlotEnd, dayEnd)) {
      slots.push({
        startsAt: currentSlotStart,
        endsAt: currentSlotEnd,
      });
    }

    currentSlotStart = currentSlotEnd;
  }

  return slots;
};

module.exports = { generateSlots };
