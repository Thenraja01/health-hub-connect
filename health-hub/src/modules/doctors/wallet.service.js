const prisma = require('../../config/database');
const stripeService = require('../payments/stripe.service');

/**
 * Request a withdrawal for a doctor
 * @param {string} doctorId 
 * @param {number} amount 
 */
const requestWithdrawal = async (doctorId, amount) => {
    return await prisma.$transaction(async (tx) => {
        const wallet = await tx.doctorWallet.findUnique({
            where: { doctorId }
        });

        if (!wallet || wallet.availableBalance < amount) {
            throw new Error('Insufficient balance');
        }

        const doctor = await tx.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!doctor.stripeAccountId || !doctor.stripeOnboardingComplete) {
            throw new Error('Stripe onboarding not complete');
        }

        // 1. Create Withdrawal Record
        const withdrawal = await tx.withdrawal.create({
            data: {
                doctorId,
                amount,
                status: 'PENDING'
            }
        });

        // 2. Decrement Wallet Balance
        await tx.doctorWallet.update({
            where: { doctorId },
            data: {
                availableBalance: { decrement: amount },
                pendingBalance: { increment: amount }
            }
        });

        // 3. Process Stripe Transfer
        try {
            const transfer = await stripeService.createTransfer(amount, doctor.stripeAccountId);
            
            // 4. Update withdrawal status
            await tx.withdrawal.update({
                where: { id: withdrawal.id },
                data: {
                    status: 'PAID',
                    stripeTransferId: transfer.id,
                    processedAt: new Date()
                }
            });

            // 5. Update wallet pending balance
            await tx.doctorWallet.update({
                where: { doctorId },
                data: {
                    pendingBalance: { decrement: amount }
                }
            });

            return transfer;
        } catch (error) {
            // If transfer fails, rollback balances or mark as failed
            await tx.withdrawal.update({
                where: { id: withdrawal.id },
                data: { status: 'FAILED' }
            });
            
            await tx.doctorWallet.update({
                where: { doctorId },
                data: {
                    availableBalance: { increment: amount },
                    pendingBalance: { decrement: amount }
                }
            });
            
            throw new Error(`Stripe Transfer Failed: ${error.message}`);
        }
    });
};

const getDoctorWallet = async (doctorId) => {
    return await prisma.doctorWallet.findUnique({
        where: { doctorId }
    });
};

module.exports = {
    requestWithdrawal,
    getDoctorWallet
};
