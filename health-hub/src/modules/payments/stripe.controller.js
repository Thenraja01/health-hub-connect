const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeService = require('./stripe.service');
const prisma = require('../../config/database');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * Start Stripe Connect Onboarding for Doctor
 */
const onboardDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { wallet: true }
    });

    if (!doctor) return errorResponse(res, 'Doctor not found', 404);

    let stripeAccountId = doctor.stripeAccountId;

    // 1. Create Stripe account if not exists
    if (!stripeAccountId) {
      const account = await stripeService.createConnectAccount(doctor.email);
      stripeAccountId = account.id;

      await prisma.doctor.update({
        where: { id: doctorId },
        data: { stripeAccountId }
      });

      // Initialize wallet if not exists
      if (!doctor.wallet) {
        await prisma.doctorWallet.create({
          data: { doctorId }
        });
      }
    }

    // 2. Create account link
    const accountLink = await stripeService.createAccountLink(stripeAccountId);

    return successResponse(res, { url: accountLink.url }, 'Onboarding link generated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/**
 * Refresh Onboarding Status
 */
const checkOnboardingStatus = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor || !doctor.stripeAccountId) {
      return errorResponse(res, 'Stripe account not initiated');
    }

    const account = await stripeService.getAccount(doctor.stripeAccountId);
    
    const isComplete = account.details_submitted && account.charges_enabled;

    if (isComplete) {
      await prisma.doctor.update({
        where: { id: doctorId },
        data: { stripeOnboardingComplete: true }
      });
    }

    return successResponse(res, { 
      isComplete,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled 
    }, 'Account status retrieved');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/**
 * Handle Stripe Webhook
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const appointmentId = paymentIntent.metadata.appointmentId;

      if (appointmentId) {
        const appointmentService = require('../appointments/appointment.service');
        await appointmentService.confirmAppointment(appointmentId, { 
            sessionId: paymentIntent.metadata.sessionId || '', // We might need to store session ID in metadata too
            paymentIntentId: paymentIntent.id 
        });
      }
      break;
    case 'account.updated':
      const account = event.data.object;
      if (account.details_submitted && account.charges_enabled) {
          await prisma.doctor.updateMany({
              where: { stripeAccountId: account.id },
              data: { stripeOnboardingComplete: true }
          });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  onboardDoctor,
  checkOnboardingStatus,
  handleWebhook
};
