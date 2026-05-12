const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Health Hub" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html
        });
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

const sendBookingSuccess = async (patientEmail, appointmentDetails) => {
    const html = `
        <h1>Appointment Confirmed!</h1>
        <p>Dear Patient, your appointment with Dr. ${appointmentDetails.doctorName} is confirmed.</p>
        <p><strong>Date & Time:</strong> ${appointmentDetails.time}</p>
        <p><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
    `;
    return sendEmail(patientEmail, 'Appointment Confirmation - Health Hub', html);
};

const sendWithdrawalSuccess = async (doctorEmail, amount) => {
    const html = `
        <h1>Withdrawal Successful</h1>
        <p>Your withdrawal of $${amount} has been processed and sent to your Stripe account.</p>
    `;
    return sendEmail(doctorEmail, 'Withdrawal Processed - Health Hub', html);
};

const sendBookingSuccessDoctor = async (doctorEmail, details) => {
    const html = `
        <h1>New Appointment Booked!</h1>
        <p>Dear Dr. ${details.doctorName}, you have a new appointment.</p>
        <p><strong>Patient Name:</strong> ${details.patientName}</p>
        <p><strong>Date & Time:</strong> ${details.time}</p>
        <p><strong>Type:</strong> ${details.type}</p>
    `;
    return sendEmail(doctorEmail, 'New Appointment Notification - Health Hub', html);
};

const sendBookingCancelled = async (patientEmail, appointmentId) => {
    const html = `
        <h1>Appointment Session Cancelled</h1>
        <p>Dear Patient, your appointment booking session (ID: ${appointmentId}) was cancelled.</p>
        <p>If you wish to book again, please visit our platform.</p>
    `;
    return sendEmail(patientEmail, 'Appointment Cancelled - Health Hub', html);
};

module.exports = {
    sendBookingSuccess,
    sendBookingSuccessDoctor,
    sendWithdrawalSuccess,
    sendBookingCancelled
};
