const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session for an appointment
 * @param {number} amount Amount in INR
 * @param {string} appointmentId 
 * @param {string} patientEmail
 * @returns {Promise<Object>}
 */
const createCheckoutSession = async (amount, appointmentId, patientEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Doctor Consultation Fee',
              description: `Appointment ID: ${appointmentId}`,
            },
            unit_amount: Math.round(amount * 100), // amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?appointment_id=${appointmentId}`,
      customer_email: patientEmail,
      metadata: {
        appointmentId,
      },
    });

    return session;
  } catch (error) {
    throw new Error(`Stripe Session Creation Failed: ${error.message}`);
  }
};

/**
 * Verify Stripe Checkout Session
 * @param {string} sessionId 
 * @returns {Promise<Object>}
 */
const verifySession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    throw new Error(`Stripe Session Verification Failed: ${error.message}`);
  }
};

module.exports = {
  createCheckoutSession,
  verifySession,
};
