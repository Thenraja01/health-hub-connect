const { addMinutes, parse, isBefore, isAfter } = require('date-fns');

/**
 * Generates time slots based on start time, end time, and duration
 */
const generateSlots = (schedule, date) => {
  const slots = [];
  const { startTime, endTime, slotDuration, breakStartTime, breakEndTime } = schedule;

  const dayStart = parse(startTime, 'HH:mm', date);
  const dayEnd = parse(endTime, 'HH:mm', date);
  
  let currentSlotStart = dayStart;

  while (isBefore(currentSlotStart, dayEnd)) {
    const currentSlotEnd = addMinutes(currentSlotStart, slotDuration);
    
    let isBreak = false;
    if (breakStartTime && breakEndTime) {
      const bStart = parse(breakStartTime, 'HH:mm', date);
      const bEnd = parse(breakEndTime, 'HH:mm', date);
      
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
