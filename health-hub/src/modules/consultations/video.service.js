/**
 * Video Consultation Service
 * Uses Jitsi Meet for open-source video meetings
 */

/**
 * Generate a meeting link for an appointment
 * @param {string} appointmentId 
 * @returns {string} Meeting URL
 */
const generateMeetingLink = (appointmentId) => {
  const domain = 'meet.jit.si';
  const roomName = `HealthHub-${appointmentId}`;
  return `https://${domain}/${roomName}`;
};

/**
 * Get meeting credentials/config if using a paid service like Twilio
 */
const getMeetingConfig = async (appointmentId) => {
  return {
    roomName: `HealthHub-${appointmentId}`,
    apiKey: process.env.VIDEO_API_KEY || 'mock_key',
    // In a real app, you'd generate a JWT here for Twilio/Daily.co
  };
};

module.exports = {
  generateMeetingLink,
  getMeetingConfig,
};
