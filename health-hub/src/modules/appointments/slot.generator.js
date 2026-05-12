const prisma = require('../../config/database');
const { addDays, format, startOfDay, addMinutes, parse } = require('date-fns');

/**
 * Generate slots for a doctor based on their schedule
 * @param {string} doctorId 
 * @param {Date} startDate 
 * @param {number} daysToGenerate 
 */
const generateSlots = async (doctorId, startDate, daysToGenerate = 7) => {
  const schedule = await prisma.doctorSchedule.findMany({
    where: { doctorId },
  });

  if (schedule.length === 0) return [];

  const createdSlots = [];

  for (let i = 0; i < daysToGenerate; i++) {
    const currentDate = addDays(startDate, i);
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const daySchedules = schedule.filter(s => s.dayOfWeek === dayOfWeek);
    if (daySchedules.length === 0) continue;

    // Check for holidays/leaves
    const leave = await prisma.doctorLeave.findFirst({
      where: {
        doctorId,
        leaveDate: {
          gte: startOfDay(currentDate),
          lte: new Date(currentDate.setHours(23, 59, 59, 999))
        }
      },
    });

    if (leave) continue;

    // Fetch doctor's preferred consultation type once
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { consultationType: true }
    });
    const consultationType = doctor?.consultationType || 'VIDEO';

    for (const daySchedule of daySchedules) {
      let currentTime = parse(daySchedule.startTime, 'HH:mm', currentDate);
      const endTime = parse(daySchedule.endTime, 'HH:mm', currentDate);
      const duration = daySchedule.slotDuration || 30;

      while (currentTime < endTime) {
        const slotEnd = addMinutes(currentTime, duration);
        
        // Check if slot already exists
        const existing = await prisma.appointmentSlot.findFirst({
          where: {
            doctorId,
            startsAt: currentTime,
          },
        });

        if (!existing) {
          const slot = await prisma.appointmentSlot.create({
            data: {
              doctorId,
              startsAt: currentTime,
              endsAt: slotEnd,
              slotStatus: 'AVAILABLE',
              consultationType: consultationType,
              scheduleId: daySchedule.id
            },
          });
          createdSlots.push(slot);
        }

        currentTime = slotEnd;
      }
    }
  }

  return createdSlots;
};

module.exports = {
  generateSlots,
};
