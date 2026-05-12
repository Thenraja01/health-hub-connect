const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

/**
 * Generate a professional prescription PDF
 * @param {Object} data Prescription data (patient, doctor, medicines, etc.)
 * @returns {Promise<Buffer>}
 */
const generatePrescriptionPDF = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    // --- Header ---
    doc.fillColor('#0d9488').fontSize(24).text('Health Hub', { align: 'right' });
    doc.fillColor('#444444').fontSize(10).text('Smart Healthcare Platform', { align: 'right' });
    doc.moveDown();

    // --- Hospital/Clinic Info ---
    doc.fillColor('#000000').fontSize(14).text(data.hospitalName || 'Health Hub Clinic', { bold: true });
    doc.fontSize(10).text(data.hospitalAddress || 'Digital Consultation');
    doc.text(`Date: ${format(new Date(), 'PPP')}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e5e7eb');
    doc.moveDown();

    // --- Doctor & Patient Info ---
    const top = doc.y;
    doc.fontSize(12).text('DOCTOR DETAILS', 50, top, { underline: true });
    doc.fontSize(10).text(`Dr. ${data.doctorName}`, 50, top + 20);
    doc.text(`${data.doctorQualification || 'General Physician'}`, 50, top + 35);
    doc.text(`Reg No: ${data.licenseNumber || 'N/A'}`, 50, top + 50);

    doc.fontSize(12).text('PATIENT DETAILS', 350, top, { underline: true });
    doc.fontSize(10).text(`Name: ${data.patientName}`, 350, top + 20);
    doc.text(`Age/Sex: ${data.patientAge || 'N/A'} / ${data.patientGender || 'N/A'}`, 350, top + 35);
    doc.text(`Patient ID: ${data.patientCode}`, 350, top + 50);

    doc.moveDown(5);

    // --- Rx Symbol ---
    doc.fillColor('#0d9488').fontSize(24).text('Rx', 50, doc.y);
    doc.moveDown();

    // --- Medicines Table ---
    doc.fillColor('#000000').fontSize(12).text('MEDICINES', { underline: true });
    doc.moveDown(0.5);

    if (data.medicines && data.medicines.length > 0) {
      data.medicines.forEach((med, i) => {
        doc.fontSize(11).text(`${i + 1}. ${med.name}`, { bold: true });
        doc.fontSize(10).text(`   Dosage: ${med.dosage} | Frequency: ${med.frequency} | Duration: ${med.duration}`, { color: '#666666' });
        doc.text(`   Instruction: ${med.instruction || 'None'}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(10).text('No medicines prescribed.');
    }

    doc.moveDown();

    // --- Notes & Advice ---
    if (data.doctorNotes) {
      doc.fontSize(12).text('ADVICE / NOTES', { underline: true });
      doc.fontSize(10).text(data.doctorNotes);
      doc.moveDown();
    }

    // --- Footer ---
    const footerY = doc.page.height - 100;
    doc.moveTo(50, footerY).lineTo(550, footerY).stroke('#e5e7eb');
    doc.fontSize(10).text('Doctor Signature', 400, footerY + 20, { align: 'right' });
    doc.fontSize(8).text('This is a computer-generated prescription.', 50, footerY + 40, { align: 'center', color: '#999999' });

    doc.end();
  });
};

module.exports = {
  generatePrescriptionPDF,
};
