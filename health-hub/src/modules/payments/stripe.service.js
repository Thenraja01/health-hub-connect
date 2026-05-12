const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Connect Account for a doctor
 * @param {string} email 
 * @returns {Promise<Object>}
 */
const createConnectAccount = async (email) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    return account;
  } catch (error) {
    throw new Error(`Stripe Connect Account Creation Failed: ${error.message}`);
  }
};

/**
 * Create an account link for Stripe Onboarding
 * @param {string} accountId 
 * @returns {Promise<Object>}
 */
const createAccountLink = async (accountId) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/doctor/stripe-onboarding?status=refresh`,
      return_url: `${process.env.FRONTEND_URL}/doctor/stripe-onboarding?status=success`,
      type: 'account_onboarding',
    });
    return accountLink;
  } catch (error) {
    throw new Error(`Stripe Account Link Creation Failed: ${error.message}`);
  }
};

/**
 * Create a Stripe Checkout Session for an appointment with commission split
 * @param {number} amount Total Amount in USD
 * @param {string} appointmentId 
 * @param {string} patientEmail
 * @param {string} doctorStripeAccountId
 * @param {number} commissionRate Percentage (e.g. 20)
 * @returns {Promise<Object>}
 */
const createCheckoutSession = async (amount, appointmentId, patientEmail, doctorStripeAccountId, commissionRate = 20) => {
  try {
    const totalAmountCents = Math.round(amount * 100);
    const applicationFeeCents = Math.round(totalAmountCents * (commissionRate / 100));

    const sessionData = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Doctor Consultation Fee',
              description: `Appointment ID: ${appointmentId}`,
            },
            unit_amount: totalAmountCents,
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
    };

    // If doctor has a connected account, split the payment
    if (doctorStripeAccountId) {
      sessionData.payment_intent_data = {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: doctorStripeAccountId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);
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
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    return session;
  } catch (error) {
    throw new Error(`Stripe Session Verification Failed: ${error.message}`);
  }
};

/**
 * Retrieve Account Status
 * @param {string} accountId 
 */
const getAccount = async (accountId) => {
    return await stripe.accounts.retrieve(accountId);
};

/**
 * Create a Transfer to a connected account (Manual Withdrawal)
 * @param {number} amount In USD
 * @param {string} destination Account ID
 */
const createTransfer = async (amount, destination) => {
    return await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        destination: destination,
    });
};

module.exports = {
  createConnectAccount,
  createAccountLink,
  createCheckoutSession,
  verifySession,
  getAccount,
  createTransfer
};
